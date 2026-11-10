import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/errors';
import { z } from 'zod';
import { createPokemonSchema, updatePokemonSchema } from './pokemon.schema';
import { deleteCacheByPrefix, getCache, setCache } from '../../lib/redis';

type CreateInput = z.infer<typeof createPokemonSchema>;
type UpdateInput = z.infer<typeof updatePokemonSchema>;
const includeTypes = { types: { include: { type: true } } } satisfies Prisma.PokemonInclude;

async function typeIds(names: string[]) {
  const normalized = [...new Set(names.map((name) => name.toLowerCase()))];
  const types = await prisma.type.findMany({ where: { name: { in: normalized } } });
  if (types.length !== normalized.length) {
    throw new AppError('One or more Pokémon types do not exist', 400);
  }
  return types.map(({ id }) => id);
}

export async function list(params: { search?: string; type?: string; page: number; limit: number; sortBy: 'id' | 'name'; order: 'asc' | 'desc' }) {
  const cacheKey = `pokemon:list:${JSON.stringify(params)}`;
  const cached = await getCache<{ items: ReturnType<typeof toResponse>[]; meta: unknown }>(cacheKey);
  if (cached) return cached;
  const where: Prisma.PokemonWhereInput = {
    ...(params.search ? { name: { contains: params.search, mode: 'insensitive' } } : {}),
    ...(params.type ? { types: { some: { type: { name: params.type.toLowerCase() } } } } : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.pokemon.findMany({ where, include: includeTypes, orderBy: { [params.sortBy]: params.order }, skip: (params.page - 1) * params.limit, take: params.limit }),
    prisma.pokemon.count({ where }),
  ]);
  const result = { items: items.map(toResponse), meta: { page: params.page, limit: params.limit, total, totalPages: Math.ceil(total / params.limit) } };
  await setCache(cacheKey, result);
  return result;
}

export async function findById(id: number) {
  const cacheKey = `pokemon:id:${id}`;
  const cached = await getCache<ReturnType<typeof toResponse>>(cacheKey);
  if (cached) return cached;
  const pokemon = await prisma.pokemon.findUnique({ where: { id }, include: includeTypes });
  if (!pokemon) throw new AppError('Pokémon not found', 404);
  const result = toResponse(pokemon);
  await setCache(cacheKey, result);
  return result;
}

export async function create(input: CreateInput) {
  const ids = await typeIds(input.types);
  const pokemon = await prisma.pokemon.create({
    data: { name: input.name, height: input.height, weight: input.weight, imageUrl: input.imageUrl, types: { create: ids.map((typeId) => ({ typeId })) } },
    include: includeTypes,
  });
  await deleteCacheByPrefix('pokemon:');
  return toResponse(pokemon);
}

export async function update(id: number, input: UpdateInput) {
  await findById(id);
  const data: Prisma.PokemonUpdateInput = { ...input, types: undefined };
  if (input.types) {
    const ids = await typeIds(input.types);
    data.types = { deleteMany: {}, create: ids.map((typeId) => ({ typeId })) };
  }
  const pokemon = await prisma.pokemon.update({ where: { id }, data, include: includeTypes });
  await deleteCacheByPrefix('pokemon:');
  return toResponse(pokemon);
}

export async function remove(id: number) {
  await findById(id);
  await prisma.pokemon.delete({ where: { id } });
  await deleteCacheByPrefix('pokemon:');
}

function toResponse(pokemon: Prisma.PokemonGetPayload<{ include: typeof includeTypes }>) {
  return { id: pokemon.id, name: pokemon.name, height: pokemon.height, weight: pokemon.weight, imageUrl: pokemon.imageUrl, types: pokemon.types.map(({ type }) => type.name), createdAt: pokemon.createdAt, updatedAt: pokemon.updatedAt };
}

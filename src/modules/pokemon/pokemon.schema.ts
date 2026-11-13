import { z } from 'zod';

const typeNames = z.array(z.string().trim().min(1).max(50)).min(1).max(2);
const abilitySchema = z.object({
  name: z.string().trim().min(1).max(100),
  isHidden: z.boolean().default(false),
});

export const createPokemonSchema = z.object({
  name: z.string().trim().min(1).max(100),
  height: z.number().finite().nonnegative(),
  weight: z.number().finite().nonnegative(),
  hp: z.number().int().nonnegative().optional(),
  attack: z.number().int().nonnegative().optional(),
  defense: z.number().int().nonnegative().optional(),
  speed: z.number().int().nonnegative().optional(),
  imageUrl: z.string().url().nullable().optional(),
  types: typeNames,
  abilities: z.array(abilitySchema).min(1).optional(),
});
export const updatePokemonSchema = createPokemonSchema.partial();
export const listPokemonSchema = z.object({
  search: z.string().trim().optional(),
  type: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(['id', 'name']).default('id'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

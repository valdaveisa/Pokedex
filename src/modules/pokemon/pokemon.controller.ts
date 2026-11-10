import { Request, Response } from 'express';
import { success } from '../../utils/api-response';
import { AppError } from '../../utils/errors';
import { createPokemonSchema, listPokemonSchema, updatePokemonSchema } from './pokemon.schema';
import * as service from './pokemon.service';

function idOf(req: Request) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) throw new AppError('Invalid Pokémon ID', 400);
  return id;
}
export async function list(req: Request, res: Response) {
  const result = await service.list(listPokemonSchema.parse(req.query));
  return success(res, result.items, 200, result.meta);
}
export async function get(req: Request, res: Response) { return success(res, await service.findById(idOf(req))); }
export async function create(req: Request, res: Response) { return success(res, await service.create(createPokemonSchema.parse(req.body)), 201); }
export async function update(req: Request, res: Response) { return success(res, await service.update(idOf(req), updatePokemonSchema.parse(req.body))); }
export async function remove(req: Request, res: Response) { await service.remove(idOf(req)); return res.status(204).send(); }

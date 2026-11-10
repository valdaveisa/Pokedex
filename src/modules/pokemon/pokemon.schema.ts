import { z } from 'zod';

const typeNames = z.array(z.string().trim().min(1).max(50)).min(1).max(2);
export const createPokemonSchema = z.object({
  name: z.string().trim().min(1).max(100),
  height: z.number().finite().nonnegative(),
  weight: z.number().finite().nonnegative(),
  imageUrl: z.string().url().nullable().optional(),
  types: typeNames,
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

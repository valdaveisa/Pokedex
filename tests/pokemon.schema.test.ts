import { createPokemonSchema, listPokemonSchema } from '../src/modules/pokemon/pokemon.schema';

describe('Pokemon validation schemas', () => {
  it('accepts a valid Pokémon payload', () => {
    const result = createPokemonSchema.safeParse({
      name: 'Mew',
      height: 0.4,
      weight: 4,
      types: ['psychic'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid measurements and empty types', () => {
    const result = createPokemonSchema.safeParse({
      name: 'Invalid',
      height: -1,
      weight: 'heavy',
      types: [],
    });
    expect(result.success).toBe(false);
  });

  it('applies list defaults', () => {
    expect(listPokemonSchema.parse({})).toEqual({
      page: 1,
      limit: 10,
      sortBy: 'id',
      order: 'asc',
    });
  });
});

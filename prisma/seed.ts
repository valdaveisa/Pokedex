import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const types = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
const pokemon = [
  { name: 'Bulbasaur', height: 0.7, weight: 6.9, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png', types: ['grass', 'poison'] },
  { name: 'Charmander', height: 0.6, weight: 8.5, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png', types: ['fire'] },
  { name: 'Squirtle', height: 0.5, weight: 9, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png', types: ['water'] },
  { name: 'Pikachu', height: 0.4, weight: 6, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', types: ['electric'] },
  { name: 'Eevee', height: 0.3, weight: 6.5, imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png', types: ['normal'] },
];

async function main() {
  await prisma.type.createMany({ data: types.map((name) => ({ name })), skipDuplicates: true });
  for (const item of pokemon) {
    const typeRecords = await prisma.type.findMany({ where: { name: { in: item.types } } });
    await prisma.pokemon.upsert({
      where: { name: item.name },
      update: { imageUrl: item.imageUrl },
      create: { name: item.name, height: item.height, weight: item.weight, imageUrl: item.imageUrl, types: { create: typeRecords.map(({ id }) => ({ typeId: id })) } },
    });
  }
  const passwordHash = await bcrypt.hash('password123', 12);
  await prisma.user.upsert({ where: { email: 'admin@pokedex.local' }, update: { role: 'ADMIN' }, create: { email: 'admin@pokedex.local', passwordHash, role: 'ADMIN' } });
}
main().finally(() => prisma.$disconnect());

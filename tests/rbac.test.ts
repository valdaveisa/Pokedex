process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'test-secret-with-more-than-16-chars';

import jwt from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../src/app';

describe('Pokemon RBAC', () => {
  it('rejects a regular user from mutating Pokémon', async () => {
    const token = jwt.sign(
      { email: 'user@example.com', role: 'USER' },
      process.env.JWT_SECRET as string,
      { subject: '1' },
    );
    const response = await request(app)
      .post('/api/v1/pokemon')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Mew', height: 0.4, weight: 4, types: ['psychic'] });

    expect(response.status).toBe(403);
    expect(response.body.error.message).toBe('You do not have permission to perform this action');
  });
});

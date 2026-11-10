process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'test-secret-with-more-than-16-chars';

import request from 'supertest';
import { app } from '../src/app';

describe('health endpoint', () => {
  it('returns an API health response', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: { status: 'ok' } });
  });
});

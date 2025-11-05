import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';

let app: import('express').Express;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  const mod = await import('../index');
  app = mod.app;
});

describe('index app routes', () => {
  it('root returns OK', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('OK');
  });

  it('swagger docs are served', async () => {
    const res = await request(app).get('/api/docs/');
    expect([200, 301]).toContain(res.status);
  });
});

import { beforeAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import type express from 'express';

let app: express.Express;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  const mod = await import('../../src/index');
  app = mod.app;
});

describe('v1 index routes', () => {
  it('GET /api/v1/health returns ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

import express from 'express';
import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import { z } from 'zod';
import { validateBody } from '@middlewares/validation.middleware';
import { errorHandler } from '@middlewares/error-handler.middleware';

let app: express.Express;

beforeAll(() => {
  app = express();
  app.use(express.json());
  const schema = z.object({ name: z.string().min(1) });
  app.post('/val', validateBody(schema), (_req, res) => res.json({ ok: true }));
  app.use(errorHandler);
});

describe('validateBody middleware', () => {
  it('passes valid payload', async () => {
    const res = await request(app).post('/val').send({ name: 'John' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('rejects invalid payload with 400', async () => {
    const res = await request(app).post('/val').send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation error');
  });
});

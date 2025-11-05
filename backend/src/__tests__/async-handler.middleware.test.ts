import { beforeAll, describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { asyncHandler } from '@middlewares/async-handler.middleware';
import { errorHandler } from '@middlewares/error-handler.middleware';

let app: express.Express;

beforeAll(() => {
  app = express();
  app.get(
    '/ok',
    asyncHandler(async (_req, res) => {
      return res.json({ ok: true });
    }),
  );
  app.get(
    '/boom',
    asyncHandler(async () => {
      throw new Error('boom');
    }),
  );
  app.use(errorHandler);
});

describe('asyncHandler middleware', () => {
  it('returns response when controller resolves', async () => {
    const res = await request(app).get('/ok');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('forwards error to errorHandler when controller throws', async () => {
    const res = await request(app).get('/boom');
    expect(res.status).toBe(500);
  });
});

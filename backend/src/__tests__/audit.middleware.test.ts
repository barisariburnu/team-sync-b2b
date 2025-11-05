import { beforeAll, describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { auditMiddleware } from '@middlewares/audit.middleware';
import logger from '@config/logger.config';

let app: express.Express;

beforeAll(() => {
  app = express();
  app.use(auditMiddleware);
  app.get('/audit', (_req, res) => res.json({ ok: true }));
});

describe('auditMiddleware', () => {
  it('logs audit info on finish', async () => {
    const spy = vi.spyOn(logger, 'info');
    const res = await request(app).get('/audit');
    expect(res.status).toBe(200);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

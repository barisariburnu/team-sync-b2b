import { beforeAll, describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { requestLogger } from '@middlewares/request-logger.middleware';
import logger from '@config/logger.config';

let app: express.Express;

beforeAll(() => {
  app = express();
  app.use(requestLogger);
  app.get('/ping', (_req, res) => res.json({ ok: true }));
});

describe('requestLogger middleware', () => {
  it('logs incoming requests', async () => {
    const spy = vi.spyOn(logger, 'info');
    const res = await request(app).get('/ping');
    expect(res.status).toBe(200);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

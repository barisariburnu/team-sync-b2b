import express from 'express';
import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import { requirePermission } from '@middlewares/permission.middleware';
import type { AuthUser } from '@middlewares/auth.middleware';

let app: express.Express;

beforeAll(() => {
  app = express();
  // Inject a fake user before permission check
  app.use((req, _res, next) => {
    const user: AuthUser = { id: 1, email: 'a@b.com', permissions: ['read:things'] };
    req.user = user;
    next();
  });

  app.get('/allow', requirePermission('read:things'), (_req, res) => res.json({ ok: true }));
  app.get('/deny', requirePermission('manage:things'), (_req, res) => res.json({ ok: true }));
});

describe('requirePermission middleware', () => {
  it('allows when permission present', async () => {
    const res = await request(app).get('/allow');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('denies when permission missing', async () => {
    const res = await request(app).get('/deny');
    expect(res.status).toBe(403);
  });
});

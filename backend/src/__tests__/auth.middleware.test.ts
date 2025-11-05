import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import { describe, it, expect, beforeAll } from 'vitest';

let app: express.Express;
let token: string;
let authenticateJWT: RequestHandler;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
  authenticateJWT = (await import('@middlewares/auth.middleware')).authenticateJWT;
  app = express();
  app.get('/protected', authenticateJWT, (req, res) => {
    return res.json({ user: req.user });
  });
  token = jwt.sign({ id: 1, email: 'x@y.com', permissions: ['read'] }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
});

describe('authenticateJWT middleware', () => {
  it('rejects missing bearer', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });

  it('rejects invalid token', async () => {
    const res = await request(app).get('/protected').set('Authorization', 'Bearer invalid');
    expect(res.status).toBe(401);
  });

  it('accepts valid token and sets user', async () => {
    const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('x@y.com');
  });
});

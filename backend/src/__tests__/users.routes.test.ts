import { beforeAll, describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import type express from 'express';
import type { Request, Response, NextFunction } from 'express';

let app: express.Express;
let token: string;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
  const mod = await import('../../src/index');
  app = mod.app;
  token = jwt.sign(
    { id: 42, email: 'me@example.com', roles: ['user'], permissions: ['read:me'] },
    process.env.JWT_SECRET!,
    {
      expiresIn: '1h',
    },
  );
});

describe('Users routes', () => {
  it('GET /users/me returns current user with valid token', async () => {
    const res = await request(app).get('/api/v1/users/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('me@example.com');
  });

  it('GET /users/me returns 401 without token', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
  });

  it('meController returns 401 when user missing', async () => {
    const { meController } = await import('@modules/users/controllers/users.controller');
    const req = { user: undefined } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;
    await meController(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
});

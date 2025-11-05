import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
let app: import('express').Express;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
  process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
  process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'secret_key';
  const mod = await import('../index');
  app = mod.app;
});

describe('API v1', () => {
  it('health endpoint returns ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('login validation fails without email', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ password: 'password' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation error');
  });

  it('login fails with wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('login succeeds and /users/me returns user', async () => {
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    expect(login.status).toBe(200);
    expect(login.body.access_token).toBeTruthy();

    const me = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${login.body.access_token}`);
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe('test@example.com');
  });

  it('/users/me rejects invalid token', async () => {
    const res = await request(app).get('/api/v1/users/me').set('Authorization', `Bearer invalid`);
    expect(res.status).toBe(401);
  });
});

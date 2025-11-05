import { describe, it, expect, beforeAll } from 'vitest';
import jwt from 'jsonwebtoken';

let authService: typeof import('@modules/auth/services/auth.service');

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
  authService = await import('@modules/auth/services/auth.service');
});

describe('auth.service', () => {
  it('verifyPassword returns true only for literal "password"', async () => {
    const ok = await authService.verifyPassword('password');
    const bad = await authService.verifyPassword('wrong');
    expect(ok).toBe(true);
    expect(bad).toBe(false);
  });

  it('signAccessToken produces a valid JWT with expected payload', () => {
    const payload = {
      id: 123,
      email: 'user@example.com',
      roles: ['user'],
      permissions: ['read:me'],
    };
    const token = authService.signAccessToken(payload);
    expect(typeof token).toBe('string');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    expect(decoded.id).toBe(123);
    expect(decoded.email).toBe('user@example.com');
    expect(decoded.roles).toContain('user');
    expect(decoded.permissions).toContain('read:me');
  });
});

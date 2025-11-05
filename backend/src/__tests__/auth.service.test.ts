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
    interface AccessTokenPayload {
      id: number;
      email: string;
      roles: string[];
      permissions: string[];
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const accessTokenPayload = decoded as unknown as AccessTokenPayload;
    expect(accessTokenPayload.id).toBe(123);
    expect(accessTokenPayload.email).toBe('user@example.com');
    expect(accessTokenPayload.roles).toContain('user');
    expect(accessTokenPayload.permissions).toContain('read:me');
  });
});

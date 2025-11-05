import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('app.config', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('provides defaults when env missing', async () => {
    delete process.env.PORT;
    delete process.env.JWT_SECRET;
    const { config } = await import('@config/app.config');
    expect(config.PORT).toBe('5000');
    expect(config.JWT_SECRET).toBe('super_secret_jwt_key');
  });

  it('reads values from env', async () => {
    process.env.PORT = '8080';
    process.env.JWT_SECRET = 'xyz';
    const { config } = await import('@config/app.config');
    expect(config.PORT).toBe('8080');
    expect(config.JWT_SECRET).toBe('xyz');
  });
});

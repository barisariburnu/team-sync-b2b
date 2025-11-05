import { describe, it, expect, beforeEach } from 'vitest';
import { getEnv } from '@utils/get-env';

describe('getEnv util', () => {
  beforeEach(() => {
    delete process.env.FOO;
  });

  it('returns default when env missing', () => {
    const v = getEnv('FOO', 'bar');
    expect(v).toBe('bar');
  });

  it('returns env value when present', () => {
    process.env.FOO = 'baz';
    const v = getEnv('FOO', 'bar');
    expect(v).toBe('baz');
  });
});

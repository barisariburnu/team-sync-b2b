import { describe, it, expect } from 'vitest';
import { hashValue, compareValue } from '@utils/bcrypt';

describe('bcrypt utils', () => {
  it('hashes and compares true', async () => {
    const h = await hashValue('secret', 6);
    const ok = await compareValue('secret', h);
    expect(ok).toBe(true);
  });

  it('compare returns false for wrong value', async () => {
    const h = await hashValue('secret', 6);
    const ok = await compareValue('nope', h);
    expect(ok).toBe(false);
  });
});

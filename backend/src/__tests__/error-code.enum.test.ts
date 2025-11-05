import { describe, it, expect } from 'vitest';
import { ErrorCodeEnum } from '@enums/error-code.enum';

describe('ErrorCodeEnum', () => {
  it('contains expected keys and values', () => {
    expect(ErrorCodeEnum.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
    expect(ErrorCodeEnum.ACCESS_UNAUTHORIZED).toBe('ACCESS_UNAUTHORIZED');
    expect(ErrorCodeEnum.ACCESS_FORBIDDEN).toBe('ACCESS_FORBIDDEN');
    expect(ErrorCodeEnum.RESOURCE_NOT_FOUND).toBe('RESOURCE_NOT_FOUND');
    expect(ErrorCodeEnum.INTERNAL_SERVER_ERROR).toBe('INTERNAL_SERVER_ERROR');
  });
});

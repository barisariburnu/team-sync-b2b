import { describe, it, expect } from 'vitest';
import { errorHandler } from '@middlewares/error-handler.middleware';
import { HTTP_STATUS } from '@config/http.config';
import { z, ZodError } from 'zod';
import { AppError, ForbiddenException } from '@utils/app-error';

const mockRes = () => {
  const res: any = {};
  res.statusCode = 0;
  res.body = null;
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload: any) => {
    res.body = payload;
    return res;
  };
  return res;
};

describe('errorHandler middleware', () => {
  it('handles SyntaxError as 400', () => {
    const res = mockRes();
    errorHandler(new SyntaxError('bad json'), { path: '/x' } as any, res as any, (() => {}) as any);
    expect(res.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(res.body.message).toContain('Invalid JSON');
  });

  it('handles ZodError as 400', () => {
    const res = mockRes();
    const schema = z.object({ n: z.number() });
    let err: ZodError;
    try {
      schema.parse({ n: 'x' });
    } catch (e) {
      err = e as ZodError;
    }
    errorHandler(err!, { path: '/x' } as any, res as any, (() => {}) as any);
    expect(res.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(res.body.message).toBe('Validation error');
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it('handles AppError with its status', () => {
    const res = mockRes();
    const err = new ForbiddenException('Denied');
    errorHandler(err, { path: '/x' } as any, res as any, (() => {}) as any);
    expect(res.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
    expect(res.body.message).toBe('Denied');
  });

  it('handles unknown errors as 500', () => {
    const res = mockRes();
    errorHandler(new Error('oops'), { path: '/x' } as any, res as any, (() => {}) as any);
    expect(res.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  });
});

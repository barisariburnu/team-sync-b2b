import { describe, it, expect } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { errorHandler } from '@middlewares/error-handler.middleware';
import { HTTP_STATUS } from '@config/http.config';
import { z, ZodError } from 'zod';
import { ForbiddenException } from '@utils/app-error';

const mockRes = () => {
  const res = {
    statusCode: 0,
    body: null as null | { message?: string; errors?: unknown; [k: string]: unknown },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: { message?: string; errors?: unknown; [k: string]: unknown }) {
      this.body = payload;
      return this;
    },
  };
  return res;
};

describe('errorHandler middleware', () => {
  it('handles SyntaxError as 400', () => {
    const res = mockRes();
    const next: NextFunction = () => {};
    errorHandler(
      new SyntaxError('bad json'),
      { path: '/x' } as unknown as Request,
      res as unknown as Response,
      next,
    );
    expect(res.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(res.body?.message).toContain('Invalid JSON');
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
    const next: NextFunction = () => {};
    errorHandler(err!, { path: '/x' } as unknown as Request, res as unknown as Response, next);
    expect(res.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(res.body?.message).toBe('Validation error');
    expect(Array.isArray(res.body?.errors)).toBe(true);
  });

  it('handles AppError with its status', () => {
    const res = mockRes();
    const err = new ForbiddenException('Denied');
    const next: NextFunction = () => {};
    errorHandler(err, { path: '/x' } as unknown as Request, res as unknown as Response, next);
    expect(res.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
    expect(res.body?.message).toBe('Denied');
  });

  it('handles unknown errors as 500', () => {
    const res = mockRes();
    const next: NextFunction = () => {};
    errorHandler(
      new Error('oops'),
      { path: '/x' } as unknown as Request,
      res as unknown as Response,
      next,
    );
    expect(res.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  });
});

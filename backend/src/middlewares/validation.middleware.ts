import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

/** İstek gövdesini verilen Zod şemasına göre doğrular. */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: unknown) {
      return next(err as Error);
    }
  };
};

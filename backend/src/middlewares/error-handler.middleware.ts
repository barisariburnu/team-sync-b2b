import { ErrorRequestHandler, Response } from 'express';
import { HTTP_STATUS } from '@config/http.config';
import { AppError } from '@utils/app-error';
import { z, ZodError } from 'zod';
import { ErrorCodeEnum } from '@enums/error-code.enum';
import logger from '@config/logger.config';

/** Zod doğrulama hatalarını HTTP 400 formatına çevirir. */
const formatZodError = (res: Response, err: z.ZodError): void => {
  const errors = err?.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  res.status(HTTP_STATUS.BAD_REQUEST).json({
    message: 'Validation error',
    errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
  });
};

/** Uygulama genel hata yakalayıcısı. Tanınan hata tiplerine uygun cevap döner. */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  logger.error(`Error occurred on PATH: ${req.path}`, { error: err?.message, stack: err?.stack });

  if (err instanceof SyntaxError) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Invalid JSON payload. Please check your request body.',
      error: err?.message || 'Invalid JSON payload',
    });
    return;
  }

  if (err instanceof ZodError) {
    formatZodError(res, err);
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      error: err.errorCode,
    });
    return;
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error',
    error: err?.message || 'Unknown error occurred',
  });
  return;
};

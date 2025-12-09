import { Request, Response, NextFunction } from 'express';
import logger from '@config/logger.config';

/** İstek-yanıt süresini ve temel metrikleri ölçüp loglar. */
export const auditMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('audit', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration,
      userId: req.user?.id || null,
      ip: req.ip,
    });
  });
  next();
};

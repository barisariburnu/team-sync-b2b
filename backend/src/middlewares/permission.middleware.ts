import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '@utils/app-error';

export const requirePermission = (permission: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const permissions = req.user?.permissions || [];
    if (!permissions.includes(permission)) {
      return next(new ForbiddenException('Insufficient permissions'));
    }
    next();
  };
};

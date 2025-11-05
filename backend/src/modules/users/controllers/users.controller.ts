import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@middlewares/async-handler.middleware';
import { HTTP_STATUS } from '@config/http.config';
import { getCurrentUser } from '@modules/users/services/users.service';

export const meController = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = getCurrentUser(req);
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
    return res.status(HTTP_STATUS.OK).json({ user });
  },
);

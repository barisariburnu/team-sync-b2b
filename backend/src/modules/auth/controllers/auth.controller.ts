import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@middlewares/async-handler.middleware';
import { HTTP_STATUS } from '@config/http.config';
import { signAccessToken, verifyPassword } from '@modules/auth/services/auth.service';

export const loginController = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body as { email: string; password: string };

    const ok = await verifyPassword(password);

    if (!ok) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    const token = signAccessToken({ id: 1, email, roles: ['user'], permissions: ['read:me'] });

    return res.status(HTTP_STATUS.OK).json({ access_token: token, token_type: 'Bearer' });
  },
);

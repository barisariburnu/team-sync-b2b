import { Router } from 'express';
import { authenticateJWT } from '@middlewares/auth.middleware';
import { meController } from '@modules/users/controllers/users.controller';

const router = Router();

router.get('/me', authenticateJWT, meController);

export default router;

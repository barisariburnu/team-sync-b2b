import { Router } from 'express';
import { validateBody } from '@middlewares/validation.middleware';
import { loginSchema } from '@modules/auth/validation/auth.validation';
import { loginController } from '@modules/auth/controllers/auth.controller';

const router = Router();

router.post('/login', validateBody(loginSchema), loginController);

export default router;

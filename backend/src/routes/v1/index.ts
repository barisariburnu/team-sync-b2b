import { Router } from 'express';
import authRoutes from '@routes/v1/auth.routes';
import usersRoutes from '@routes/v1/users.routes';
import organizationsRoutes from '@routes/v1/organizations.routes';

const v1Router = Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/users', usersRoutes);
v1Router.use('/organizations', organizationsRoutes);

v1Router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default v1Router;

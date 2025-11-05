import { Router } from 'express';
import { authenticateJWT } from '@middlewares/auth.middleware';
import { requirePermission } from '@middlewares/permission.middleware';
import { validateBody } from '@middlewares/validation.middleware';
import {
  listOrganizationsController,
  getOrganizationController,
  createOrganizationController,
  updateOrganizationController,
  deleteOrganizationController,
} from '@modules/organization/controllers/organizations.controller';
import {
  organizationCreateSchema,
  organizationUpdateSchema,
} from '@modules/organization/validation/organization.validation';

const router = Router();

router.use(authenticateJWT);

router.get('/', requirePermission('read:organizations'), listOrganizationsController);
router.get('/:id', requirePermission('read:organizations'), getOrganizationController);

router.post(
  '/',
  requirePermission('manage:organizations'),
  validateBody(organizationCreateSchema),
  createOrganizationController,
);

router.patch(
  '/:id',
  requirePermission('manage:organizations'),
  validateBody(organizationUpdateSchema),
  updateOrganizationController,
);

router.delete('/:id', requirePermission('manage:organizations'), deleteOrganizationController);

export default router;

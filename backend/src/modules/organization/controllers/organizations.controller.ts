import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@middlewares/async-handler.middleware';
import { HTTP_STATUS } from '@config/http.config';
import {
  listOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from '@modules/organization/services/organizations.service';

export const listOrganizationsController = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const list = await listOrganizations();
    return res.status(HTTP_STATUS.OK).json({ data: list });
  },
);

export const getOrganizationController = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid id parameter' });
    }
    const org = await getOrganizationById(id);
    if (!org) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Organization not found' });
    }
    return res.status(HTTP_STATUS.OK).json({ data: org });
  },
);

export const createOrganizationController = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name, metadata } = req.body as { name: string; metadata?: Record<string, unknown> };
    const created = await createOrganization({ name, metadata });
    return res.status(HTTP_STATUS.CREATED).json({ data: created });
  },
);

export const updateOrganizationController = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid id parameter' });
    }
    const { name, metadata } = req.body as {
      name?: string;
      metadata?: Record<string, unknown>;
    };
    const existing = await getOrganizationById(id);
    if (!existing) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Organization not found' });
    }
    const updated = await updateOrganization(id, { name, metadata });
    return res.status(HTTP_STATUS.OK).json({ data: updated });
  },
);

export const deleteOrganizationController = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid id parameter' });
    }
    const existing = await getOrganizationById(id);
    if (!existing) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Organization not found' });
    }
    await deleteOrganization(id);
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  },
);

import { z } from 'zod';

export const organizationCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(255, 'Name too long'),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const organizationUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(255, 'Name too long').optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type OrganizationCreateInput = z.infer<typeof organizationCreateSchema>;
export type OrganizationUpdateInput = z.infer<typeof organizationUpdateSchema>;

import { getDb } from '@db/index';
import { organizations } from '@db/schema/index';
import { eq } from 'drizzle-orm';

export interface Organization {
  id: number;
  name: string;
  metadata?: Record<string, unknown> | null;
  createdAt?: Date | null;
}

export const listOrganizations = async (): Promise<Organization[]> => {
  const db = getDb();
  return await db.select().from(organizations);
};

export const getOrganizationById = async (id: number): Promise<Organization | null> => {
  const db = getDb();
  const rows = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
  return rows[0] || null;
};

export const createOrganization = async (
  payload: Pick<Organization, 'name' | 'metadata'>,
): Promise<Organization> => {
  const db = getDb();
  const rows = await db
    .insert(organizations)
    .values({ name: payload.name, metadata: payload.metadata })
    .returning();
  return rows[0]!;
};

export const updateOrganization = async (
  id: number,
  payload: Partial<Pick<Organization, 'name' | 'metadata'>>,
): Promise<Organization | null> => {
  const db = getDb();
  const rows = await db
    .update(organizations)
    .set(payload)
    .where(eq(organizations.id, id))
    .returning();
  return rows[0] || null;
};

export const deleteOrganization = async (id: number): Promise<boolean> => {
  const db = getDb();
  const rows = await db.delete(organizations).where(eq(organizations.id, id)).returning();
  return rows.length > 0;
};

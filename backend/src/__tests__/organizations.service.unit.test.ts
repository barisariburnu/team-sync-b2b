import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create a mutable stub for DB that we can tailor per test
type Options = { selectMode?: 'simple' | 'byId' };
const makeDbStub = (rows: any[] = [], options: Options = { selectMode: 'simple' }) => {
  const selectChain =
    options.selectMode === 'byId'
      ? {
          from: vi.fn(() => ({
            where: vi.fn(() => ({
              limit: vi.fn().mockResolvedValue(rows),
            })),
          })),
        }
      : {
          from: vi.fn().mockResolvedValue(rows),
        };

  const insertChain = {
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue(rows),
  };

  const updateChain = {
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue(rows),
  };

  const deleteChain = {
    where: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue(rows),
  };

  return {
    select: vi.fn(() => selectChain),
    insert: vi.fn(() => insertChain),
    update: vi.fn(() => updateChain),
    delete: vi.fn(() => deleteChain),
  } as any;
};

// Mock @db/index module and control getDb return per test
vi.mock('@db/index', () => ({
  getDb: vi.fn(),
}));

import * as service from '../modules/organization/services/organizations.service';
import * as dbModule from '@db/index';

beforeEach(() => {
  vi.resetAllMocks();
});

describe('organizations.service unit', () => {
  it('listOrganizations returns array', async () => {
    const rows = [
      { id: 1, name: 'Org A', metadata: null },
      { id: 2, name: 'Org B', metadata: null },
    ];
    vi.mocked(dbModule.getDb as any).mockReturnValue(
      makeDbStub(rows, { selectMode: 'simple' }) as any,
    );

    const result = await service.listOrganizations();
    expect(result).toEqual(rows);
  });

  it('getOrganizationById returns first row when exists', async () => {
    const rows = [{ id: 10, name: 'X', metadata: null }];
    vi.mocked(dbModule.getDb as any).mockReturnValue(
      makeDbStub(rows, { selectMode: 'byId' }) as any,
    );

    const result = await service.getOrganizationById(10);
    expect(result).toEqual(rows[0]);
  });

  it('getOrganizationById returns null when not found', async () => {
    vi.mocked(dbModule.getDb as any).mockReturnValue(makeDbStub([], { selectMode: 'byId' }) as any);
    const result = await service.getOrganizationById(999);
    expect(result).toBeNull();
  });

  it('createOrganization returns inserted row', async () => {
    const rows = [{ id: 7, name: 'New', metadata: { a: 1 } }];
    vi.mocked(dbModule.getDb as any).mockReturnValue(makeDbStub(rows) as any);

    const result = await service.createOrganization({ name: 'New', metadata: { a: 1 } });
    expect(result).toEqual(rows[0]);
  });

  it('updateOrganization returns updated row', async () => {
    const rows = [{ id: 7, name: 'Updated', metadata: null }];
    vi.mocked(dbModule.getDb as any).mockReturnValue(makeDbStub(rows) as any);

    const result = await service.updateOrganization(7, { name: 'Updated' });
    expect(result).toEqual(rows[0]);
  });

  it('updateOrganization returns null when no rows', async () => {
    vi.mocked(dbModule.getDb as any).mockReturnValue(makeDbStub([]) as any);
    const result = await service.updateOrganization(7, { name: 'Updated' });
    expect(result).toBeNull();
  });

  it('deleteOrganization returns true when rows affected', async () => {
    vi.mocked(dbModule.getDb as any).mockReturnValue(makeDbStub([{ id: 1 }]) as any);
    const result = await service.deleteOrganization(1);
    expect(result).toBe(true);
  });

  it('deleteOrganization returns false when no rows', async () => {
    vi.mocked(dbModule.getDb as any).mockReturnValue(makeDbStub([]) as any);
    const result = await service.deleteOrganization(1);
    expect(result).toBe(false);
  });
});

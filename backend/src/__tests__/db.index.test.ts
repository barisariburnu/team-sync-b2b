import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('db/index', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('connectPostgres initializes postgres client and drizzle instance', async () => {
    vi.mock('postgres', () => ({ default: vi.fn(() => ({ __client: true })) }));
    vi.mock('drizzle-orm/postgres-js', () => {
      const drizzle = vi.fn(() => ({ __db: true }));
      return { drizzle };
    });

    process.env.POSTGRES_URL = 'postgres://user:password@localhost:5432/test';
    const mod = await import('@db/index');
    const db = mod.connectPostgres();

    expect(db).toEqual({ __db: true });
    const postgresMod = await import('postgres');
    const drizzleMod = await import('drizzle-orm/postgres-js');
    const mockedPostgres = postgresMod.default as unknown as ReturnType<typeof vi.fn>;
    const mockedDrizzle = drizzleMod.drizzle as unknown as ReturnType<typeof vi.fn>;
    expect(mockedPostgres).toHaveBeenCalledWith(
      expect.stringContaining('postgres://'),
      expect.objectContaining({ max: 10, idle_timeout: 20, connect_timeout: 10 }),
    );
    expect(mockedDrizzle).toHaveBeenCalledWith(expect.objectContaining({ __client: true }));
  });

  it('getDb returns existing or connects when none exists', async () => {
    vi.mock('postgres', () => ({ default: vi.fn(() => ({ __client: true })) }));
    vi.mock('drizzle-orm/postgres-js', () => {
      const drizzle = vi.fn(() => ({ __db: true }));
      return { drizzle };
    });

    const mod = await import('@db/index');
    const db1 = mod.getDb();
    expect(db1).toEqual({ __db: true });
    const postgresMod = await import('postgres');
    const drizzleMod = await import('drizzle-orm/postgres-js');
    const mockedPostgres = postgresMod.default as unknown as ReturnType<typeof vi.fn>;
    const mockedDrizzle = drizzleMod.drizzle as unknown as ReturnType<typeof vi.fn>;
    expect(mockedPostgres.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(mockedDrizzle.mock.calls.length).toBeGreaterThanOrEqual(1);

    const db2 = mod.getDb();
    expect(db2).toEqual({ __db: true });
    expect(mockedPostgres.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(mockedDrizzle.mock.calls.length).toBeGreaterThanOrEqual(1);
  });
});

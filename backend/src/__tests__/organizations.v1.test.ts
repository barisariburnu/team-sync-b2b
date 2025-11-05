import request from 'supertest';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';

vi.mock('@modules/organization/services/organizations.service', () => {
  return {
    listOrganizations: vi.fn().mockResolvedValue([]),
    getOrganizationById: vi.fn().mockResolvedValue(null),
    createOrganization: vi.fn().mockResolvedValue({ id: 1, name: 'Test Org', metadata: null }),
    updateOrganization: vi.fn().mockResolvedValue({ id: 1, name: 'Updated', metadata: null }),
    deleteOrganization: vi.fn().mockResolvedValue(true),
  };
});

let orgService: typeof import('@modules/organization/services/organizations.service');

let app: import('express').Express;
let adminToken: string;
let readToken: string;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
  orgService = await import('@modules/organization/services/organizations.service');
  const mod = await import('../index');
  app = mod.app;

  adminToken = jwt.sign(
    {
      id: 1,
      email: 'admin@example.com',
      roles: ['admin'],
      permissions: ['manage:organizations', 'read:organizations'],
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' },
  );

  readToken = jwt.sign(
    { id: 2, email: 'reader@example.com', roles: ['member'], permissions: ['read:organizations'] },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' },
  );
});

beforeEach(() => {
  vi.resetAllMocks();
});

describe('Organizations v1', () => {
  it('requires auth', async () => {
    const res = await request(app).get('/api/v1/organizations');
    expect(res.status).toBe(401);
  });

  it('lists organizations with read permission', async () => {
    vi.mocked(orgService).listOrganizations.mockResolvedValueOnce([]);
    const res = await request(app)
      .get('/api/v1/organizations')
      .set('Authorization', `Bearer ${readToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('forbids create without manage permission', async () => {
    const res = await request(app)
      .post('/api/v1/organizations')
      .set('Authorization', `Bearer ${readToken}`)
      .send({ name: 'Nope' });
    expect(res.status).toBe(403);
  });

  it('creates organization with manage permission', async () => {
    vi.mocked(orgService).createOrganization.mockResolvedValueOnce({ id: 1, name: 'Test Org' });
    const res = await request(app)
      .post('/api/v1/organizations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Org' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Test Org');
  });

  it('fails create with invalid body', async () => {
    const res = await request(app)
      .post('/api/v1/organizations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation error');
  });

  it('get by id returns 400 for invalid id', async () => {
    const res = await request(app)
      .get('/api/v1/organizations/abc')
      .set('Authorization', `Bearer ${readToken}`);
    expect(res.status).toBe(400);
  });

  it('update returns 404 when not found', async () => {
    vi.mocked(orgService).getOrganizationById.mockResolvedValueOnce(null);
    const res = await request(app)
      .patch('/api/v1/organizations/999999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated' });
    expect(res.status).toBe(404);
  });

  it('get by id returns 200 when found', async () => {
    vi.mocked(orgService).getOrganizationById.mockResolvedValueOnce({ id: 1, name: 'Found Org' });
    const res = await request(app)
      .get('/api/v1/organizations/1')
      .set('Authorization', `Bearer ${readToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Found Org');
  });

  it('updates organization successfully', async () => {
    vi.mocked(orgService).getOrganizationById.mockResolvedValueOnce({ id: 1, name: 'Found Org' });
    vi.mocked(orgService).updateOrganization.mockResolvedValueOnce({ id: 1, name: 'Updated' });
    const res = await request(app)
      .patch('/api/v1/organizations/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated');
  });

  it('deletes organization successfully', async () => {
    vi.mocked(orgService).getOrganizationById.mockResolvedValueOnce({ id: 1, name: 'Found Org' });
    vi.mocked(orgService).deleteOrganization.mockResolvedValueOnce(true);
    const res = await request(app)
      .delete('/api/v1/organizations/1')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
  });

  it('delete returns 404 when not found', async () => {
    vi.mocked(orgService).getOrganizationById.mockResolvedValueOnce(null);
    const res = await request(app)
      .delete('/api/v1/organizations/999999')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});

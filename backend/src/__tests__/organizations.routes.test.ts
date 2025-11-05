import { beforeAll, describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import type express from 'express';

// Mock organization services to avoid real DB interactions
vi.mock('@modules/organization/services/organizations.service', () => ({
  listOrganizations: vi.fn(),
  getOrganizationById: vi.fn(),
  createOrganization: vi.fn(),
  updateOrganization: vi.fn(),
  deleteOrganization: vi.fn(),
}));

let app: express.Express;
let readToken: string;
let manageToken: string;
let orgService: any;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
  const mod = await import('../../src/index');
  app = mod.app;
  orgService = await import('@modules/organization/services/organizations.service');

  readToken = jwt.sign(
    { id: 1, email: 'reader@example.com', roles: ['user'], permissions: ['read:organizations'] },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' },
  );

  manageToken = jwt.sign(
    {
      id: 2,
      email: 'manager@example.com',
      roles: ['admin'],
      permissions: ['manage:organizations'],
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' },
  );
});

describe('Organizations routes', () => {
  it('GET /organizations returns list with proper permission', async () => {
    orgService.listOrganizations.mockResolvedValueOnce([
      { id: 1, name: 'Org A', metadata: null },
      { id: 2, name: 'Org B', metadata: null },
    ]);
    const res = await request(app)
      .get('/api/v1/organizations')
      .set('Authorization', `Bearer ${readToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].name).toBe('Org A');
  });

  it('GET /organizations/:id returns 400 for invalid id', async () => {
    const res = await request(app)
      .get('/api/v1/organizations/abc')
      .set('Authorization', `Bearer ${readToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid id parameter');
  });

  it('GET /organizations/:id returns 404 when not found', async () => {
    orgService.getOrganizationById.mockResolvedValueOnce(null);
    const res = await request(app)
      .get('/api/v1/organizations/999')
      .set('Authorization', `Bearer ${readToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Organization not found');
  });

  it('POST /organizations returns 400 for invalid body', async () => {
    const res = await request(app)
      .post('/api/v1/organizations')
      .set('Authorization', `Bearer ${manageToken}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation error');
    expect(res.body.errorCode).toBe('VALIDATION_ERROR');
  });

  it('POST /organizations creates organization with valid body', async () => {
    orgService.createOrganization.mockResolvedValueOnce({
      id: 10,
      name: 'New Org',
      metadata: { a: 1 },
    });
    const res = await request(app)
      .post('/api/v1/organizations')
      .set('Authorization', `Bearer ${manageToken}`)
      .send({ name: 'New Org', metadata: { a: 1 } });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('New Org');
  });

  it('PATCH /organizations/:id returns 400 for invalid id', async () => {
    const res = await request(app)
      .patch('/api/v1/organizations/abc')
      .set('Authorization', `Bearer ${manageToken}`)
      .send({ name: 'Updated' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid id parameter');
  });

  it('PATCH /organizations/:id returns 404 when not found', async () => {
    orgService.getOrganizationById.mockResolvedValueOnce(null);
    const res = await request(app)
      .patch('/api/v1/organizations/123')
      .set('Authorization', `Bearer ${manageToken}`)
      .send({ name: 'Updated Name' });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Organization not found');
  });

  it('PATCH /organizations/:id updates existing organization', async () => {
    orgService.getOrganizationById.mockResolvedValueOnce({
      id: 5,
      name: 'Old Name',
      metadata: null,
    });
    orgService.updateOrganization.mockResolvedValueOnce({
      id: 5,
      name: 'Updated Name',
      metadata: null,
    });
    const res = await request(app)
      .patch('/api/v1/organizations/5')
      .set('Authorization', `Bearer ${manageToken}`)
      .send({ name: 'Updated Name' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated Name');
  });

  it('DELETE /organizations/:id returns 400 for invalid id', async () => {
    const res = await request(app)
      .delete('/api/v1/organizations/xyz')
      .set('Authorization', `Bearer ${manageToken}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid id parameter');
  });

  it('DELETE /organizations/:id returns 404 when not found', async () => {
    orgService.getOrganizationById.mockResolvedValueOnce(null);
    const res = await request(app)
      .delete('/api/v1/organizations/321')
      .set('Authorization', `Bearer ${manageToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Organization not found');
  });

  it('DELETE /organizations/:id returns 204 when deleted', async () => {
    orgService.getOrganizationById.mockResolvedValueOnce({
      id: 7,
      name: 'Del Org',
      metadata: null,
    });
    orgService.deleteOrganization.mockResolvedValueOnce(true);
    const res = await request(app)
      .delete('/api/v1/organizations/7')
      .set('Authorization', `Bearer ${manageToken}`);
    expect(res.status).toBe(204);
  });
});

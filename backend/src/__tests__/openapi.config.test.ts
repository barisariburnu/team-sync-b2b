import { describe, it, expect } from 'vitest';
import { swaggerSpec } from '@config/openapi.config';

describe('OpenAPI config', () => {
  it('exposes valid swagger spec basics', () => {
    const spec = swaggerSpec as unknown as {
      openapi: string;
      info: { title: string };
      servers?: { url: string }[];
      paths?: Record<string, unknown>;
    };
    expect(spec.openapi).toBe('3.0.0');
    expect(spec.info.title).toBe('Team Sync API');
    expect(spec.servers?.[0]?.url).toMatch(/\/api\/v1$/);
  });

  it('includes organizations endpoints in paths', () => {
    const spec = swaggerSpec as unknown as {
      paths?: Record<string, unknown>;
    };
    const paths = spec.paths || {};
    expect(paths).toHaveProperty('/organizations');
    expect(paths).toHaveProperty('/organizations/{id}');
  });
});

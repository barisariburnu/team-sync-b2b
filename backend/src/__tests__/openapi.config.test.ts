import { describe, it, expect } from 'vitest';
import { swaggerSpec } from '@config/openapi.config';

describe('OpenAPI config', () => {
  it('exposes valid swagger spec basics', () => {
    expect(swaggerSpec.openapi).toBe('3.0.0');
    expect(swaggerSpec.info.title).toBe('Umay API');
    expect(swaggerSpec.servers?.[0]?.url).toMatch(/\/api\/v1$/);
  });

  it('includes organizations endpoints in paths', () => {
    const paths = swaggerSpec.paths || {};
    expect(paths).toHaveProperty('/organizations');
    expect(paths).toHaveProperty('/organizations/{id}');
  });
});

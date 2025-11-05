import { appConfig } from '@config/app-config'
import { describe, it, expect } from 'vitest'

describe('appConfig', () => {
  it('provides default API base URL when missing', () => {
    expect(appConfig.VITE_API_BASE_URL).toBeDefined()
    expect(typeof appConfig.VITE_API_BASE_URL).toBe('string')
  })

  it('normalizes boolean flags', () => {
    expect(typeof appConfig.VITE_SENTRY_SEND_DEFAULT_PII).toBe('boolean')
  })
})

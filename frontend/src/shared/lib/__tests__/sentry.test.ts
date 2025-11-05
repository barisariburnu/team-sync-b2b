import * as Sentry from '@sentry/tanstackstart-react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { initSentry, captureException } from '../sentry'

vi.mock('@sentry/tanstackstart-react', async () => {
  const actual = await vi.importActual<
    typeof import('@sentry/tanstackstart-react')
  >('@sentry/tanstackstart-react')
  return {
    ...actual,
    init: vi.fn(),
    captureException: vi.fn(),
    browserTracingIntegration: vi.fn(
      () => ({ name: 'browserTracing' }) as Record<string, unknown>
    ),
    replayIntegration: vi.fn(
      () => ({ name: 'replay' }) as Record<string, unknown>
    ),
  }
})

describe('Sentry integration', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('initSentry skips when DSN is missing', () => {
    import.meta.env.VITE_SENTRY_DSN = undefined

    initSentry()
    expect(Sentry.init).not.toHaveBeenCalled()
  })

  it('initSentry initializes with DSN and integrations', () => {
    import.meta.env.VITE_SENTRY_DSN =
      'https://examplePublicDsn@o0.ingest.sentry.io/0'
    import.meta.env.VITE_SENTRY_ENV = 'test'

    initSentry()
    expect(Sentry.init).toHaveBeenCalled()
    const initMock = vi.mocked(Sentry.init)
    const call = initMock.mock.calls[0]?.[0]
    expect(call.dsn).toContain('examplePublicDsn')
    expect(call.environment).toBe('test')
    expect(call.integrations?.length).toBeGreaterThan(0)
  })

  it('captureException delegates to Sentry', () => {
    const err = new Error('boom')
    captureException(err, { tags: { route: 'test' }, extra: { a: 1 } })
    expect(Sentry.captureException).toHaveBeenCalledWith(err, {
      tags: { route: 'test' },
      extra: { a: 1 },
    })
  })
})

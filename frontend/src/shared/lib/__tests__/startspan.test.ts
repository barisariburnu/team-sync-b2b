import { describe, it, expect, vi } from 'vitest'
import * as Sentry from '@sentry/tanstackstart-react'
import { startSpan } from '@shared/lib/sentry'

vi.mock('@sentry/tanstackstart-react', async () => {
  const actual = await vi.importActual<
    typeof import('@sentry/tanstackstart-react')
  >('@sentry/tanstackstart-react')
  return {
    ...actual,
    startSpan: vi.fn((_options: unknown, cb: () => unknown) => cb()),
  }
})

describe('startSpan wrapper', () => {
  it('delegates to Sentry and returns sync result', () => {
    const result = startSpan({ name: 'sync-op', op: 'test' }, () => 123)
    expect(result).toBe(123)
    expect(Sentry.startSpan).toHaveBeenCalled()
  })

  it('delegates to Sentry and returns async result', async () => {
    const result = await startSpan({ name: 'async-op', op: 'test' }, async () => {
      await new Promise((r) => setTimeout(r, 10))
      return 'ok'
    })
    expect(result).toBe('ok')
    expect(Sentry.startSpan).toHaveBeenCalled()
  })
})
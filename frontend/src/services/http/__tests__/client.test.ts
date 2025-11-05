import type { InternalAxiosRequestConfig } from 'axios'
import { http, exec, type ApiError } from '@services/http'
import { captureException } from '@shared/lib/sentry'
import { vi, describe, it, expect } from 'vitest'
import { useAuthStore } from '@/stores/auth-store'

vi.mock('@shared/lib/sentry', () => {
  return {
    captureException: vi.fn(),
  }
})

describe('HTTP client', () => {
  it('attaches Authorization header when token exists', async () => {
    // Arrange: set token
    useAuthStore.getState().auth.setAccessToken('abc123')

    // Use a custom adapter to capture the final config
    const adapter = async (config: InternalAxiosRequestConfig) => {
      return {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }
    }

    const res = await http.get('/test', { adapter })
    // Assert: request header contains Authorization
    expect(res.config.headers.Authorization).toBe('Bearer abc123')
  })

  it('maps error responses to ApiError with errorCode', async () => {
    const adapter = async () => {
      // Simulate an axios-like rejection shape
      return Promise.reject({
        message: 'Bad Request',
        response: { status: 400, data: { errorCode: 'VALIDATION_ERROR' } },
      })
    }

    try {
      await http.get('/test-error', { adapter })
      expect(false).toBe(true) // should not reach
    } catch (err) {
      const e = err as ApiError
      expect(e.name).toBe('ApiError')
      expect(e.status).toBe(400)
      expect(e.errorCode).toBe('VALIDATION_ERROR')
      expect(e.message).toBeDefined()
    }
  })

  it('exec() unwraps data generically', async () => {
    const adapter = async () => {
      const cfg = {
        headers: {},
        method: 'get',
        url: '/unwrap',
      } as unknown as InternalAxiosRequestConfig

      return {
        data: { value: 42 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: cfg,
      }
    }

    const payload = await exec<{ value: number }>(
      http.get('/unwrap', { adapter })
    )
    expect(payload.value).toBe(42)
  })

  it('does not set Authorization when no token', async () => {
    // Ensure token cleared
    useAuthStore.getState().auth.resetAccessToken()

    const adapter = async (config: InternalAxiosRequestConfig) => {
      return {
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }
    }

    const res = await http.get('/no-auth', { adapter })
    expect(res.config.headers.Authorization).toBeUndefined()
  })

  it('captures exception via Sentry on error mapping', async () => {
    const adapter = async () => {
      return Promise.reject({
        message: 'Unauthorized',
        response: { status: 401, data: { errorCode: 'UNAUTHORIZED' } },
      })
    }

    try {
      await http.get('/error-capture', { adapter })
    } catch (_) {
      // ignore
    }

    expect(vi.mocked(captureException)).toHaveBeenCalled()
    const calls = vi.mocked(captureException).mock.calls
    const call = calls[calls.length - 1]
    expect(call?.[1]?.tags?.scope).toBe('http')
  })
})

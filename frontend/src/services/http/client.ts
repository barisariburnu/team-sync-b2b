import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { getCookie } from '@shared/lib/cookies'
import { captureException } from '@shared/lib/sentry'
import { useAuthStore } from '@/stores/auth-store'
import type { ApiError } from './types'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const http = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
})

// Attach Authorization token if present
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().auth.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Attach CSRF token from cookie if available
  const csrf = getCookie('csrf_token') || getCookie('XSRF-TOKEN')
  if (csrf) {
    config.headers['X-CSRF-Token'] = csrf
  }
  // Additional safety headers
  config.headers['Cache-Control'] = 'no-store'
  config.headers['Pragma'] = 'no-cache'
  return config
})

// Map errors to a typed ApiError and propagate
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status ?? 0
    const data = error.response?.data as Record<string, unknown> | undefined

    const apiError: ApiError = {
      name: 'ApiError',
      message: error.message,
      status,
      errorCode:
        typeof data?.errorCode === 'string'
          ? (data.errorCode as ApiError['errorCode'])
          : 'UNKNOWN_ERROR',
      cause: error,
    }

    captureException(apiError, { tags: { scope: 'http' } })

    return Promise.reject(apiError)
  }
)

// Helper to ensure typed response data extraction
export async function exec<T>(promise: Promise<{ data: T }>): Promise<T> {
  const res = await promise
  return res.data
}

export type { AxiosRequestConfig }

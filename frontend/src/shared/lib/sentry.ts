import * as Sentry from '@sentry/tanstackstart-react'

interface CaptureContext {
  tags?: Record<string, string>
  extra?: Record<string, unknown>
}

export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  const environment = import.meta.env.VITE_SENTRY_ENV ?? import.meta.env.MODE

  // Skip initialization when DSN is missing or invalid
  if (!dsn || dsn === '' || dsn === 'undefined') {
    return
  }

  // PII policy: env override first, otherwise sensible default per environment
  const piiEnv = import.meta.env.VITE_SENTRY_SEND_DEFAULT_PII
  const sendDefaultPii =
    typeof piiEnv === 'string'
      ? /^(true|1)$/i.test(piiEnv)
      : environment !== 'production'

  // Performance sampling: allow env overrides
  const tracesSampleRateEnv = import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE
  const replaysSessionSampleRateEnv = import.meta.env
    .VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE
  const replaysOnErrorSampleRateEnv = import.meta.env
    .VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE

  const toRate = (val: unknown, fallback: number) => {
    const num = typeof val === 'string' ? Number(val) : NaN
    return Number.isFinite(num) && num >= 0 && num <= 1 ? num : fallback
  }

  const tracesSampleRate = toRate(
    tracesSampleRateEnv,
    environment === 'production' ? 0.2 : 1.0
  )
  const replaysSessionSampleRate = toRate(
    replaysSessionSampleRateEnv,
    environment === 'production' ? 0.1 : 0.5
  )
  const replaysOnErrorSampleRate = toRate(replaysOnErrorSampleRateEnv, 1.0)

  Sentry.init({
    dsn,
    environment,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate,
    replaysSessionSampleRate,
    replaysOnErrorSampleRate,
    sendDefaultPii,
  })
}

export function captureException(
  error: unknown,
  context?: CaptureContext
): void {
  Sentry.captureException(error, {
    tags: context?.tags,
    extra: context?.extra,
  })
}

// Pass-through utility to create custom spans around critical user flows
export function startSpan<T>(
  options: {
    name: string
    op?: string
    attributes?: Record<string, string | number | boolean>
  },
  callback: () => Promise<T> | T
): Promise<T> | T {
  return Sentry.startSpan(options, callback)
}

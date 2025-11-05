import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().default('/api'),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_SENTRY_ENV: z.string().optional(),
  VITE_SENTRY_SEND_DEFAULT_PII: z
    .union([z.string(), z.boolean()])
    .transform((v) => (typeof v === 'string' ? v === 'true' : !!v))
    .default(false),
  VITE_SENTRY_TRACES_SAMPLE_RATE: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .default(0.0),
  VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .default(0.1),
  VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .default(1.0),
  MODE: z.string().default(import.meta.env.MODE),
})

export const appConfig = envSchema.parse(import.meta.env)

export type AppConfig = typeof appConfig

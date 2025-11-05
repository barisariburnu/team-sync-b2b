import { getEnv } from '../utils/get-env';

const appConfig = () => ({
  // Application
  PORT: getEnv('PORT', '5000'),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  BASE_PATH: getEnv('BASE_PATH', '/api/v1'),

  // Database
  POSTGRES_URL: getEnv('POSTGRES_URL', 'postgres://user:password@localhost:5432/umay'),

  // Auth
  JWT_SECRET: getEnv('JWT_SECRET', 'super_secret_jwt_key'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '24h') as string, // 1 day

  // Frontend
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:5173'),

  // Logging
  LOG_LEVEL: getEnv('LOG_LEVEL', 'info'),
});

export const config = appConfig();

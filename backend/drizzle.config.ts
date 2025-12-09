import { defineConfig } from 'drizzle-kit';
import { config } from './src/config/app.config';

export default defineConfig({
  dialect: 'postgresql',
  out: './src/db/migrations',
  schema: './src/db/schema/index.ts',
  dbCredentials: {
    url: config.POSTGRES_URL || 'postgres://user:password@localhost:5432/team-sync',
  },
});

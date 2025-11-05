import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../config/app.config';

let client: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export const connectPostgres = () => {
  if (!client) {
    client = postgres(config.POSTGRES_URL, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    db = drizzle(client);
  }
  return db!;
};

export const getDb = () => {
  if (!db) {
    return connectPostgres();
  }
  return db;
};

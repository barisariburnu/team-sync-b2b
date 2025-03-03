import { getEnv } from "../utils/get-env";

const appConfig = () => ({
    PORT: getEnv("PORT", "5000"),
    NODE_ENV: getEnv("NODE_ENV", "development"),
    BASE_PATH: getEnv("BASE_PATH", "/api"),
    MONGO_URI: getEnv("MONGO_URI", ""),

    JWT_SECRET: getEnv("JWT_SECRET"),
    JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "24h") as string, // 1 day
   
    SESSION_SECRET: getEnv("SESSION_SECRET"),
    SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN", "1d"),

    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
    GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),

    FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:5173"),
    FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL", "http://localhost:5173/oauth/google/callback"),
});

export const config = appConfig();

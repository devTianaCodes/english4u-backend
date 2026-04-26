import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number.parseInt(process.env.PORT ?? "4000", 10),
  clientUrls: (process.env.CLIENT_URL ?? "http://localhost:5173")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
  adminEmails: (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
  db: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number.parseInt(process.env.DB_PORT ?? "3306", 10),
    name: process.env.DB_NAME ?? "english4u",
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? ""
  },
  jwtSecret: process.env.JWT_SECRET ?? "replace-this-secret",
  authCookieName: process.env.AUTH_COOKIE_NAME ?? "english4u_token"
};

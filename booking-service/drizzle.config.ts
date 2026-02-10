import { defineConfig } from "drizzle-kit";

// Helper to build the URL if DATABASE_URL is missing
const getUrl = () => {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  return `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME_BOOKINGS}`;
};

export default defineConfig({
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getUrl(),
  },
});
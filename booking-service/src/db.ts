import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL || process.env.INTERNAL_BOOKING_DB_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const client = new Client({
  connectionString: connectionString
});

await client.connect();
export const db = drizzle(client);
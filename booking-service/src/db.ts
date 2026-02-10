import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

// process.env.DATABASE_URL is injected by Docker or .env
const client = new Client({
  connectionString: process.env.DATABASE_URL
});

await client.connect();
export const db = drizzle(client);
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

// 1. Try to get a pre-built URL
let connectionString = process.env.DATABASE_URL;

// 2. If not found, build it from your individual variables
if (!connectionString) {
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const dbName = process.env.DB_NAME_BOOKINGS;

  if (user && password && dbName) {
    connectionString = `postgres://${user}:${password}@${host}:${port}/${dbName}`;
  }
}

// 3. Final safety check
if (!connectionString) {
  console.error("🔴 Connection failed: No database credentials found in environment.");
  process.exit(1);
}

const client = new Client({
  connectionString: connectionString,
  connectionTimeoutMillis: 5000, 
});

try {
  await client.connect();
  console.log("🟢 DB Connected successfully");
} catch (err) {
  console.error("🔴 DB Connection failed:", err);
  process.exit(1); 
}

export const db = drizzle(client);
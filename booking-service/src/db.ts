import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

// Use a fallback to 127.0.0.1 if the env var isn't fully propagated in some shells
const connectionString = process.env.DATABASE_URL || `postgres://admin:password@127.0.0.1:5432/bookings_db`;

const client = new Client({
  connectionString: connectionString,
  // Add a small connection timeout
  connectionTimeoutMillis: 5000, 
});

// Explicitly handle the connection error to avoid "Unhandled Error"
try {
  await client.connect();
  console.log("🟢 DB Connected successfully");
} catch (err) {
  console.error("🔴 DB Connection failed:", err);
  process.exit(1); 
}

export const db = drizzle(client);
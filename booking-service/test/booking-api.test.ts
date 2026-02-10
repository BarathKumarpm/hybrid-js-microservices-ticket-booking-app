import { describe, expect, it, beforeAll } from "bun:test";
import { Elysia } from 'elysia';
import { db } from "../src/db";
import { tickets } from "../src/schema";
import { sql } from "drizzle-orm";

describe("Booking API Integration", () => {
  // Test 1: Verify Database Connection is actually alive
  beforeAll(async () => {
    try {
      await db.execute(sql`SELECT 1`);
      console.log("✅ Database connection verified for testing.");
    } catch (error) {
      console.error("❌ Database connection failed in test setup:", error);
      throw error; // Crash early with a clear message
    }
  });

  const app = new Elysia()
    .post('/tickets', async ({ body }: any) => {
        // Ensure we map the camelCase from body to snake_case for DB if necessary
        const result = await db.insert(tickets).values({
          eventName: body.eventName,
          userId: body.userId,
          price: body.price
        }).returning();
        return result[0];
    });

  it("POST /tickets - Should successfully book a ticket", async () => {
    const payload = { eventName: "Tech Conf 2026", userId: 1, price: 99 };
    
    const response = await app.handle(
      new Request("http://localhost/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );

    const data = (await response.json()) as { eventName: string; id: number };
    
    expect(response.status).toBe(200);
    // Matching the schema field names
    expect(data.eventName).toBe("Tech Conf 2026");
    expect(data).toHaveProperty("id");
  });
});
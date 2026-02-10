import { describe, expect, it, beforeAll } from "bun:test";
import { Elysia } from 'elysia';
import { db } from "../src/db";
import { tickets } from "../src/schema";

describe("Booking API Integration", () => {
  // Define the Elysia app inside the describe block
  const app = new Elysia()
    .post('/tickets', async ({ body }: any) => {
      try {
        const result = await db.insert(tickets).values({
          eventName: body.eventName,
          userId: body.userId,
          price: body.price
        }).returning();
        return result[0];
      } catch (e) {
        console.error("Database Insert Error:", e);
        throw e;
      }
    });

  it("POST /tickets - Should successfully book a ticket", async () => {
    const payload = { eventName: "Tech Conf 2026", userId: 1, price: 99 };
    
    // app.handle is the standard way to test Elysia without starting a network server
    const response = await app.handle(
      new Request("http://localhost/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );

    expect(response.status).toBe(200);
    const data = (await response.json()) as { eventName: string; id: number };
    
    // Matching your schema's camelCase 'eventName'
    expect(data.eventName).toBe("Tech Conf 2026");
    expect(data).toHaveProperty("id");
  });
});
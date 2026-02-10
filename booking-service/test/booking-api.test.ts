import { describe, expect, it } from "bun:test";
import { Elysia } from 'elysia';
import { db } from "../src/db";
import { tickets } from "../src/schema";

// Define the shape of our response to satisfy TypeScript
interface TicketResponse {
  id: number;
  event_name: string;
  user_id: number;
  price: number;
}

describe("Booking API Integration", () => {
  const app = new Elysia()
    .post('/tickets', async ({ body }: any) => {
        const result = await db.insert(tickets).values(body).returning();
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

    // Cast the json to our interface
    const data = (await response.json()) as TicketResponse;
    
    expect(response.status).toBe(200);
    expect(data.event_name).toBe("Tech Conf 2026");
    expect(data).toHaveProperty("id");
  });
});
import { Elysia } from 'elysia';
import { db } from './db';
import { tickets } from './schema';
import { sql } from 'drizzle-orm';

const app = new Elysia()
  .get('/', () => 'Booking Service Running 🚀')

  // Get all tickets
  .get('/tickets', async () => {
    return await db.select().from(tickets);
  })

  // Book a ticket (High speed write)
  .post('/tickets', async ({ body }: any) => {
    const result = await db.insert(tickets).values({
        eventName: body.eventName,
        userId: body.userId,
        price: body.price
    }).returning();
    return result[0];
  })
  .listen(3001);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
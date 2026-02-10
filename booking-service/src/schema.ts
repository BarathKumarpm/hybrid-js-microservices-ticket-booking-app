import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  eventName: text('event_name'),
  userId: integer('user_id'), // Reference to User Service ID (Loose coupling)
  price: integer('price'),
});
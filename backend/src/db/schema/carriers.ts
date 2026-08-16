import {
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const carriers = pgTable("carriers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  code: varchar("name", { length: 50 }).notNull().unique(),
  onTimeRate: numeric("on_time_rate", {
    precision: 5,
    scale: 2,
  }).notNull(),
  averageDelayHours: numeric("average_delay_hours", {
    precision: 6,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

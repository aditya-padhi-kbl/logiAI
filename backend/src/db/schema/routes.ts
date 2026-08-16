import {
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { Location } from "./types";
export const routeStatusEnum = pgEnum("route_status", [
  "ACTIVE",
  "DISRUPTED",
  "SUSPENDED",
]);
export const routes = pgTable("routes", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  origin: jsonb("origin").$type<Location>().notNull(),
  destination: jsonb("destination").$type<Location>().notNull(),
  distanceKm: numeric("distance_km", {
    precision: 10,
    scale: 2,
  }).notNull(),
  estimatedDurationHours: numeric("estimated_duration_hours", {
    precision: 6,
    scale: 2,
  }).notNull(),

  historicalDelayHours: numeric("historical_delay_hours", {
    precision: 6,
    scale: 2,
  }).notNull(),

  status: routeStatusEnum("status").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

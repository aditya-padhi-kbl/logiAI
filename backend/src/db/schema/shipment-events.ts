import { pgEnum, pgTable, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

import { shipments } from "./shipments";
import type { Location } from "./types";

export const shipmentEventTypeEnum = pgEnum("shipment_event_type", [
  "CREATED",
  "PICKED_UP",
  "ARRIVED_AT_WAREHOUSE",
  "DEPARTED_WAREHOUSE",
  "IN_TRANSIT",
  "DELAYED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
]);

export const shipmentEvents = pgTable("shipment_events", {
  id: uuid("id").defaultRandom().primaryKey(),

  shipmentId: uuid("shipment_id")
    .notNull()
    .references(() => shipments.id, {
      onDelete: "cascade",
    }),

  type: shipmentEventTypeEnum("type").notNull(),

  timestamp: timestamp("timestamp", {
    withTimezone: true,
  }).notNull(),

  location: jsonb("location").$type<Location>(),

  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

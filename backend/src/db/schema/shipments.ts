import {
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";

import { parties } from "./parties";
import { carriers } from "./carriers";
import { routes } from "./routes";
import type { Location } from "./types";

export const shipmentStatusEnum = pgEnum("shipment_status", [
  "CREATED",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELAYED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
]);

export const shipments = pgTable("shipments", {
  id: uuid("id").defaultRandom().primaryKey(),

  trackingNumber: varchar("tracking_number", {
    length: 100,
  })
    .notNull()
    .unique(),

  orderNumber: varchar("order_number", {
    length: 100,
  }),

  senderId: uuid("sender_id")
    .notNull()
    .references(() => parties.id),

  receiverId: uuid("receiver_id")
    .notNull()
    .references(() => parties.id),

  carrierId: uuid("carrier_id")
    .notNull()
    .references(() => carriers.id),

  routeId: uuid("route_id")
    .notNull()
    .references(() => routes.id),

  origin: jsonb("origin").$type<Location>().notNull(),

  destination: jsonb("destination").$type<Location>().notNull(),

  currentLocation: jsonb("current_location").$type<Location>(),

  status: shipmentStatusEnum("status").notNull(),

  expectedDeliveryAt: timestamp("expected_delivery_at", {
    withTimezone: true,
  }).notNull(),

  actualDeliveryAt: timestamp("actual_delivery_at", {
    withTimezone: true,
  }),

  riskScore: numeric("risk_score", {
    precision: 5,
    scale: 4,
  })
    .notNull()
    .default("0"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

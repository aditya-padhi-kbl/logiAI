import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { routes } from "./routes";
import { warehouses } from "./warehouses";

export const routeStops = pgTable("route_stops", {
  id: uuid("id").defaultRandom().primaryKey(),
  routeId: uuid("route_id")
    .notNull()
    .references(() => routes.id, {
      onDelete: "cascade",
    }),
  warehouseId: uuid("warehouse_id")
    .notNull()
    .references(() => warehouses.id, {
      onDelete: "cascade",
    }),
  sequnce: integer("sequence").notNull(),
  plannedArrivalAt: timestamp("planned_arrival_at", {
    withTimezone: true,
  }),
  plannedDepartureAt: timestamp("planned_departure_at", {
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

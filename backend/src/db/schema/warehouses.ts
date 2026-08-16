import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const warehouseStatusEnum = pgEnum("warehouse_status", [
  "OPERATIONAL",
  "CONGESTED",
  "CLOSED",
]);

export const warehouses = pgTable("warehouses", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),

  name: varchar("name", { length: 255 }).notNull(),

  city: varchar("city", { length: 100 }).notNull(),

  country: varchar("country", { length: 100 }).notNull(),

  capacity: integer("capacity").notNull(),

  currentLoad: integer("current_load").notNull(),

  status: warehouseStatusEnum("status").notNull(),

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

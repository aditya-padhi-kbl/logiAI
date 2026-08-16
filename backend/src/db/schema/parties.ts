import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const partyTypeEnum = pgEnum("party_type", ["INDIVIDUAL", "BUSINESS"]);
export const parties = pgTable("parties", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: partyTypeEnum("type").notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

import {Database} from "../types";
import {Kysely} from "kysely";

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable("shipment_event").ifNotExists()
    .addColumn("id", "uuid", (c) => c.primaryKey().notNull())
    .addColumn("shipment_id", "uuid", (c) =>
      c.notNull().references("shipment.id").onDelete("cascade"),
    )
    .addColumn("event_type", "varchar(50)", (c) => c.notNull())
    .addColumn("occurred_at", "timestamptz", (c) => c.notNull())
    .addColumn("location", "varchar(255)", (c) => c.notNull())
    .addColumn("description", "text")
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable("shipment_event").ifExists().execute();
}
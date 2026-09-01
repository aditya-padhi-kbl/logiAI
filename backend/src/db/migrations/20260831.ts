import {Kysely, sql} from "kysely";
import type {Database} from "../types";

export  async function up(db: Kysely<Database>): Promise<void>  {
    await db.schema
    .alterTable("shipment")
        .addColumn('created_at', 'timestamptz')
        .addColumn('updated_at', 'timestamptz')
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void>  {
    await db.schema
    .alterTable("shipment")
        .dropColumn('created_at')
        .dropColumn('updated_at')
    .execute();
}
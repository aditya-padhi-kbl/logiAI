import type { Kysely } from 'kysely'
import type { Database } from '../types'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema.createTable('party').addColumn('id', 'uuid', c => c.primaryKey().notNull()).addColumn('name', 'varchar(255)', c => c.notNull().unique()).execute()
  await db.schema.createTable('shipment')
    .addColumn('id', 'uuid', c => c.primaryKey().notNull())
    .addColumn('tracking_number', 'varchar(100)', c => c.notNull().unique())
    .addColumn('status', 'varchar(50)', c => c.notNull().defaultTo('CREATED'))
    .addColumn('sender_id', 'uuid', c => c.notNull().references('party.id').onDelete('cascade'))
    .addColumn('receiver_id', 'uuid', c => c.notNull().references('party.id').onDelete('cascade'))
    .execute()
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('shipment').ifExists().execute()
  await db.schema.dropTable('party').ifExists().execute()
}

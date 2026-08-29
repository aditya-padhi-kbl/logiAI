import { db } from '../db/database'
import type { Shipment } from '../db/types'

export class ShipmentRepository {
  async create(input: { id: string; tracking_number: string; sender_id: string; receiver_id: string }): Promise<Shipment> {
    return db.insertInto('shipment').values(input).returningAll().executeTakeFirstOrThrow()
  }

  async getById(id: string) {
    const row = await db.selectFrom('shipment')
      .innerJoin('party as sender', 'sender.id', 'shipment.sender_id')
      .innerJoin('party as receiver', 'receiver.id', 'shipment.receiver_id')
      .select(['shipment.id','shipment.tracking_number','shipment.status','sender.id as sender_id','sender.name as sender_name','receiver.id as receiver_id','receiver.name as receiver_name'])
      .where('shipment.id', '=', id).executeTakeFirst()
    return row ? { id: row.id, tracking_number: row.tracking_number, status: row.status, sender: { id: row.sender_id, name: row.sender_name }, receiver: { id: row.receiver_id, name: row.receiver_name } } : undefined
  }

  async list(input: { page: number; page_size: number; status?: string }) {
    let query = db.selectFrom('shipment')
    if (input.status) query = query.where('shipment.status', '=', input.status)
    const countRow = await query.select(({ fn }) => fn.count<number>('shipment.id').as('count')).executeTakeFirstOrThrow()
    const rows = await query.innerJoin('party as sender', 'sender.id', 'shipment.sender_id').innerJoin('party as receiver', 'receiver.id', 'shipment.receiver_id')
      .select(['shipment.id','shipment.tracking_number','shipment.status','sender.id as sender_id','sender.name as sender_name','receiver.id as receiver_id','receiver.name as receiver_name'])
      .orderBy('shipment.id').offset((input.page - 1) * input.page_size).limit(input.page_size).execute()
    return { total: Number(countRow.count), items: rows.map(row => ({ id: row.id, tracking_number: row.tracking_number, status: row.status, sender: { id: row.sender_id, name: row.sender_name }, receiver: { id: row.receiver_id, name: row.receiver_name } })) }
  }
}

import { db } from "../db/database";
import type { NewShipment, Shipment } from "../db/types";
import {
  shipmentListResponseSchema,
  shipmentResponseSchema,
} from "../schemas/shipment";
import { type Static } from "elysia";

type _ShipmentListResponse = Static<typeof shipmentListResponseSchema>;
type ShipmentListResponse = Omit<_ShipmentListResponse, "page" | "page_size">;
type _ShipmentResponseSchema = Static<typeof shipmentResponseSchema>;

export class ShipmentRepository {
  async create(input: NewShipment): Promise<Shipment> {
    return db
      .insertInto("shipment")
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async getById(id: string): Promise<_ShipmentResponseSchema | undefined> {
    const row = await db
      .selectFrom("shipment")
      .innerJoin("party as sender", "sender.id", "shipment.sender_id")
      .innerJoin("party as receiver", "receiver.id", "shipment.receiver_id")
      .select([
        "shipment.id",
        "shipment.tracking_number",
        "shipment.status",
        "sender.id as sender_id",
        "sender.name as sender_name",
        "receiver.id as receiver_id",
        "receiver.name as receiver_name",
        "shipment.created_at as created_at",
      ])
      .where("shipment.id", "=", id)
      .executeTakeFirst();
    return row
      ? {
          id: row.id,
          tracking_number: row.tracking_number,
          status: row.status,
          sender: { id: row.sender_id, name: row.sender_name },
          receiver: { id: row.receiver_id, name: row.receiver_name },
          created_at: row?.created_at ? row.created_at.toISOString() : null,
        }
      : undefined;
  }

  async list(input: {
    page: number;
    page_size: number;
    status?: string;
  }): Promise<ShipmentListResponse> {
    let query = db.selectFrom("shipment");
    if (input.status) query = query.where("shipment.status", "=", input.status);
    const countRow = await query
      .select(({ fn }) => fn.count<number>("shipment.id").as("count"))
      .executeTakeFirstOrThrow();
    const offset = (input.page - 1) * input.page_size;
    const rows = await query
      .innerJoin("party as sender", "sender.id", "shipment.sender_id")
      .innerJoin("party as receiver", "receiver.id", "shipment.receiver_id")
      .select([
        "shipment.id",
        "shipment.tracking_number",
        "shipment.status",
        "sender.id as sender_id",
        "sender.name as sender_name",
        "receiver.id as receiver_id",
        "receiver.name as receiver_name",
        "shipment.created_at as created_at",
      ])
      .orderBy("shipment.id")
      .offset(offset)
      .limit(input.page_size)
      .execute();
    return {
      total: Number(countRow.count),
      items: rows.map((row) => ({
        id: row.id,
        tracking_number: row.tracking_number,
        status: row.status,
        sender: { id: row.sender_id, name: row.sender_name },
        receiver: { id: row.receiver_id, name: row.receiver_name },
        created_at: row?.created_at ? row.created_at.toISOString() : null,
      })),
    };
  }
}

import { NewShipmentEvent, ShipmentEvent } from "../db/types";
import { db } from "../db/database";

export class ShipmentEventRepository {
  async create(
    shipmentId: string,
    input: NewShipmentEvent,
  ): Promise<NewShipmentEvent> {
    return db
      .insertInto("shipment_event")
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findByShipmentId(shipmentId: string): Promise<ShipmentEvent[]> {
    return db
      .selectFrom("shipment_event")
      .selectAll()
      .where("shipment_id", "=", shipmentId)
      .orderBy("occurred_at", "asc")
      .execute();
  }
}

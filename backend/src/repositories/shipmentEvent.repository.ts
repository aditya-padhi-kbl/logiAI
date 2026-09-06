import { NewShipmentEvent, ShipmentEvent } from "../db/types";
import { db, DbExecutor } from "../db/database";

export class ShipmentEventRepository {
  constructor(private readonly db: DbExecutor) {}
  async create(
    shipmentId: string,
    input: NewShipmentEvent,
  ): Promise<NewShipmentEvent> {
    return this.db
      .insertInto("shipment_event")
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findByShipmentId(shipmentId: string): Promise<ShipmentEvent[]> {
    return this.db
      .selectFrom("shipment_event")
      .selectAll()
      .where("shipment_id", "=", shipmentId)
      .orderBy("occurred_at", "asc")
      .execute();
  }
}

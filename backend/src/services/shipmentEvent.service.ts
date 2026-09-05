import { Base } from "./Base.service";
import {
  ShipmentEventCreate,
  ShipmentEventResponse,
} from "../schemas/shipment-event";
import { ShipmentEventRepository } from "../repositories/shipmentEvent.repository";

export class ShipmentEventService extends Base {
  constructor(private readonly repository: ShipmentEventRepository) {
    super();
  }
  async createShipmentEvent(shipmentId: string, data: ShipmentEventCreate) {
    return this.repository.create({
      id: this.getUUID(),
      shipment_id: shipmentId,
      event_type: data.event_type,
      location: data.location,
      description: data.description || null,
      occurred_at: new Date(data.occurred_at),
    });
  }

  async findByShipmentId(shipmentId: string): Promise<ShipmentEventResponse[]> {
    return this.repository.findByShipmentId(shipmentId);
  }
}

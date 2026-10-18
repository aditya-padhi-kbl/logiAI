import { ShipmentService } from "../../services/shipment.service";
import { ShipmentTimelineService } from "../../services/shipmentTimeline.service";
import { ShipmentContext } from "../schema/shipment-context";

export class ShipmentContextService {
  constructor(
    private readonly shipmentService: ShipmentService,
    private readonly shipmentTimelineService: ShipmentTimelineService,
  ) {}

  async getContext(shipmentId: string): Promise<ShipmentContext> {
    const shipment = await this.shipmentService.getShipment(shipmentId);
    if (!shipment) {
      return {
        available: false,
      };
    }
    const timeline = await this.shipmentTimelineService.getTimeline(shipmentId);

    return {
      available: true,
      shipment: {
        id: shipment.id,
        tracking_number: shipment.tracking_number,
        status: shipment.status,
        sender: shipment.sender,
        receiver: shipment.receiver,
        created_at: shipment.created_at,
      },
      timeline: {
        events: timeline.events,
        stagedDurations: timeline.stagedDurations,
        delayedPeriods: timeline.delayedPeriods,
      },
    };
  }
}

import { ShipmentService } from "../../services/shipment.service";
import { ShipmentTimelineService } from "../../services/shipmentTimeline.service";
import { ShipmentContext } from "../schemas/shipment-context";

export class ShipmentContextService {
  constructor(
    private readonly shipmentService: ShipmentService,
    private readonly shipmentTimelineService: ShipmentTimelineService,
  ) {}

  async getContext(shipmentId: string): Promise<ShipmentContext> {
    const [shipment, timeline] = await Promise.all([
      this.shipmentService.getShipment(shipmentId),
      this.shipmentTimelineService.getTimeline(shipmentId),
    ]);

    if (!shipment) {
      throw new Error("Shipment not found");
    }

    return {
      shipment,
      events: timeline.events.map((event) => ({
        id: event.id,
        shipment_id: event.shipment_id,
        event_type: event.event_type,
        occurred_at: event.occurred_at.toISOString(),
        location: event.location,
        description: event.description,
      })),
      timeline: {
        stage_durations: timeline.stagedDurations,
        delayed_periods: timeline.delayedPeriods,
      },
    };
  }
}

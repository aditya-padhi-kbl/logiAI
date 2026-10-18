import {
  ShipmentEventKeys,
  ShipmentEventValues,
  ShipmentEvent,
} from "../../schemas/shipment-event";

export const ValidTransactions: Partial<
  Record<ShipmentEventKeys, ShipmentEventValues[]>
> = {
  CREATED: [ShipmentEvent.PICKED_UP],
  PICKED_UP: [ShipmentEvent.IN_TRANSIT],
  IN_TRANSIT: [ShipmentEvent.DELAYED, ShipmentEvent.DELIVERED],
  DELAYED: [ShipmentEvent.IN_TRANSIT, ShipmentEvent.DELIVERED],
  DELIVERED: [],
} as const;

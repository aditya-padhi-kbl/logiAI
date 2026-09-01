export const ShipmentEvent = {
  CREATED: "CREATED",
  PICKED_UP: "PICKED_UP",
  IN_TRANSIT: "IN_TRANSIT",
  DELAYED: "DELAYED",
  DELIVERED: "DELIVERED",
};

export type ShipmentEventKeys =keyof typeof ShipmentEvent;
export type ShipmentEventValues = typeof ShipmentEvent[ShipmentEventKeys];
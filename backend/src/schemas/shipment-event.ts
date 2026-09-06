import { type Static, t } from "elysia";
export const ShipmentEvent = {
  CREATED: "CREATED",
  PICKED_UP: "PICKED_UP",
  IN_TRANSIT: "IN_TRANSIT",
  DELAYED: "DELAYED",
  DELIVERED: "DELIVERED",
} as const;

export type ShipmentEventKeys = keyof typeof ShipmentEvent;
export type ShipmentEventValues = (typeof ShipmentEvent)[ShipmentEventKeys];

export const ShipmentEventCreateSchema = t.Object({
  event_type: t.Unsafe<ShipmentEventValues>(t.String()),
  occurred_at: t.Date(),
  location: t.String({ trim: true, min: 1, max: 255 }),
  description: t.Nullable(t.String({ trim: true, min: 1, max: 255 })),
});

export const ShipmentEventResponseSchema = t.Object({
  id: t.String({ format: "uuid" }),
  shipment_id: t.String({ format: "uuid" }),
  event_type: t.Unsafe<ShipmentEventValues>(t.String()),
  occurred_at: t.Date(),
  location: t.String(),
  description: t.Nullable(t.String()),
});

export type ShipmentEventCreate = Static<typeof ShipmentEventCreateSchema>;
export type ShipmentEventResponse = Static<typeof ShipmentEventResponseSchema>;

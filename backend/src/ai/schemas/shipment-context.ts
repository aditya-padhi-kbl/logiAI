import { type Static, t } from "elysia";
import { ShipmentEventValues } from "../../schemas/shipment-event";

const shipmentContextEventSchema = t.Object({
  id: t.String({ format: "uuid" }),
  shipment_id: t.String({ format: "uuid" }),
  event_type: t.Unsafe<ShipmentEventValues>(t.String()),
  occurred_at: t.String({ format: "date-time" }),
  location: t.String(),
  description: t.Nullable(t.String()),
});

const shipmentContextShipmentSchema = t.Object({
  id: t.String({ format: "uuid" }),
  tracking_number: t.String(),
  status: t.Unsafe<ShipmentEventValues>(t.String()),
  sender: t.Object({
    id: t.String({ format: "uuid" }),
    name: t.String(),
  }),
  receiver: t.Object({
    id: t.String({ format: "uuid" }),
    name: t.String(),
  }),
  created_at: t.Nullable(t.String({ format: "date-time" })),
});

const stageDurationSchema = t.Object({
  duration_seconds: t.Number({ minimum: 0 }),
  from: t.Unsafe<ShipmentEventValues>(t.String()),
  to: t.Unsafe<ShipmentEventValues>(t.String()),
});

const delayedPeriodSchema = t.Object({
  started_at: t.String({ format: "date-time" }),
  ended_at: t.Nullable(t.String({ format: "date-time" })),
  duration: t.Nullable(t.Number({ minimum: 0 })),
});

export const shipmentContextSchema = t.Object({
  shipment: shipmentContextShipmentSchema,
  events: t.Array(shipmentContextEventSchema),
  timeline: t.Object({
    stage_durations: t.Array(stageDurationSchema),
    delayed_periods: t.Array(delayedPeriodSchema),
  }),
});

export type ShipmentContext = Static<typeof shipmentContextSchema>;

import { t } from "elysia";
import { ShipmentEvent, ShipmentEventValues } from "./shipment-event";
export const shipmentCreateSchema = t.Object({
  tracking_number: t.String({ minLength: 1, maxLength: 255 }),
  sender_id: t.String({ format: "uuid" }),
  receiver_id: t.String({ format: "uuid" }),
});
export const shipmentResponseSchema = t.Object({
  id: t.String({ format: "uuid" }),
  tracking_number: t.String(),
  status: t.Unsafe<ShipmentEventValues>(t.String()),
  sender: t.Object({ id: t.String({ format: "uuid" }), name: t.String() }),
  receiver: t.Object({ id: t.String({ format: "uuid" }), name: t.String() }),
  created_at: t.Nullable(t.String({ format: "date-time" })),
});
export const shipmentListQuerySchema = t.Object({
  page: t.Numeric({ default: 1, minimum: 1 }),
  page_size: t.Numeric({ default: 20, minimum: 1, maximum: 20 }),
  status: t.Unsafe<ShipmentEventValues>(t.String()),
});
export const shipmentListResponseSchema = t.Object({
  items: t.Array(shipmentResponseSchema),
  page: t.Number(),
  page_size: t.Number(),
  total: t.Number(),
});

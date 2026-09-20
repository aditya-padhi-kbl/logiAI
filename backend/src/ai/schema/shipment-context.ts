import { getSchemaValidator, type Static, t } from "elysia";
import { shipmentResponseSchema } from "../../schemas/shipment";
import { ShipmentTimelineSchema } from "../../services/shipmentTimeline.service";

const unavailableShipmentContextSchema = t.Object({
  available: t.Literal(false),
});

const availableShipmentContextSchema = t.Object({
  available: t.Literal(true),
  shipment: shipmentResponseSchema,
  timeline: ShipmentTimelineSchema,
});

export const shipmentContextSchema = t.Union([
  availableShipmentContextSchema,
  unavailableShipmentContextSchema,
]);

export const ShipmentContextSchemaValidator = getSchemaValidator(
  shipmentContextSchema,
);

export type ShipmentContext = Static<typeof shipmentContextSchema>;

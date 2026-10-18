import { Static, t } from "elysia";
import { shipmentContextSchema } from "./shipment-context";
const ExplainShipmentRequestSchema = t.Object({
  context: shipmentContextSchema,
  prompt: t.String(),
});

type ExplainShipmentContext = Static<typeof ExplainShipmentRequestSchema>;

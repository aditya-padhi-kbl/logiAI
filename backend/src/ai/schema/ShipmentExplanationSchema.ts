import { getSchemaValidator, Static, t } from "elysia";

const ShipmentExplanationSchema = t.Object({
  explanation: t.String(),
});

type ShipmentExplanation = Static<typeof ShipmentExplanationSchema>;
const validator = getSchemaValidator(ShipmentExplanationSchema);

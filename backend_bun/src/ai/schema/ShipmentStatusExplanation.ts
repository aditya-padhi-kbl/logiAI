import { t, Static } from "elysia";
export const ShipmentExplanationSchema = t.Object({
  explanation: t.String(),
});

export type ShipmentExplanation = Static<typeof ShipmentExplanationSchema>;

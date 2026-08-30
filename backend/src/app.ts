import { Elysia } from "elysia";
import { openapi, fromTypes } from "@elysia/openapi";
import { partyRoutes } from "./routes/party.routes";
import { shipmentRoutes } from "./routes/shipment.routes";

export const app = new Elysia()
  .get("/health", () => ({ status: "ok", service: "logiai-api" }))
  .group("/api", (api) => api.use(shipmentRoutes).use(partyRoutes))
  .use(openapi({
      references: fromTypes()
  }));

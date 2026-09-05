import { Elysia } from "elysia";
import { openapi } from "@elysia/openapi";
import { partyRoutes } from "./routes/party.routes";
import { shipmentRoutes } from "./routes/shipment.routes";
import { shipmentEventRoute } from "./routes/shipmentEvent.route";
export const app = new Elysia()
  .get("/health", () => ({ status: "ok", service: "logiai-api" }))
  .group("/api", (api) =>
    api.use(shipmentRoutes).use(partyRoutes).use(shipmentEventRoute),
  )
  .use(openapi(
      // {
      //     mapJsonSchema: {
      //         zod: z.toJSONSchema
      //     }
      // }
  ));

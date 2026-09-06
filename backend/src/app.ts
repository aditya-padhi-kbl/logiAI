import { Elysia } from "elysia";
import { openapi } from "@elysia/openapi";
import { partyRoutes } from "./routes/party.routes";
import { shipmentRoutes } from "./routes/shipment.routes";
import { ShipmentService } from "./services/shipment.service";
import { ShipmentRepository } from "./repositories/shipment.repository";
import { db } from "./db/database";
import { PartyRepository } from "./repositories/party.repository";
import { ShipmentEventRepository } from "./repositories/shipmentEvent.repository";

const shipmentService = new ShipmentService(
  new ShipmentRepository(db),
  new PartyRepository(),
  new ShipmentEventRepository(db),
  db,
);
export const app = new Elysia()
  .get("/health", () => ({ status: "ok", service: "logiai-api" }))
  .group("/api", (api) =>
    api.use(shipmentRoutes(shipmentService)).use(partyRoutes),
  )
  .use(
    openapi(),
    // {
    //     mapJsonSchema: {
    //         zod: z.toJSONSchema
    //     }
    // }
  );

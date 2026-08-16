import Elysia, { status } from "elysia";
import { shipmentRoutes } from "./modules/shipments/shipment.routes";

export const app = new Elysia()
  .get("/health", () => ({
    status: "ok",
    service: "logiai-api",
  }))
  .use(shipmentRoutes);

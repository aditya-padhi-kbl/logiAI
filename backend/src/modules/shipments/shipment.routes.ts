import Elysia from "elysia";
import { listShipments, listShipmentById } from "./shipment.controller";

export const shipmentRoutes = new Elysia({
  prefix: "/api/shipments",
})
  .get("/", listShipments)
  .get("/:id", ({ params: { id } }) => {
    return listShipmentById(id);
  });

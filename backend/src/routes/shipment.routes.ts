import { Elysia, StatusMap, t } from "elysia";
import { PartyRepository } from "../repositories/party.repository";
import { ShipmentRepository } from "../repositories/shipment.repository";
import { ShipmentService } from "../services/shipment.service";
import {
  shipmentCreateSchema,
  shipmentListQuerySchema,
  shipmentListResponseSchema,
  shipmentResponseSchema,
} from "../schemas/shipment";
import { ShipmentEventRepository } from "../repositories/shipmentEvent.repository";
import { db } from "../db/database";
import { ShipmentEventValues } from "../schemas/shipment-event";

export const shipmentRoutes = (service: ShipmentService) =>
  new Elysia({ prefix: "/shipments" })
    .post(
      "",
      async ({ body, set }) => {
        try {
          const createdShipment = await service.createShipment(body);
          const shipment = await service.getShipment(createdShipment.id);

          if (!shipment) {
            set.status = 500;
            return { error: "Shipment creation failed" };
          }

          set.status = 201;
          return shipment;
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "Sender or receiver not found"
          ) {
            set.status = 400;
            return { error: error.message };
          }
          throw error;
        }
      },
      {
        body: shipmentCreateSchema,
        response: {
          201: shipmentResponseSchema,
          400: t.Object({ error: t.String() }),
          500: t.Object({ error: t.String() }),
        },
      },
    )
    .get(
      "/:shipmentId",
      async ({ params, set }) => {
        const shipment = await service.getShipment(params.shipmentId);
        if (!shipment) {
          set.status = 404;
          return { error: "Shipment not found" };
        }
        return shipment;
      },
      {
        params: t.Object({ shipmentId: t.String({ format: "uuid" }) }),
        response: {
          200: shipmentResponseSchema,
          404: t.Object({
            error: t.String(),
          }),
        },
      },
    )
    .get(
      "",
      async ({ query }) => {
        return service.listShipments(query);
      },
      {
        query: shipmentListQuerySchema,
        response: shipmentListResponseSchema,
      },
    )
    .patch(
      "/:shipmentId/status",
      ({ params, set, body }) => {
        try {
          service.updateShipmentStatus(params.shipmentId, body.status);
          set.status = 204;
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "Shipment not found"
          ) {
            set.status = 404;
            return { error: error.message };
          }

          if (
            error instanceof Error &&
            error.message.includes("Invalid transition from")
          ) {
            set.status = 400;
            return { error: error.message };
          }

          throw error;
        }
      },
      {
        params: t.Object({
          shipmentId: t.String({ pattern: "uuid" }),
        }),
        body: t.Object({
          status: t.Unsafe<ShipmentEventValues>(t.String()),
        }),

        response: {
          400: t.Object({ error: t.String() }),
          500: t.Object({ error: t.String() }),
          404: t.Object({ error: t.String() }),
        },
      },
    )
    .get(
      "/:shipmentId/shipmentEvents",
      ({ params }) => {
        return service.getShipmentEvents(params.shipmentId);
      },
      {
        params: t.Object({
          shipmentId: t.String({ format: "uuid" }),
        }),
      },
    );

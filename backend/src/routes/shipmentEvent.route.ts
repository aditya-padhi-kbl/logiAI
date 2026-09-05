import { ShipmentEventService } from "../services/shipmentEvent.service";
import { ShipmentEventRepository } from "../repositories/shipmentEvent.repository";
import Elysia, { t } from "elysia";
import {
  ShipmentEventCreateSchema,
  ShipmentEventResponseSchema,
} from "../schemas/shipment-event";

const service = new ShipmentEventService(new ShipmentEventRepository());

export const shipmentEventRoute = new Elysia({
  prefix: "/shipments/:shipmentId/shipmentEvents",
})
  .post(
    "",
    async ({ params, body, set }) => {
      try {
        const shipmentEvent = await service.createShipmentEvent(
          params.shipmentId,
          body,
        );
        if (!shipmentEvent) {
          set.status = 500;
          return { error: "Shipment not found;" };
        }
        set.status = 201;
        return {
          ...shipmentEvent,
          occurred_at: new Date(shipmentEvent.occurred_at),
          description: shipmentEvent.description ?? undefined,
        };
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
      body: ShipmentEventCreateSchema,
      params: t.Object({
        shipmentId: t.String({ format: "uuid" }),
      }),
      response: {
        201: ShipmentEventResponseSchema,
        400: t.Object({
          error: t.String(),
        }),
        500: t.Object({
          error: t.String(),
        }),
      },
    },
  )
  .get(
    "",
    async ({ params, set }) => {
      const result = await service.findByShipmentId(params.shipmentId);
      if (result.length === 0) {
        set.status = 500;
        return { error: "No shipment event recorded for this shipment Id" };
      }
      return result;
    },
    {
      params: t.Object({
        shipmentId: t.String({ format: "uuid" }),
      }),
      response: {
        200: t.Array(ShipmentEventResponseSchema),
        500: t.Object({
          error: t.String(),
        }),
      },
    },
  );

import { relations } from "drizzle-orm";
import { shipments } from "./shipments";
import { parties } from "./parties";
import { carriers } from "./carriers";
import { routes } from "./routes";

export const shipmentRelations = relations(shipments, ({ one }) => ({
  sender: one(parties, {
    fields: [shipments.senderId],
    references: [parties.id],
    relationName: "shipmentSender",
  }),
  receiver: one(parties, {
    fields: [shipments.receiverId],
    references: [parties.id],
    relationName: "shipmentReceiver",
  }),
  carrier: one(carriers, {
    fields: [shipments.carrierId],
    references: [carriers.id],
  }),
  route: one(routes, {
    fields: [shipments.routeId],
    references: [routes.id],
  }),
}));

export const partiesRelations = relations(parties, ({ many }) => ({
  sentShipments: many(shipments, {
    relationName: "shipmentSender",
  }),

  receivedShipments: many(shipments, {
    relationName: "shipmentReceiver",
  }),
}));

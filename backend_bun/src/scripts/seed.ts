import { db } from "../db/database";
import { parties } from "./utils/party";
import { shipments } from "./utils/shipment";
import { shipmentEvents } from "./utils/shipmentEvent";

async function seed() {
  await db
    .insertInto("party")
    .values(parties)
    .onConflict((oc) => oc.doNothing())
    .execute();

  await db
    .insertInto("shipment")
    .values(shipments)
    .onConflict((oc) => oc.column("id").doNothing())
    .execute();

  await db
    .insertInto("shipment_event")
    .values(shipmentEvents)
    .onConflict((oc) => oc.column("id").doNothing())
    .execute();
}

seed().catch((error) => {
  console.log(error);
  process.exit(1);
});

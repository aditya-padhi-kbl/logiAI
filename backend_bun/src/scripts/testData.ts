import { ShipmentContextService } from "../ai/context/ShipmentContextService";
import { db } from "../db/database";
import { PartyRepository } from "../repositories/party.repository";
import { ShipmentRepository } from "../repositories/shipment.repository";
import { ShipmentEventRepository } from "../repositories/shipmentEvent.repository";
import { ShipmentService } from "../services/shipment.service";
import { ShipmentTimelineService } from "../services/shipmentTimeline.service";

const bla = new ShipmentContextService(
  new ShipmentService(
    new ShipmentRepository(db),
    new PartyRepository(),
    new ShipmentEventRepository(db),
    db,
  ),
  new ShipmentTimelineService(new ShipmentEventRepository(db)),
);

async function ans() {
  const result = await bla.getContext("01a0c002-7a11-76a4-be7f-8b2e4d5e6f70");
  console.log(JSON.stringify(result));
}

ans().then();

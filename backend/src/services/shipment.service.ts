import { PartyRepository } from "../repositories/party.repository";
import { ShipmentRepository } from "../repositories/shipment.repository";
import { Base } from "./Base.service";
import { NewShipment } from "../db/types";
import {
  ShipmentEvent,
  ShipmentEventResponse,
  ShipmentEventValues,
} from "../schemas/shipment-event";
import { ShipmentEventRepository } from "../repositories/shipmentEvent.repository";
import { DbExecutor } from "../db/database";
import { ValidTransactions } from "./rules/shipmentEvent";

type ShipCreateSchema = Omit<NewShipment, "id" | "created_at" | "status">;

export class ShipmentService extends Base {
  constructor(
    private readonly repository: ShipmentRepository,
    private readonly parties: PartyRepository,
    private readonly shipmentEvent: ShipmentEventRepository,
    private readonly db: DbExecutor,
  ) {
    super();
  }

  async createShipment(data: ShipCreateSchema) {
    const [sender, receiver] = await Promise.all([
      this.parties.getById(data.sender_id),
      this.parties.getById(data.receiver_id),
    ]);
    if (!sender || !receiver) throw new Error("Sender or receiver not found");

    const now = new Date();
    return this.db.transaction().execute(async (trx) => {
      const shipmentRepository = new ShipmentRepository(trx);
      const shipmentEventRepository = new ShipmentEventRepository(trx);

      const shipment = await shipmentRepository.create({
        id: this.getUUID(),
        status: ShipmentEvent.CREATED,
        tracking_number: data.tracking_number,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        created_at: now,
      });

      await shipmentEventRepository.create({
        id: this.getUUID(),
        shipment_id: shipment.id,
        event_type: ShipmentEvent.CREATED,
        occurred_at: now,
        location: "UNKNOWN",
        description: "Shipment Created",
      });
      return shipment;
    });
  }
  getShipment(id: string) {
    return this.repository.getById(id);
  }
  async listShipments(input: {
    page: number;
    page_size: number;
    status?: ShipmentEventValues;
  }) {
    const result = await this.repository.list(input);
    return {
      ...result,
      page: input.page,
      page_size: input.page_size,
    };
  }

  async updateShipmentStatus(
    shipmentId: string,
    newStatus: ShipmentEventValues,
  ) {
    return this.db.transaction().execute(async (trx) => {
      const shipmentRepository = new ShipmentRepository(trx);
      const shipmentEventRepository = new ShipmentEventRepository(trx);
      const shipment = await shipmentRepository.getStatusForUpdate(shipmentId);
      if (!shipment) {
        throw new Error("Shipment not found");
      }
      const allowedTransactions = ValidTransactions[shipment.status] ?? [];
      if (!allowedTransactions.includes(newStatus)) {
        throw new Error(
          `Invalid transition from ${shipment.status} to ${newStatus}`,
        );
      }

      const updatedShipment = shipmentRepository.updateStatus(
        shipmentId,
        newStatus,
      );
      await shipmentEventRepository.create({
        id: this.getUUID(),
        shipment_id: shipmentId,
        event_type: newStatus,
        occurred_at: new Date(),
        location: "UNKNOWN",
        description: `Shipment status changed to ${newStatus}`,
      });

      return updatedShipment;
    });
  }

  async getShipmentEvents(
    shipmentId: string,
  ): Promise<ShipmentEventResponse[]> {
    return this.shipmentEvent.findByShipmentId(shipmentId);
  }
}

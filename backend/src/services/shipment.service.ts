import { PartyRepository } from "../repositories/party.repository";
import { ShipmentRepository } from "../repositories/shipment.repository";
import { Base } from "./Base.service";
import { NewShipment } from "../db/types";
import {ShipmentEvent} from "../schemas/shipment-event";

type ShipCreateSchema = Omit<NewShipment, "id" | "created_at" | "status">;

export class ShipmentService extends Base {
  constructor(
    private readonly repository: ShipmentRepository,
    private readonly parties: PartyRepository,
  ) {
    super();
  }

  async createShipment(data: ShipCreateSchema) {
    const [sender, receiver] = await Promise.all([
      this.parties.getById(data.sender_id),
      this.parties.getById(data.receiver_id),
    ]);
    if (!sender || !receiver) throw new Error("Sender or receiver not found");

    return this.repository.create({
      id: this.getUUID(),
      status: ShipmentEvent.CREATED,
      tracking_number: data.tracking_number,
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      created_at: new Date(),
    });
  }
  getShipment(id: string) {
    return this.repository.getById(id);
  }
  async listShipments(input: {
    page: number;
    page_size: number;
    status?: string;
  }) {
    const result = await this.repository.list(input);
    return {
      ...result,
      page: input.page,
      page_size: input.page_size,
    };
  }
}

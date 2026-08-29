import { randomUUID } from 'node:crypto'
import { PartyRepository } from '../repositories/party.repository'
import { ShipmentRepository } from '../repositories/shipment.repository'
import type { ShipmentCreate } from '../schemas/shipment'

export class ShipmentService {
  constructor(private readonly repository: ShipmentRepository, private readonly parties: PartyRepository) {}
  async createShipment(data: ShipmentCreate) {
    const [sender, receiver] = await Promise.all([this.parties.getById(data.sender_id), this.parties.getById(data.receiver_id)])
    if (!sender || !receiver) throw new Error('Sender or receiver not found')
    return this.repository.create({ id: randomUUID(), tracking_number: data.tracking_number, sender_id: data.sender_id, receiver_id: data.receiver_id })
  }
  getShipment(id: string) { return this.repository.getById(id) }
  listShipments(input: { page: number; page_size: number; status?: string }) { return this.repository.list(input) }
}

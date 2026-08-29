import { PartyRepository } from '../repositories/party.repository'
import type { PartyCreate } from '../schemas/party'

export class PartyService {
  constructor(private readonly repository: PartyRepository) {}
  createParty(data: PartyCreate) { return this.repository.create(data) }
  getById(id: string) { return this.repository.getById(id) }
}

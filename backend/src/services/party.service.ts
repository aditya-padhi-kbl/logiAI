import { PartyRepository } from "../repositories/party.repository";
import type { PartyCreate } from "../schemas/party";
import { Base } from "./Base.service";

export class PartyService extends Base {
  constructor(private readonly repository: PartyRepository) {
    super();
  }
  createParty(data: PartyCreate) {
    return this.repository.create(data);
  }
  getById(id: string) {
    return this.repository.getById(id);
  }
}

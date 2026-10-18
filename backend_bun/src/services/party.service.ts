import { PartyRepository } from "../repositories/party.repository";
import { Base } from "./Base.service";
import { partyCreateSchema } from "../schemas/party";
import { type Static } from "elysia";

type PartyCreateSchema = Static<typeof partyCreateSchema>;

export class PartyService extends Base {
  constructor(private readonly repository: PartyRepository) {
    super();
  }
  createParty(data: PartyCreateSchema) {
    return this.repository.create(data);
  }
  getById(id: string) {
    return this.repository.getById(id);
  }
}

import { db } from "../db/database";
import type { NewParty } from "../db/types";
import type {partyResponseSchema} from "../schemas/party";
import {type Static} from "elysia";
type PartyResponseSchema = Static<typeof partyResponseSchema>;

export class PartyRepository {
  create(party: NewParty): Promise<PartyResponseSchema> {
    return db
      .insertInto("party")
      .values(party)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  getById(id: string): Promise<PartyResponseSchema | undefined> {
    return db
      .selectFrom("party")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  }
}

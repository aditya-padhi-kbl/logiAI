import { db } from '../db/database'
import type { NewParty, Party } from '../db/types'

export class PartyRepository {
  create(party: NewParty): Promise<Party> { return db.insertInto('party').values(party).returningAll().executeTakeFirstOrThrow() }
  getById(id: string): Promise<Party | undefined> { return db.selectFrom('party').selectAll().where('id', '=', id).executeTakeFirst() }
}

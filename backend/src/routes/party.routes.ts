import { Elysia } from 'elysia'
import { z } from 'zod'
import { PartyRepository } from '../repositories/party.repository'
import { PartyService } from '../services/party.service'
import { partyCreateSchema, partyResponseSchema } from '../schemas/party'

const service = new PartyService(new PartyRepository())
export const partyRoutes = new Elysia({ prefix: '/parties' })
  .post('', ({ body }) => service.createParty(body), { body: partyCreateSchema, response: partyResponseSchema })
  .get('/:partyId', ({ params }) => service.getById(params.partyId), { params: z.object({ partyId: z.uuid() }) })

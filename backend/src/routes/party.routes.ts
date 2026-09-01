import { Elysia } from "elysia";
import { PartyRepository } from "../repositories/party.repository";
import { PartyService } from "../services/party.service";
import { partyCreateSchema, partyResponseSchema } from "../schemas/party";
import {t} from 'elysia';
const service = new PartyService(new PartyRepository());
export const partyRoutes = new Elysia({ prefix: "/parties" })
  .post("", ({ body }) => service.createParty(body), {
    body: partyCreateSchema,
    response: partyResponseSchema,
  })
  .get("/:partyId", ({ params }) => service.getById(params.partyId), {
    params: t.Object({
      partyId: t.String({ format: "uuid" }),
    }),
    response: partyResponseSchema,
  });

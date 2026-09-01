import { Elysia } from "elysia";
import { PartyRepository } from "../repositories/party.repository";
import { PartyService } from "../services/party.service";
import { partyCreateSchema, partyResponseSchema } from "../schemas/party";
import { t } from "elysia";
const service = new PartyService(new PartyRepository());
export const partyRoutes = new Elysia({ prefix: "/parties" })
  .post("", ({ body }) => service.createParty(body), {
    body: partyCreateSchema,
    response: partyResponseSchema,
  })
  .get(
    "/:partyId",
    async ({ params, set }) => {
      const party = await service.getById(params.partyId);

      if (!party) {
        set.status = 404;
        return { error: "Party not found" };
      }
      return party;
    },
    {
      params: t.Object({
        partyId: t.String({ format: "uuid" }),
      }),
      response: {
        200: partyResponseSchema,
        404: t.Object({
          error: t.Object({
            error: t.String(),
          }),
        }),
      },
    },
  );

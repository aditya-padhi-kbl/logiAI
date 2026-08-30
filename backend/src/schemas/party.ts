import { z } from "zod";

export const partyCreateSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1).max(255),
});
export const partyResponseSchema = z.object({ id: z.uuid(), name: z.string() });
export type PartyCreate = z.infer<typeof partyCreateSchema>;

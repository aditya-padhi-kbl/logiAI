import {t} from 'elysia'
export const partyCreateSchema = t.Object({
  id: t.String({ format: "uuid" }),
  name: t.String({ trim: true, min: 1, max: 255 })
});
export const partyResponseSchema = t.Object({
  id: t.String({ format: "uuid" }),
  name: t.String()
});


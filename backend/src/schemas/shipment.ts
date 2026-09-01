import { z } from "zod";

export const shipmentCreateSchema = z.object({
  tracking_number: z.string().trim().min(1).max(100),
  sender_id: z.uuid(),
  receiver_id: z.uuid(),
  created_at: z.iso.datetime(),
});
export const shipmentResponseSchema = z.object({
  id: z.uuid(),
  tracking_number: z.string(),
  status: z.string(),
  sender: z.object({ id: z.uuid(), name: z.string() }),
  receiver: z.object({ id: z.uuid(), name: z.string() }),
  created_at: z.iso.datetime().nullable(),
});
export const shipmentListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().optional(),
});
export const shipmentListResponseSchema = z.object({
  items: z.array(shipmentResponseSchema),
  page: z.number(),
  page_size: z.number(),
  total: z.number(),
});
export type ShipmentCreate = z.infer<typeof shipmentCreateSchema>;

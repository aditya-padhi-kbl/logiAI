import {z} from 'zod';
import {t} from  'elysia'
import {ShipmentEvent} from "../consts/shipment.const";


const ShipmentEventCreateSchema = t.Object({
    id: t.String({format: 'uuid'}),
    shipment_id: t.String({format: 'uuid'}),
    event_type: t.Enum(ShipmentEvent),
    occurred_at: t.String({format: 'date-time'}),
    location: t.String(),
    description: t.Optional(t.String())
})

export const ShipmentEventResponseSchema = t.Object({
    id: t.String({format: 'uuid'}),
    shipment_id: t.String({format: 'uuid'}),
    event_type: t.Enum(ShipmentEvent),
    occurred_at: t.String({format: 'date-time'}),
    location: t.String(),
    description: t.Optional(t.String())
})

export const ShipmentEvent




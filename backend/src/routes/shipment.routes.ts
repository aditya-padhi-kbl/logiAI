import { Elysia } from 'elysia'
import { z } from 'zod'
import { PartyRepository } from '../repositories/party.repository'
import { ShipmentRepository } from '../repositories/shipment.repository'
import { ShipmentService } from '../services/shipment.service'
import { shipmentCreateSchema, shipmentListQuerySchema, shipmentListResponseSchema, shipmentResponseSchema } from '../schemas/shipment'

const service = new ShipmentService(new ShipmentRepository(), new PartyRepository())
export const shipmentRoutes = new Elysia({ prefix: '/shipments' })
  .post('', async ({ body, set }) => {
    try { const shipment = await service.createShipment(body); set.status = 201; return service.getShipment(shipment.id) }
    catch (error) { if (error instanceof Error && error.message === 'Sender or receiver not found') { set.status = 400; return { error: error.message } }; throw error }
  }, { body: shipmentCreateSchema, response: { 200: shipmentResponseSchema, 201: shipmentResponseSchema, 400: z.object({ error: z.string() }) } })
  .get('/:shipmentId', async ({ params, set }) => { const shipment = await service.getShipment(params.shipmentId); if (!shipment) { set.status = 404; return { error: 'Shipment not found' } }; return shipment }, { params: z.object({ shipmentId: z.uuid() }), response: { 200: shipmentResponseSchema, 404: z.object({ error: z.string() }) } })
  .get('', ({ query }) => service.listShipments(query), { query: shipmentListQuerySchema, response: shipmentListResponseSchema })

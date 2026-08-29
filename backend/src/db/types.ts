import type { Insertable, Selectable } from 'kysely'

export interface PartyTable { id: string; name: string }
export interface ShipmentTable { id: string; tracking_number: string; status: string; sender_id: string; receiver_id: string }
export interface Database { party: PartyTable; shipment: ShipmentTable }
export type Party = Selectable<PartyTable>
export type NewParty = Insertable<PartyTable>
export type Shipment = Selectable<ShipmentTable>

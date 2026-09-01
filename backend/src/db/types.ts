import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import { ShipmentEventValue } from "../consts/shipment.const";

export interface PartyTable {
  id: string;
  name: string;
}

export interface ShipmentTable {
  id: ColumnType<string, never, never>;
  tracking_number: ColumnType<string, string, never>;
  status: ShipmentEventValue;
  sender_id: ColumnType<string, never, never>;
  receiver_id: ColumnType<string, never, never>;
  created_at: ColumnType<Date, string | Date, never>;
  updated_at: ColumnType<Date | null, never, Date | string>;
}

export interface ShipmentEventTable {
  id: string;
  shipment_id: string;
  event_type: ShipmentEventValue;
  occurred_at: ColumnType<Date, string | Date, string | Date>;
  location: ColumnType<string, string, never>;
  description: string | null;
}

export interface Database {
  party: PartyTable;
  shipment: ShipmentTable;
  shipment_event: ShipmentEventTable;
}

export type Party = Selectable<PartyTable>;
export type NewParty = Insertable<PartyTable>;
export type Shipment = Selectable<ShipmentTable>;
export type NewShipment = Omit<Insertable<ShipmentTable>, "updated_at">;
export type ShipmentEvent = Selectable<ShipmentEventTable>;
export type NewShipmentEvent =Insertable<ShipmentEventTable>;
export type UpdateShipmentEvent = Updateable<ShipmentEventTable>;
import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import {ShipmentEventValues} from "../schemas/shipment-event";

export interface PartyTable {
  id: string;
  name: string;
}

export interface ShipmentTable {
  id: ColumnType<string, string, never>;
  tracking_number: ColumnType<string, string, never>;
  status: ColumnType<ShipmentEventValues, ShipmentEventValues, ShipmentEventValues>;
  sender_id: ColumnType<string, string, never>;
  receiver_id: ColumnType<string, string, never>;
  created_at: ColumnType<Date, string | Date, never>;
  updated_at: ColumnType<Date | null, never, Date | string>;
}

export interface ShipmentEventTable {
  id: string;
  shipment_id: string;
  event_type: ColumnType<ShipmentEventValues, ShipmentEventValues, ShipmentEventValues>;
  occurred_at: ColumnType<Date, string | Date, string | Date>;
  location: ColumnType<string, string, string>;
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
export type NewShipment = Insertable<ShipmentTable>;
export type ShipmentEvent = Selectable<ShipmentEventTable>;
export type NewShipmentEvent = Insertable<ShipmentEventTable>;
export type UpdateShipmentEvent = Updateable<ShipmentEventTable>;

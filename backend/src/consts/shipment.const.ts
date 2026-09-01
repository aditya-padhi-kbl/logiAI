export const ShipmentEvent = {
    CREATED: 'CREATED',
    PICKED_UP: 'PICKED_UP',
    IN_TRANSIT: 'IN_TRANSIT',
    DELAYED: 'DELAYED',
    DELIVERED: 'DELIVERED'
}

export type ShipmentEventKey = keyof typeof ShipmentEvent;
export type ShipmentEventValue = typeof ShipmentEvent[ShipmentEventKey]
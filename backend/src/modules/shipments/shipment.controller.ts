import { getShipments, getShipment } from "./shipment.service";

export async function listShipments() {
  const data = await getShipments();
  return {
    data,
    meta: {
      total: Array.isArray(data) ? data.length : 0,
    },
  };
}

export async function listShipmentById(id: string) {
  const data = await getShipment(id);
  return {
    data,
    meta: {
      total: data ? 1 : 0,
    },
  };
}

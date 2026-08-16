import { desc, eq } from "drizzle-orm";
import db from "../../db";
import { shipments } from "../../db/schema";

export async function getShipments() {
  return db.select().from(shipments).orderBy(desc(shipments.createdAt));
}

export async function getShipment(id: string) {
  const result = await db.query.shipments.findFirst({
    where: eq(shipments.id, id),
    with: {
      sender: true,
      receiver: true,
      carrier: true,
      route: true,
    },
  });

  return result;
}

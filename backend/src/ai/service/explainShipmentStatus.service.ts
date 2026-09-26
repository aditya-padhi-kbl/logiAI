import { ShipmentContext } from "../schema/shipment-context";
import { ShipmentExplanation } from "../schema/ShipmentStatusExplanation";

export class ExplainShipmentStatusService {
  async explain(context: ShipmentContext): Promise<ShipmentExplanation> {}
}

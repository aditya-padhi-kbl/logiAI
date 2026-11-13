from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.shipments import ShipmentRepository
from app.schemas.ai import AvailableShipmentContext, UnavailableShipmentContext, ShipmentTimeline
from app.services.investigations import build_shipment_timelines


class ShipmentInvestigationService:
    def __init__(self) -> None:
        self.shipments = ShipmentRepository()

    async def investigate(self, session: AsyncSession, shipment_id: UUID) -> AvailableShipmentContext | UnavailableShipmentContext:
        shipment = await self.shipments.get_by_id(session, shipment_id)
        if not shipment:
            return UnavailableShipmentContext(available=False)
        events = await  self.shipments.events(session, shipment_id)
        timelines: ShipmentTimeline = build_shipment_timelines(events)

        return AvailableShipmentContext(available=True,
                                        timeline=timelines,
                                        shipment=shipment
                                        )
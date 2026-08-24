from uuid import UUID

from app.models.shipment import Shipment
from app.repositories.shipment import ShipmentRepository
from app.schemas.shipment import ShipmentCreate


class ShipmentService:
    def __init__(self, repository: ShipmentRepository) -> None:
        self.repository = repository

    async def create_shipment(self, data: ShipmentCreate) -> Shipment:
        shipment = Shipment(tracking_number=data.tracking_number, sender_id=data.sender_id, receiver_id=data.receiver_id)
        return await self.repository.create(shipment)

    async def get_shipment(self, shipment_id: UUID) -> Shipment | None:
        return await self.repository.get_by_id(shipment_id)
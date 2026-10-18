from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.tables import party
from app.repositories.party import PartyRepository
from app.repositories.shipments import ShipmentRepository
from app.schemas.party import PartyCreate, PartyResponse
from app.schemas.shipment import ShipmentCreate, ShipmentListResponse, ShipmentResponse, ShipmentStatus, ShipmentEventResponse

VALID_TRANSITIONS: dict[ShipmentStatus, set[ShipmentStatus]] = {
    ShipmentStatus.CREATED: {ShipmentStatus.PICKED_UP},
    ShipmentStatus.PICKED_UP: {ShipmentStatus.IN_TRANSIT},
    ShipmentStatus.IN_TRANSIT: {ShipmentStatus.DELAYED, ShipmentStatus.DELIVERED},
    ShipmentStatus.DELAYED: {ShipmentStatus.IN_TRANSIT, ShipmentStatus.DELIVERED},
    ShipmentStatus.DELIVERED: set(),
}

class NotFoundError(Exception):
    pass

class InvalidTransitionError(Exception):
    pass

class ShipmentService:
    def __init__(self) -> None:
        self.shipments = ShipmentRepository()
        self.parties = PartyRepository()

    async def create_party(self, session: AsyncSession, payload: PartyCreate) -> PartyResponse:
        return await self.parties.create(session, payload)

    async def get_party(self, session: AsyncSession, party_id: UUID) -> PartyResponse | None:
        return await self.parties.get_by_id(session, party_id)

    async def create_shipment(self, session: AsyncSession, payload: ShipmentCreate) -> ShipmentResponse:
        for party_id in (payload.sender_id, payload.receiver_id):
            exists = (await session.execute(select(party.c.id).where(party.c.id == party_id))).scalar_one_or_none()
            if exists is None:
                raise ValueError("Sender or receiver not found")
        shipment_id = await self.shipments.create(session, payload)
        result = await self.shipments.get_by_id(session, shipment_id)
        if result is None:
            raise RuntimeError("Shipment creation failed")
        return result

    async def get_shipment(self, session: AsyncSession, shipment_id: UUID) -> ShipmentResponse | None:
        return await self.shipments.get_by_id(session, shipment_id)

    async def list_shipments(self, session: AsyncSession, page: int, page_size: int, status: ShipmentStatus | None) -> ShipmentListResponse:
        items, total = await self.shipments.list(session, page, page_size, status)
        return ShipmentListResponse(items=items, page=page, page_size=page_size, total=total)

    async def update_status(self, session: AsyncSession, shipment_id: UUID, new_status: ShipmentStatus) -> None:
        current = await self.shipments.get_status_for_update(session, shipment_id)
        if current is None:
            raise NotFoundError("Shipment not found")
        current_status = ShipmentStatus(current)
        if new_status not in VALID_TRANSITIONS[current_status]:
            raise InvalidTransitionError(f"Invalid transition from {current_status.value} to {new_status.value}")
        await self.shipments.update_status(session, shipment_id, new_status)

    async def get_events(self, session: AsyncSession, shipment_id: UUID) -> list[ShipmentEventResponse]:
        return await self.shipments.events(session, shipment_id)

from datetime import UTC, datetime
from uuid import UUID, uuid4
from sqlalchemy import func, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.tables import party, shipment, shipment_event
from app.schemas.shipment import ShipmentCreate, ShipmentEventResponse, ShipmentResponse, ShipmentStatus

class ShipmentRepository:
    def _response(self, row: dict[str, object]) -> ShipmentResponse:
        created = row.get("created_at")
        if isinstance(created, datetime) and created.tzinfo is None:
            row["created_at"] = created.replace(tzinfo=UTC)
        return ShipmentResponse.model_validate({
            "id": row["id"], "tracking_number": row["tracking_number"], "status": row["status"],
            "sender": {"id": row["sender_id"], "name": row["sender_name"]},
            "receiver": {"id": row["receiver_id"], "name": row["receiver_name"]},
            "created_at": row.get("created_at"),
        })

    def _joined(self):
        return select(
            shipment.c.id, shipment.c.tracking_number, shipment.c.status,
            shipment.c.created_at, party.alias("sender").c.id.label("sender_id"),
            party.alias("sender").c.name.label("sender_name"),
            party.alias("receiver").c.id.label("receiver_id"),
            party.alias("receiver").c.name.label("receiver_name"),
        ).select_from(
            shipment.join(party.alias("sender"), shipment.c.sender_id == party.alias("sender").c.id)
            .join(party.alias("receiver"), shipment.c.receiver_id == party.alias("receiver").c.id)
        )

    async def create(self, session: AsyncSession, payload: ShipmentCreate) -> UUID:
        now = datetime.now(UTC)
        row = (await session.execute(insert(shipment).values(
            id=uuid4(), tracking_number=payload.tracking_number, status=ShipmentStatus.CREATED,
            sender_id=payload.sender_id, receiver_id=payload.receiver_id, created_at=now, updated_at=now,
        ).returning(shipment.c.id))).scalar_one()
        await session.execute(insert(shipment_event).values(
            id=uuid4(), shipment_id=row, event_type=ShipmentStatus.CREATED,
            occurred_at=now, location="UNKNOWN", description="Shipment Created",
        ))
        return row

    async def get_by_id(self, session: AsyncSession, shipment_id: UUID) -> ShipmentResponse | None:
        row = (await session.execute(self._joined().where(shipment.c.id == shipment_id))).mappings().one_or_none()
        return self._response(dict(row)) if row else None

    async def list(self, session: AsyncSession, page: int, page_size: int, status: ShipmentStatus | None) -> tuple[list[ShipmentResponse], int]:
        base = select(shipment.c.id)
        if status is not None:
            base = base.where(shipment.c.status == status.value)
        total = int((await session.execute(select(func.count()).select_from(base.subquery()))).scalar_one())
        query = self._joined()
        if status is not None:
            query = query.where(shipment.c.status == status.value)
        query = query.order_by(shipment.c.id).offset((page - 1) * page_size).limit(page_size)
        rows = (await session.execute(query)).mappings().all()
        return [self._response(dict(row)) for row in rows], total

    async def get_status_for_update(self, session: AsyncSession, shipment_id: UUID) -> str | None:
        return (await session.execute(select(shipment.c.status).where(shipment.c.id == shipment_id).with_for_update())).scalar_one_or_none()

    async def update_status(self, session: AsyncSession, shipment_id: UUID, status: ShipmentStatus) -> None:
        await session.execute(update(shipment).where(shipment.c.id == shipment_id).values(status=status.value, updated_at=datetime.now(UTC)))
        now = datetime.now(UTC)
        await session.execute(insert(shipment_event).values(
            id=uuid4(), shipment_id=shipment_id, event_type=status.value,
            occurred_at=now, location="UNKNOWN", description=f"Shipment status changed to {status.value}",
        ))

    async def events(self, session: AsyncSession, shipment_id: UUID) -> list[ShipmentEventResponse]:
        rows = (await session.execute(select(shipment_event).where(shipment_event.c.shipment_id == shipment_id).order_by(shipment_event.c.occurred_at.asc()))).mappings().all()
        return [ShipmentEventResponse.model_validate(dict(row)) for row in rows]

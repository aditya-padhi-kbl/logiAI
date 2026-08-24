from typing import Any, cast
from uuid import UUID

from app.models.shipment import Shipment
from sqlalchemy.orm import QueryableAttribute, selectinload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession


def rel(attr: Any) -> QueryableAttribute[Any]:
    return cast(QueryableAttribute[Any], attr)


class ShipmentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, shipment: Shipment) -> Shipment:
        self.session.add(shipment)
        await self.session.commit()
        await self.session.refresh(shipment)
        return shipment

    async def get_by_id(self, shipment_id: UUID) -> Shipment | None:
        statement = (
            select(Shipment)
            .where(Shipment.id == shipment_id)
            .options(
                selectinload(rel(Shipment.sender)), selectinload(rel(Shipment.receiver))
            )
        )
        result = await self.session.exec(statement)
        return result.one_or_none()

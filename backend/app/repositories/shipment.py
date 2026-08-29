from typing import Any, cast
from uuid import UUID

from app.models.shipment import Shipment
from sqlalchemy import func
from sqlalchemy.orm import QueryableAttribute, joinedload
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
                joinedload(rel(Shipment.sender)), joinedload(rel(Shipment.receiver))
            )
        )
        result = await self.session.exec(statement)
        return result.one_or_none()

    async def list(
        self, *, page: int, page_size: int, status: str | None = None
    ) -> tuple[list[Shipment], int]:
        statement = select(Shipment)

        if status is not None:
            statement = statement.where(Shipment.status == status)

        count_statement = select((func.count()).select_from(statement.subquery()))

        count_result = await self.session.exec(count_statement)
        total = count_result.one()

        offset = (page - 1) * page_size

        statement = (
            statement.options(
                joinedload(rel(Shipment.sender)),
                joinedload(rel(Shipment.receiver)),
            )
            .order_by(Shipment.id)
            .offset(offset)
            .limit(page_size)
        )
        result = await self.session.exec(statement)
        shipments = result.all()
        return list(shipments), total

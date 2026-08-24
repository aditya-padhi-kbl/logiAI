from typing import Annotated, Any, cast
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import QueryableAttribute, selectinload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.dependencies import get_session
from app.models.shipment import Shipment
from app.schemas.shipment import ShipmentCreate, ShipmentResponse


def rel(attr: Any) -> QueryableAttribute[Any]:
    return cast(QueryableAttribute[Any], attr)


router = APIRouter(
    prefix="/shipments",
    tags=["shipments"],
)


@router.post("", response_model=ShipmentResponse)
async def create_shipment(
    shipment_data: ShipmentCreate,
    session: Annotated[AsyncSession, Depends(get_session)],
) -> Shipment:
    shipment = Shipment(
        tracking_number=shipment_data.tracking_number,
        sender_id=shipment_data.sender_id,
        receiver_id=shipment_data.receiver_id,
    )
    session.add(shipment)
    await session.commit()
    await session.refresh(shipment)

    statement = select(Shipment).where(Shipment.id == shipment.id)
    result = await session.exec(statement)
    return result.one()


@router.get("/{shipment_id}", response_model=ShipmentResponse)
async def get_shipment(
    shipment_id: UUID, session: Annotated[AsyncSession, Depends(get_session)]
) -> Shipment:
    statement = (
        select(Shipment)
        .options(
            selectinload(rel(Shipment.sender)),
            selectinload(rel(Shipment.receiver)),
        )
        .where(Shipment.id == shipment_id)
    )
    result = await session.exec(statement)
    shipment = result.one_or_none()
    if shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

from typing import Annotated

from app.db.dependencies import get_session
from app.repositories.shipment import ShipmentRepository
from app.service.shipment import ShipmentService
from fastapi import Depends
from sqlmodel.ext.asyncio.session import AsyncSession


def get_shipment_service(
    session: Annotated[AsyncSession, Depends(get_session)],
) -> ShipmentService:
    repository = ShipmentRepository(session)
    return ShipmentService(repository)

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.shipment import get_shipment_service
from app.models.shipment import Shipment
from app.schemas.shipment import ShipmentCreate, ShipmentResponse
from app.service.shipment import ShipmentService

router = APIRouter(
    prefix="/shipments",
    tags=["shipments"],
)


@router.post("", response_model=ShipmentResponse)
async def create_shipment(
    shipment_data: ShipmentCreate,
    service: Annotated[ShipmentService, Depends(get_shipment_service)],
) -> Shipment:
    shipment = await service.create_shipment(shipment_data)
    return shipment


@router.get("/{shipment_id}", response_model=ShipmentResponse)
async def get_shipment(
    shipment_id: UUID,
    service: Annotated[ShipmentService, Depends(get_shipment_service)],
) -> Shipment:
    shipment = await service.get_shipment(shipment_id)
    if shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

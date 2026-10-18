from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_session
from app.schemas.party import PartyCreate, PartyResponse
from app.schemas.shipment import ShipmentCreate, ShipmentEventResponse, ShipmentListResponse, ShipmentResponse, ShipmentStatus, ShipmentStatusUpdate
from app.services.shipments import InvalidTransitionError, NotFoundError, ShipmentService

router = APIRouter(prefix="/api")
service = ShipmentService()
SessionDep = Annotated[AsyncSession, Depends(get_session)]

@router.post("/parties", response_model=PartyResponse, status_code=status.HTTP_201_CREATED)
async def create_party(payload: PartyCreate, session: SessionDep) -> PartyResponse:
    async with session.begin():
        return await service.create_party(session, payload)

@router.get("/parties/{party_id}", response_model=PartyResponse)
async def get_party(party_id: UUID, session: SessionDep) -> PartyResponse:
    result = await service.get_party(session, party_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Party not found")
    return result

@router.post("/shipments", response_model=ShipmentResponse, status_code=status.HTTP_201_CREATED)
async def create_shipment(payload: ShipmentCreate, session: SessionDep) -> ShipmentResponse:
    try:
        async with session.begin():
            return await service.create_shipment(session, payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

@router.get("/shipments", response_model=ShipmentListResponse)
async def list_shipments(
    session: SessionDep,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=20)] = 20,
    status_filter: Annotated[ShipmentStatus | None, Query(alias="status")] = None,
) -> ShipmentListResponse:
    return await service.list_shipments(session, page, page_size, status_filter)

@router.get("/shipments/{shipment_id}", response_model=ShipmentResponse)
async def get_shipment(shipment_id: UUID, session: SessionDep) -> ShipmentResponse:
    result = await service.get_shipment(session, shipment_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return result

@router.patch("/shipments/{shipment_id}/status", status_code=status.HTTP_204_NO_CONTENT)
async def update_shipment_status(shipment_id: UUID, payload: ShipmentStatusUpdate, session: SessionDep) -> Response:
    try:
        async with session.begin():
            await service.update_status(session, shipment_id, payload.status)
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except InvalidTransitionError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/shipments/{shipment_id}/shipmentEvents", response_model=list[ShipmentEventResponse])
async def get_shipment_events(shipment_id: UUID, session: SessionDep) -> list[ShipmentEventResponse]:
    if await service.get_shipment(session, shipment_id) is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return await service.get_events(session, shipment_id)

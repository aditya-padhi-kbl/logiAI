from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies.party import get_party_service
from app.models.party import Party
from app.schemas.party import PartyCreate, PartyResponse
from app.service.party import PartyService

router = APIRouter(prefix="/parties", tags=["Parties"])


@router.post("", response_model=PartyResponse)
async def create_party(
    data: PartyCreate, service: Annotated[PartyService, Depends(get_party_service)]
) -> Party:
    party = await service.create_party(data)

    return party

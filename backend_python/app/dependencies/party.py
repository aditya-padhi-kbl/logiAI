from typing import Annotated

from app.db.dependencies import get_session
from app.repositories.party import PartyRepository
from app.service.party import PartyService
from fastapi import Depends
from sqlmodel.ext.asyncio.session import AsyncSession


def get_party_service(
    session: Annotated[AsyncSession, Depends(get_session)],
) -> PartyService:
    repository = PartyRepository(session)
    return PartyService(repository)

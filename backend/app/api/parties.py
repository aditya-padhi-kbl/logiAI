from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db.dependencies import get_session
from app.models.party import Party

router = APIRouter(prefix="/parties", tags=["Parties"])


@router.post("")
async def create_party(
    party: Party, session: Annotated[AsyncSession, Depends(get_session)]
) -> Party:
    session.add(party)
    await session.commit()
    await session.refresh(party)
    return party


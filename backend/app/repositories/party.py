from uuid import UUID
from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.tables import party
from app.schemas.party import PartyCreate, PartyResponse

class PartyRepository:
    async def create(self, session: AsyncSession, payload: PartyCreate) -> PartyResponse:
        row = (await session.execute(insert(party).values(**payload.model_dump()).returning(*party.c))).mappings().one()
        return PartyResponse.model_validate(dict(row))

    async def get_by_id(self, session: AsyncSession, party_id: UUID) -> PartyResponse | None:
        row = (await session.execute(select(party).where(party.c.id == party_id))).mappings().one_or_none()
        return PartyResponse.model_validate(dict(row)) if row else None

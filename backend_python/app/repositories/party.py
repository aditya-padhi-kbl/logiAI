from uuid import UUID

from app.models.party import Party
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession


class PartyRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, party: Party) -> Party:
        self.session.add(party)
        await self.session.commit()
        await self.session.refresh(party)
        return party

    async def get_by_id(self, party_id: UUID) -> Party | None:
        statement = select(Party).where(Party.id == party_id)
        result = await self.session.exec(statement)
        return result.one_or_none()

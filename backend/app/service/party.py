from uuid import UUID

from app.models.party import Party
from app.repositories.party import PartyRepository
from app.schemas.party import PartyCreate


class PartyService:
    def __init__(self, repository: PartyRepository) -> None:
        self.repository = repository

    async def create_party(self, data: PartyCreate) -> Party:
        party = Party(id=data.id, name=data.name)
        return await self.repository.create(party)

    async def get_by_id(self, party_id: UUID) -> Party | None:
        return await self.repository.get_by_id(party_id)

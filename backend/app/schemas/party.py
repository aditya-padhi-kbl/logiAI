from uuid import UUID

from sqlmodel import SQLModel


class Party(SQLModel):
    id: UUID
    name: str


class PartyCreate(Party):
    pass


class PartyResponse(Party):
    pass

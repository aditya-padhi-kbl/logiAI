from uuid import UUID

from pydantic import Field

from app.schemas.common import StrictModel


class PartyCreate(StrictModel):
    id: UUID
    name: str = Field(min_length=1, max_length=255)


class PartyResponse(StrictModel):
    id: UUID
    name: str

from uuid import UUID

from sqlmodel import SQLModel


class ShipmentCreate(SQLModel):
    tracking_number: str
    sender_id: UUID
    receiver_id: UUID

class PartyResponse(SQLModel):
    id: UUID
    name: str

class ShipmentResponse(SQLModel):
    id: UUID
    tracking_number: str
    status: str
    sender: PartyResponse
    receiver: PartyResponse

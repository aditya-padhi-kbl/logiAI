from enum import Enum
from uuid import UUID
from pydantic import AwareDatetime, Field
from app.schemas.common import StrictModel

class ShipmentStatus(str, Enum):
    CREATED = "CREATED"
    PICKED_UP = "PICKED_UP"
    IN_TRANSIT = "IN_TRANSIT"
    DELAYED = "DELAYED"
    DELIVERED = "DELIVERED"

class ShipmentCreate(StrictModel):
    tracking_number: str = Field(min_length=1, max_length=100)
    sender_id: UUID
    receiver_id: UUID

class ShipmentStatusUpdate(StrictModel):
    status: ShipmentStatus

class PartySummary(StrictModel):
    id: UUID
    name: str

class ShipmentResponse(StrictModel):
    id: UUID
    tracking_number: str
    status: ShipmentStatus
    sender: PartySummary
    receiver: PartySummary
    created_at: AwareDatetime | None

class ShipmentListResponse(StrictModel):
    items: list[ShipmentResponse]
    page: int = Field(ge=1)
    page_size: int = Field(ge=1, le=20)
    total: int = Field(ge=0)

class ShipmentEventResponse(StrictModel):
    id: UUID
    shipment_id: UUID
    event_type: ShipmentStatus
    occurred_at: AwareDatetime
    location: str
    description: str | None

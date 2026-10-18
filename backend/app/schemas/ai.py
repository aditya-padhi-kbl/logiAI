from pydantic import AwareDatetime, Field
from app.schemas.common import StrictModel
from app.schemas.shipment import ShipmentResponse, ShipmentEventResponse, ShipmentStatus

class StageDuration(StrictModel):
    duration_seconds: float = Field(ge=0)
    from_status: ShipmentStatus = Field(alias="from")
    to_status: ShipmentStatus = Field(alias="to")

class DelayedPeriod(StrictModel):
    started_at: AwareDatetime
    ended_at: AwareDatetime | None
    duration_seconds: float | None = Field(default=None, ge=0)

class ShipmentTimeline(StrictModel):
    stagedDurations: list[StageDuration]
    delayedPeriods: list[DelayedPeriod]
    events: list[ShipmentEventResponse]

class AvailableShipmentContext(StrictModel):
    available: bool = True
    shipment: ShipmentResponse
    timeline: ShipmentTimeline

class UnavailableShipmentContext(StrictModel):
    available: bool = False

class ShipmentExplanation(StrictModel):
    explanation: str = Field(min_length=1)

class ExplainShipmentRequest(StrictModel):
    context: AvailableShipmentContext | UnavailableShipmentContext
    prompt: str = Field(min_length=1)

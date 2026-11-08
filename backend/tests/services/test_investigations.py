from uuid import uuid4
from datetime import timedelta, datetime, UTC
from app.schemas.shipment import ShipmentEventResponse, ShipmentStatus
from app.services.investigations import calculate_delay_period, calculate_stage_duration
shipment_id = uuid4()
BASE_TIME = datetime(2026, 10, 22, 8, 0, tzinfo=UTC)
def make_event(status: ShipmentStatus, hours_after_start: int) -> ShipmentEventResponse:
    return ShipmentEventResponse(
        id=uuid4(),
        shipment_id=shipment_id,
        event_type=status,
        occurred_at= BASE_TIME + timedelta(hours=hours_after_start),
        location="Bengaluru",
        description=f"Shipment Status {status.value}"
    )


def test_returns_empty_results_when_no_delay_exists():
    events: list[ShipmentEventResponse] = [
        make_event(ShipmentStatus.CREATED, 0),
        make_event(ShipmentStatus.PICKED_UP, 2),
        make_event(ShipmentStatus.IN_TRANSIT, 6),
        make_event(ShipmentStatus.DELIVERED, 8)
    ]

    result = calculate_delay_period(events)
    assert len(result) == 0

def test_calculates_completed_delay_period():
    events = [
        make_event(ShipmentStatus.CREATED, 0),
        make_event(ShipmentStatus.IN_TRANSIT, 4),
        make_event(ShipmentStatus.DELAYED, 6),
        make_event(ShipmentStatus.IN_TRANSIT, 12),
        make_event(ShipmentStatus.DELIVERED, 14),
    ]

    result = calculate_delay_period(events)

    assert len(result) == 1
    assert result[0].started_at == BASE_TIME + timedelta(hours=6)
    assert result[0].ended_at == BASE_TIME + timedelta(hours=12)
    assert result[0].duration == 6 * 60 * 60 

def test_calculates_ongoing_delay_period():
    events = [
        make_event(ShipmentStatus.CREATED, 0),
        make_event(ShipmentStatus.IN_TRANSIT, 4),
        make_event(ShipmentStatus.DELAYED, 6),
    ]

    result = calculate_delay_period(events)

    assert len(result) == 1
    assert result[0].started_at == BASE_TIME + timedelta(hours=6)
    assert result[0].ended_at is None
    assert result[0].duration is None

def test_calculates_multiple_delay_periods():
    events = [
        make_event(ShipmentStatus.CREATED, 0),
        make_event(ShipmentStatus.DELAYED, 2),
        make_event(ShipmentStatus.IN_TRANSIT, 5),
        make_event(ShipmentStatus.DELAYED, 8),
        make_event(ShipmentStatus.DELIVERED, 12),
    ]

    result = calculate_delay_period(events)

    assert len(result) == 2

    assert result[0].duration == 3 * 60 * 60
    assert result[1].duration == 4 * 60 * 60

def test_consecutive_delayed_events_do_not_reset_start_time():
    events = [
        make_event(ShipmentStatus.CREATED, 0),
        make_event(ShipmentStatus.DELAYED, 2),
        make_event(ShipmentStatus.DELAYED, 4),
        make_event(ShipmentStatus.IN_TRANSIT, 8),
    ]

    result = calculate_delay_period(events)

    assert len(result) == 1
    assert result[0].started_at == BASE_TIME + timedelta(hours=2)
    assert result[0].duration == 6 * 60 * 60


def test_calculate_stage_duration_returns_empty_results():
    events: list[ShipmentEventResponse] = []

    result = calculate_stage_duration(events)
    assert len(result) == 0

def test_calculate_stage_duration_returns_one_event():
    events = [
        make_event(ShipmentStatus.CREATED, 0),

    ]

    result = calculate_stage_duration(events)
    assert len(result) == 0

def test_calculate_stage_duration_returns_two_event():
    events = [
        make_event(ShipmentStatus.CREATED, 0),
        make_event(ShipmentStatus.DELAYED, 6),
    ]

    result = calculate_stage_duration(events)

    assert len(result) == 1
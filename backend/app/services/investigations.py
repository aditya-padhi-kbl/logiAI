from collections.abc import Sequence

from app.schemas.ai import DelayedPeriod, StageDuration, ShipmentTimeline
from app.schemas.shipment import ShipmentEventResponse, ShipmentStatus


def calculate_delay_period(events: Sequence[ShipmentEventResponse]) -> list[DelayedPeriod]:
    delay_periods: list[DelayedPeriod] = []

    delay_started_at = None
    for event in events:
        if event.event_type == ShipmentStatus.DELAYED:
            if delay_started_at is None:
                delay_started_at = event.occurred_at
        elif event.event_type in {ShipmentStatus.DELIVERED, ShipmentStatus.IN_TRANSIT}:
            if delay_started_at is not None:
                duration = (
                        event.occurred_at - delay_started_at
                ).total_seconds()
                delay_periods.append(
                    DelayedPeriod(
                        started_at=delay_started_at,
                        ended_at=event.occurred_at,
                        duration=duration)
                )

                delay_started_at = None

    if delay_started_at is not None:
        delay_periods.append(DelayedPeriod(
            started_at=delay_started_at,
            ended_at=None,
            duration=None
        ))
    return delay_periods

def calculate_stage_duration(events: Sequence[ShipmentEventResponse]) -> list[StageDuration]:
    stage_durations: list[StageDuration] = []
    for previous, current in zip(events, events[1:], strict=False):
        duration_diff = (current.occurred_at - previous.occurred_at).total_seconds()
        stage_durations.append(
            StageDuration.model_validate(
                {
                    "duration_seconds": duration_diff,
                    "from": previous.event_type,
                    "to": current.event_type,
                }
            )
        )

    return stage_durations

def build_shipment_timelines(events: list[ShipmentEventResponse]) -> ShipmentTimeline:
    return ShipmentTimeline(staged_durations=calculate_stage_duration(events), delayed_periods=calculate_delay_period(events), events=events)
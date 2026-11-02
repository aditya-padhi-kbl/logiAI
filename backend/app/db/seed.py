
import asyncio
from datetime import datetime
from uuid import NAMESPACE_URL, uuid5

from sqlalchemy.dialects.postgresql import insert

from app.db.session import engine
from app.db.tables import party, shipment, shipment_event


def stable_id(value: str):
    """Generate a reproducible UUID from a string."""
    return uuid5(NAMESPACE_URL, f"logiai-seed:{value}")


def utc(value: str) -> datetime:
    """Parse an ISO-8601 timestamp with an explicit UTC offset."""
    return datetime.fromisoformat(value)


PARTIES = [
    {
        "id": stable_id("party:meridian"),
        "name": "Meridian Electronics",
    },
    {
        "id": stable_id("party:northstar"),
        "name": "Northstar Retail",
    },
    {
        "id": stable_id("party:bluebird"),
        "name": "Bluebird Logistics",
    },
    {
        "id": stable_id("party:acme"),
        "name": "Acme Medical Supplies",
    },
]

SCENARIOS = [
    {
        "tracking_number": "TRK-1001",
        "sender": "party:meridian",
        "receiver": "party:northstar",
        "status": "DELIVERED",
        "events": [
            ("CREATED", "2026-10-15T08:00:00+00:00", "Mumbai", "Shipment created"),
            ("PICKED_UP", "2026-10-15T10:00:00+00:00", "Mumbai", "Picked up"),
            ("IN_TRANSIT", "2026-10-16T08:00:00+00:00", "Pune", "In transit"),
            ("DELIVERED", "2026-10-17T14:00:00+00:00", "Bengaluru", "Delivered"),
        ],
    },
    {
        "tracking_number": "TRK-1002",
        "sender": "party:meridian",
        "receiver": "party:acme",
        "status": "DELAYED",
        "events": [
            ("CREATED", "2026-10-20T09:00:00+00:00", "Mumbai", "Shipment created"),
            ("PICKED_UP", "2026-10-20T12:00:00+00:00", "Mumbai", "Picked up"),
            ("IN_TRANSIT", "2026-10-21T07:00:00+00:00", "Pune", "Departed distribution hub"),
            ("DELAYED", "2026-10-21T18:00:00+00:00", "Pune", "Missed scheduled departure"),
        ],
    },
    {
        "tracking_number": "TRK-1003",
        "sender": "party:bluebird",
        "receiver": "party:northstar",
        "status": "DELIVERED",
        "events": [
            ("CREATED", "2026-10-10T08:00:00+00:00", "Delhi", "Shipment created"),
            ("PICKED_UP", "2026-10-10T10:00:00+00:00", "Delhi", "Picked up"),
            ("IN_TRANSIT", "2026-10-11T09:00:00+00:00", "Jaipur", "In transit"),
            ("DELAYED", "2026-10-12T09:00:00+00:00", "Jaipur", "Weather disruption"),
            ("IN_TRANSIT", "2026-10-13T15:00:00+00:00", "Jaipur", "Movement resumed"),
            ("DELIVERED", "2026-10-14T12:00:00+00:00", "Bengaluru", "Delivered"),
        ],
    },
    {
        "tracking_number": "TRK-1004",
        "sender": "party:acme",
        "receiver": "party:meridian",
        "status": "CREATED",
        "events": [
            ("CREATED", "2026-10-22T02:00:00+00:00", "Mumbai", "Shipment created"),
        ],
    },
]


async def seed() -> None:
    try:
        async with engine.begin() as connection:
            await connection.execute(
                insert(party).values(PARTIES).on_conflict_do_nothing()
            )

            shipment_rows = []
            event_rows = []

            for scenario in SCENARIOS:
                events = scenario["events"]
                first_event_time = utc(events[0][1])
                last_event_time = utc(events[-1][1])
                tracking_number = scenario["tracking_number"]

                shipment_rows.append(
                    {
                        "id": stable_id(f"shipment:{tracking_number}"),
                        "tracking_number": tracking_number,
                        "status": scenario["status"],
                        "sender_id": stable_id(scenario["sender"]),
                        "receiver_id": stable_id(scenario["receiver"]),
                        "created_at": first_event_time,
                        "updated_at": last_event_time,
                    }
                )

                for index, (event_type, occurred_at, location, description) in enumerate(events):
                    event_rows.append(
                        {
                            "id": stable_id(
                                f"event:{tracking_number}:{index}"
                            ),
                            "shipment_id": stable_id(
                                f"shipment:{tracking_number}"
                            ),
                            "event_type": event_type,
                            "occurred_at": utc(occurred_at),
                            "location": location,
                            "description": description,
                        }
                    )

            await connection.execute(
                insert(shipment).values(shipment_rows).on_conflict_do_nothing()
            )
            await connection.execute(
                insert(shipment_event).values(event_rows).on_conflict_do_nothing()
            )

        print(
            f"Seed complete: {len(PARTIES)} parties, "
            f"{len(SCENARIOS)} shipments, "
            f"{sum(len(s['events']) for s in SCENARIOS)} events."
        )
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())

from uuid import uuid4

import pytest
from pydantic import ValidationError

from app.schemas.shipment import ShipmentCreate, ShipmentStatus, ShipmentStatusUpdate


def test_shipment_create_accepts_valid_payload() -> None:
    payload = ShipmentCreate(
        tracking_number="TRK-100",
        sender_id=uuid4(),
        receiver_id=uuid4(),
    )
    assert payload.tracking_number == "TRK-100"


def test_shipment_create_rejects_unknown_fields() -> None:
    with pytest.raises(ValidationError):
        ShipmentCreate.model_validate(
            {
                "tracking_number": "TRK-100",
                "sender_id": str(uuid4()),
                "receiver_id": str(uuid4()),
                "unexpected": "nope",
            }
        )


def test_status_update_rejects_unknown_status() -> None:
    with pytest.raises(ValidationError):
        ShipmentStatusUpdate.model_validate({"status": "LOST"})


def test_status_update_accepts_known_status() -> None:
    assert (
        ShipmentStatusUpdate(status=ShipmentStatus.IN_TRANSIT).status
        is ShipmentStatus.IN_TRANSIT
    )

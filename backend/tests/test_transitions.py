from app.schemas.shipment import ShipmentStatus
from app.services.shipments import VALID_TRANSITIONS

def test_created_can_only_be_picked_up() -> None:
    assert VALID_TRANSITIONS[ShipmentStatus.CREATED] == {ShipmentStatus.PICKED_UP}

def test_in_transit_can_be_delayed_or_delivered() -> None:
    assert VALID_TRANSITIONS[ShipmentStatus.IN_TRANSIT] == {
        ShipmentStatus.DELAYED,
        ShipmentStatus.DELIVERED,
    }

def test_delivered_is_terminal() -> None:
    assert VALID_TRANSITIONS[ShipmentStatus.DELIVERED] == set()

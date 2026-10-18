from app.main import app

def test_shipment_routes_are_documented() -> None:
    schema = app.openapi()
    paths = schema["paths"]
    assert "/api/shipments" in paths
    assert "/api/shipments/{shipment_id}" in paths
    assert "/api/shipments/{shipment_id}/status" in paths
    assert "/api/shipments/{shipment_id}/shipmentEvents" in paths
    assert "/health" in paths

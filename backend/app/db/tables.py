from sqlalchemy import (
    DateTime, ForeignKey, MetaData, String, Table, Text, Uuid, Column, func,
)

metadata = MetaData()

party = Table(
    "party", metadata,
    Column("id", Uuid(as_uuid=True), primary_key=True),
    Column("name", String(255), nullable=False, unique=True),
)
shipment = Table(
    "shipment", metadata,
    Column("id", Uuid(as_uuid=True), primary_key=True),
    Column("tracking_number", String(100), nullable=False, unique=True),
    Column("status", String(50), nullable=False, server_default="CREATED"),
    Column("sender_id", Uuid(as_uuid=True), ForeignKey("party.id", ondelete="CASCADE"), nullable=False),
    Column("receiver_id", Uuid(as_uuid=True), ForeignKey("party.id", ondelete="CASCADE"), nullable=False),
    Column("created_at", DateTime(timezone=True), nullable=True, server_default=func.now()),
    Column("updated_at", DateTime(timezone=True), nullable=True, onupdate=func.now()),
)
shipment_event = Table(
    "shipment_event", metadata,
    Column("id", Uuid(as_uuid=True), primary_key=True),
    Column("shipment_id", Uuid(as_uuid=True), ForeignKey("shipment.id", ondelete="CASCADE"), nullable=False),
    Column("event_type", String(50), nullable=False),
    Column("occurred_at", DateTime(timezone=True), nullable=False),
    Column("location", String(255), nullable=False),
    Column("description", Text, nullable=True),
)

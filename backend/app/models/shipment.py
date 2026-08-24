import uuid

from sqlmodel import Field, Relationship, SQLModel

from app.models import Party


class Shipment(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid7, primary_key=True, nullable=False)
    tracking_number: str = Field(index=True, max_length=100, unique=True)

    status: str = Field(default="CREATED", max_length=50)

    sender_id: uuid.UUID = Field(foreign_key="party.id", ondelete="CASCADE")

    receiver_id: uuid.UUID = Field(foreign_key="party.id", ondelete="CASCADE")

    sender: Party | None = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Shipment.sender_id]",
            "lazy": "selectin",
        }
    )

    receiver: Party | None = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Shipment.receiver_id]",
            "lazy": "selectin",
        }
    )

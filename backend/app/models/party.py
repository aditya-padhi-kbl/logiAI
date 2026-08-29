import uuid

from sqlmodel import Field, SQLModel


class Party(SQLModel, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid7, primary_key=True, index=True, nullable=False
    )
    name: str = Field(nullable=False, unique=True)

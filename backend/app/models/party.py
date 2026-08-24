import uuid

from sqlmodel import Field, SQLModel

from app.db.init_db import init_db


class Party(SQLModel, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid7, primary_key=True, index=True, nullable=False
    )
    name: str = Field(nullable=False, unique=True)

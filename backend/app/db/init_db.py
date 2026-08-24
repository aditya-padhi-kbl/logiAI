from sqlmodel import SQLModel

from app.db.session import engine


async def init_db() -> None:
    print(">>> Initializing database...")
    async with engine.begin() as connection:
        await connection.run_sync(SQLModel.metadata.create_all)
    print(">>> Database initialized.")

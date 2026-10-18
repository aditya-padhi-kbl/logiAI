from contextlib import asynccontextmanager
from collections.abc import AsyncIterator
from fastapi import FastAPI
from app.api.routes import router
from app.core.config import settings
from app.db.session import engine
from sqlalchemy import text

@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    async with engine.connect() as connection:
        await connection.execute(text("SELECT 1"))
    yield
    await engine.dispose()

app = FastAPI(title="LogiAI API", version="0.1.0", lifespan=lifespan)
app.include_router(router)

@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name}

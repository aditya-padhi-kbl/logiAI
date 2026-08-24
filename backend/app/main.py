from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.parties import router as party_router
from app.api.shipments import router as shipment_router
from app.db.init_db import init_db
from app.schemas.health import HealthResponseModel


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("init_db() called")
    await init_db()
    yield

app = FastAPI(
    title="LogiAI API",
    version="0.1.0",
    lifespan=lifespan
)

app.include_router(shipment_router)
app.include_router(party_router)
@app.get('/health', response_model=HealthResponseModel)
async def health() -> HealthResponseModel:
    return HealthResponseModel(
        status= "ok",
        service= "logiai-api",
    )
from pydantic import BaseModel


class HealthResponseModel(BaseModel):
    status: str
    service: str
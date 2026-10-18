from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/logiai",
        validation_alias="DATABASE_URL",
    )
    port: int = Field(default=8000, validation_alias="PORT", ge=1, le=65535)
    app_name: str = "logiai-api"


settings = Settings()


FROM python:3.15.0-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_PROJECT_ENVIRONMENT=/opt/venv \
    UV_LINK_MODE=copy \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Install locked production dependencies
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev

# Copy application and migration files
COPY app ./app
COPY migrations ./migrations
COPY alembic.ini ./

EXPOSE 8000

# Apply database migrations and start the API
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]

# LogiAI

> AI-powered logistics operations control tower for detecting, investigating, and resolving shipment exceptions.

The backend is the source of truth for operational state and consequential actions. AI functionality must use validated contracts and application services; it must never access PostgreSQL directly.

## Architecture

```text
Next.js
   │ REST
   ▼
FastAPI
   ├── Pydantic request/response validation
   ├── Application services
   ├── Deterministic domain rules
   └── AI integrations (incremental implementation)
          │
          ▼
    SQLAlchemy Core
          │
          ▼
      PostgreSQL
```

## Technology

### Frontend
- Next.js and TypeScript
- TanStack Query
- RxJS where shared realtime streams are useful
- Tailwind CSS / MUI

### Backend
- Python 3.12+
- FastAPI
- Pydantic v2 and Pydantic Settings
- SQLAlchemy Core with async execution
- asyncpg
- Alembic
- Pyright strict mode
- pytest and Ruff

Pydantic is mandatory at external-data boundaries: HTTP request/response models, LLM output, external API responses and configuration. Pyright checks internal Python types statically. SQLAlchemy Core is the SQL query builder; it is used without ORM entity models.

The former Bun/Elysia/Kysely backend is retained under `backend_bun/` for reference only. The active backend is under `backend/app/`.

## Domain invariants

- `shipment.status` is the current state; `shipment_event` is append-only history.
- Shipment creation and its `CREATED` event are committed atomically.
- Status transitions lock the shipment row with `SELECT ... FOR UPDATE`.
- Status changes and their corresponding events are written in one transaction.
- API datetimes must be timezone-aware ISO-8601 values.
- AI-generated data must be validated before business logic or tool execution.

## Shipment API

The API routes retain the existing `/api` prefix:

```text
POST   /api/parties
GET    /api/parties/{party_id}
POST   /api/shipments
GET    /api/shipments
GET    /api/shipments/{shipment_id}
PATCH  /api/shipments/{shipment_id}/status
GET    /api/shipments/{shipment_id}/shipmentEvents
GET    /health
```

FastAPI's OpenAPI documentation is available at `/docs`. SSE/realtime endpoints are not implemented in the current FastAPI application; see the roadmap for planned work.

## Local development

Set the database variables used by `compose.yml` in the repository-root `.env` file:

```dotenv
DB_NAME=logiai
DB_USER=postgres
DB_PASSWORD=change_me
```

Start PostgreSQL and the API:

```bash
docker compose -f compose.yml up --build
```

For local Python development, from `backend/`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
alembic upgrade head
uvicorn app.main:app --reload
```

Run checks from `backend/`:

```bash
pytest
pyright
ruff check .
alembic upgrade head
```

The initial Alembic baseline is intentionally non-destructive: it creates missing tables but does not alter or drop existing tables. Review schema differences before applying future migrations to an existing database.

## Documentation

- [Product specification](./docs/product.md)
- [Architecture](./docs/architecture.md)
- [AI contracts](./docs/ai-contract.md)
- [30-day roadmap](./docs/30-day-roadmap.md)
- [Repository engineering rules](./AGENTS.md)
- [Backend engineering rules](./backend/AGENTS.md)
- [Frontend engineering rules](./frontend/AGENTS.md)

# LogiAI Architecture

## Technology

- Next.js + TypeScript frontend
- Python 3.12+ backend
- FastAPI for HTTP APIs and OpenAPI
- Pydantic v2 for runtime validation at request, response, AI and external-data boundaries
- Pyright strict mode for static type checking
- SQLAlchemy Core for composable SQL queries (no ORM entity models)
- asyncpg for asynchronous PostgreSQL access
- Alembic for schema migrations
- PostgreSQL
- Docker Compose for local infrastructure

The active backend entry point is `backend/app/main.py`. The previous Bun/Elysia/Kysely implementation is retained under `backend_bun/` for reference; it is not the active service.

## High-level architecture

```text
Next.js
   │ REST
   ▼
FastAPI
   ├── Pydantic request/response contracts
   ├── Application services
   ├── Domain transition rules
   └── AI integration contracts
          │
          ▼
    SQLAlchemy Core
          │
          ▼
      PostgreSQL
```

AI components must access operational data through controlled application services, never through direct database access.

## Backend layering

```text
FastAPI routes
      ↓
Pydantic contracts
      ↓
Application services
      ↓
Repositories / SQLAlchemy Core
      ↓
PostgreSQL
```

- Routes are thin HTTP adapters.
- Pydantic models validate untrusted payloads at runtime.
- Services own business logic and transaction boundaries.
- Repositories own persistence queries.
- SQLAlchemy Core builds parameterized SQL; it is not used as an ORM.
- Pyright checks internal annotations statically. It does not replace Pydantic runtime validation.

## Shipment state and events

`shipment.status` represents the current shipment state. `shipment_event` is append-only history.

Shipment creation and status transitions are transactional:

```text
Create shipment
    ↓
BEGIN
    ├── INSERT shipment (CREATED)
    └── INSERT shipment_event (CREATED)
    ↓
COMMIT
```

```text
Change status
    ↓
BEGIN
    ├── SELECT shipment ... FOR UPDATE
    ├── Validate allowed transition
    ├── UPDATE shipment.status
    └── INSERT shipment_event
    ↓
COMMIT
```

A successful state transition and its corresponding event must commit together. The current Python implementation keeps both operations in the same request transaction and uses `SELECT ... FOR UPDATE` to serialize competing transitions.

## Validation

- HTTP input and output use Pydantic v2 models.
- LLM/tool arguments and outputs must be validated before business logic or tool execution.
- External API responses and environment configuration must be validated at ingestion.
- Pyright runs in strict mode to catch internal type mismatches before execution.
- PostgreSQL constraints remain the final integrity guard for persisted data.

## Date and time

PostgreSQL timestamps use `timestamptz`. Datetimes crossing system boundaries use ISO-8601 with timezone information. The backend preserves the instant and does not localize timestamps for presentation. The frontend owns user-local timezone presentation.

Durations in API and tool contracts are numeric seconds.

## AI and realtime status

AI schemas are being migrated to Pydantic. The previous TypeScript AI provider/service are placeholders rather than a production LLM integration. SSE/realtime endpoints are not implemented in the active FastAPI application; add them as a separate, tested migration step if required by the frontend contract.

## Migrations

Alembic is used for future schema changes. The initial baseline creates missing tables without dropping or altering existing tables. Because the original database may already be populated by Kysely migrations, compare the live schema with SQLAlchemy metadata before introducing schema-altering revisions.

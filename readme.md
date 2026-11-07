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

- Python 3.15
- [uv](https://docs.astral.sh/uv/) for Python version, virtual environment, dependency and command management
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

## Prerequisites

- Git
- Docker and Docker Compose
- Python 3.15
- uv

### Install uv

On macOS with Homebrew:

```bash
brew install uv
```

Or use the official installer for your operating system: [uv installation](https://docs.astral.sh/uv/getting-started/installation/).

Verify the installation:

```bash
uv --version
```

## Local development

Run commands in the sections below from the indicated working directory.

### 1. Clone the repository

```bash
git clone https://github.com/aditya-padhi-kbl/logiAI.git
cd logiAI
```

### 2. Configure PostgreSQL

Create the repository-root `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and set values for the PostgreSQL container:

```dotenv
DB_NAME=logiai
DB_USER=postgres
DB_PASSWORD=change_me
```

Start PostgreSQL:

```bash
docker compose -f compose.yml up -d postgres
```

Check its status and logs:

```bash
docker compose -f compose.yml ps
docker compose -f compose.yml logs -f postgres
```

The Compose service exposes PostgreSQL on `localhost:5432`.

### 3. Configure the backend environment

Move into the backend directory:

```bash
cd backend
```

Install the Python 3.15 interpreter managed by uv:

```bash
uv python install 3.15
```

Create/update the lock file if dependencies have changed, then install the project and its development dependencies:

```bash
uv lock
uv sync --extra dev
```

uv creates and manages the project's `.venv` automatically. You do not need to activate it manually. Use `uv run` to execute commands inside the project environment.

The backend loads its local settings from `backend/.env`. Create that file for local development:

```dotenv
DATABASE_URL=postgresql+asyncpg://postgres:change_me@localhost:5432/logiai
PORT=8000
```

Use the same password configured as `DB_PASSWORD` in the repository-root `.env` file.

### 4. Apply database migrations

From `backend/`:

```bash
uv run alembic upgrade head
```

Check the current migration revision and available history:

```bash
uv run alembic current
uv run alembic history
```

When the SQLAlchemy Core schema changes, generate a migration and review the generated file before applying it:

```bash
uv run alembic revision --autogenerate -m "describe_schema_change"
uv run alembic upgrade head
```

To roll back one migration locally:

```bash
uv run alembic downgrade -1
```

Review every migration before applying it to an existing or production database. The initial Alembic baseline is intentionally non-destructive: it creates missing tables but does not alter or drop existing tables.

### 5. Seed the database

The seed script inserts deterministic sample parties, shipments and shipment events. It uses conflict-safe inserts, so it can be run repeatedly without duplicating the seeded records.

From `backend/`:

```bash
uv run python -m app.db.seed
```

### 6. Run the API

From `backend/`:

```bash
uv run uvicorn app.main:app --reload
```

The API is available at:

- Health check: [http://localhost:8000/health](http://localhost:8000/health)
- OpenAPI / Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- OpenAPI schema: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

Stop the development server with `Ctrl+C`.

## Dependency management with uv

Run these commands from `backend/`.

| Task | Command |
|---|---|
| Install/sync dependencies including dev extras | `uv sync --extra dev` |
| Sync exactly to the committed lock file | `uv sync --locked --extra dev` |
| Add a runtime dependency | `uv add package-name` |
| Add a development dependency | `uv add --optional dev package-name` |
| Remove a dependency | `uv remove package-name` |
| Update the lock file | `uv lock` |
| Check that the lock file is up to date | `uv lock --check` |
| Show the managed Python version | `uv python find` |
| Run a command in the project environment | `uv run command` |

Commit both `pyproject.toml` and `uv.lock` when dependency changes are made. Use `uv sync --locked --extra dev` in CI when the lock file must be treated as authoritative.

## Tests and code quality

Run commands from `backend/`.

Run the complete test suite:

```bash
uv run pytest
```

Run tests with verbose output:

```bash
uv run pytest -v
```

Run one test file:

```bash
uv run pytest tests/services/test_investigations.py -v
```

Run one test by name:

```bash
uv run pytest -k consecutive_delayed_events -v
```

Run static type checking and linting:

```bash
uv run pyright
uv run ruff check .
```

Automatically fix supported lint issues and format Python files:

```bash
uv run ruff check . --fix
uv run ruff format .
```

Check formatting without modifying files:

```bash
uv run ruff format --check .
```

## Run the full stack with Docker Compose

The repository-root `.env` file is used by Compose. From the repository root:

```bash
docker compose -f compose.yml up --build
```

This starts PostgreSQL and the backend container. The backend container installs dependencies from `uv.lock`, applies Alembic migrations, and starts Uvicorn.

Useful Compose commands:

```bash
# Start services in the background
docker compose -f compose.yml up -d --build

# View service status
docker compose -f compose.yml ps

# Follow logs
docker compose -f compose.yml logs -f
docker compose -f compose.yml logs -f backend

# Stop and remove containers and network (preserve database volume)
docker compose -f compose.yml down

# Stop containers and delete the PostgreSQL data volume (DESTRUCTIVE)
docker compose -f compose.yml down -v
```

The API is exposed at [http://localhost:8000](http://localhost:8000). The PostgreSQL data is stored in the named `logiai_postgres_data` volume and survives a normal `docker compose down`.

## Documentation

- [Product specification](./docs/product.md)
- [Architecture](./docs/architecture.md)
- [AI contracts](./docs/ai-contract.md)
- [30-day roadmap](./docs/30-day-roadmap.md)
- [Repository engineering rules](./AGENTS.md)
- [Backend engineering rules](./backend/AGENTS.md)

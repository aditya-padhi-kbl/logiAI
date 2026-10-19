# LogiAI Backend

Python 3.15.0 · FastAPI · Pydantic v2 · SQLAlchemy Core · asyncpg · Alembic.

## Architecture

```text
FastAPI routes → Pydantic contracts → Application services
                                     ↓
                              SQLAlchemy Core
                                     ↓
                                 PostgreSQL
```

- Pydantic validates request bodies, response models, configuration, and untrusted AI/external payloads.
- Pyright strict mode checks internal types; it complements rather than replaces runtime validation.
- SQLAlchemy Core provides composable SQL queries without ORM entity models.
- Services own transaction boundaries; repositories own persistence queries.
- Shipment creation writes the shipment and its `CREATED` event atomically.
- Status changes lock the shipment row using `SELECT ... FOR UPDATE`, enforce the transition graph, and append an event in the same transaction.
- Datetimes crossing API boundaries must be timezone-aware.

## Run locally

From the repository root, start PostgreSQL with the required `DB_NAME`, `DB_USER`, and `DB_PASSWORD` variables:

```bash
docker compose -f compose.yml up postgres
```

Then from `backend/`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
alembic upgrade head
uvicorn app.main:app --reload
```

## Checks

```bash
pytest
pyright
ruff check .
```

OpenAPI UI: http://localhost:8000/docs

The baseline Alembic revision is non-destructive and creates missing tables only. Inspect schema differences before adding future migrations against existing databases.

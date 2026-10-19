# Backend Engineering Guidelines

These rules apply to the active Python backend under `backend/app/`.

## Stack

- Python 3.15.0.
- FastAPI for HTTP APIs and OpenAPI.
- Pydantic v2 for runtime validation at every untrusted-data boundary.
- SQLAlchemy Core with async execution for explicit SQL queries; do not introduce ORM entity models without an architectural decision.
- asyncpg for PostgreSQL and Alembic for versioned migrations.
- Pyright in strict mode for static type checking.
- pytest for unit/integration tests and Ruff for linting.

## Structure

```text
backend/app/
├── api/           # HTTP adapters
├── core/          # settings and shared config
├── db/            # SQLAlchemy Core table metadata and sessions
├── repositories/  # persistence queries only
├── schemas/       # Pydantic API/domain contracts
└── services/      # business logic and transaction boundaries
```

- Routes are thin HTTP adapters and delegate to services.
- Services own business/domain logic and transaction boundaries.
- Repositories own persistence queries only; repositories must not contain business logic.
- AI tools must call application services and must never access SQLAlchemy sessions or PostgreSQL directly.
- Compose dependencies explicitly at application startup.

## Runtime and static validation

- Every HTTP request and response uses declared Pydantic models.
- Validate LLM/tool arguments and outputs with Pydantic before using them.
- Validate third-party API responses and environment configuration.
- Do not treat Python annotations or Pyright as runtime validation.
- Avoid `Any`; use typed DTOs and explicit mapping at database boundaries.
- Keep Pyright strict checks passing.

## Transactions and domain invariants

- Shipment creation and its `CREATED` event must commit or roll back together.
- For concurrent shipment status transitions, lock the shipment row with `SELECT ... FOR UPDATE` before validating/updating its state.
- `shipment.status` is the current state; `shipment_event` is append-only history.
- Status changes and their events must be written in the same transaction.
- Alembic migrations must be reviewed for existing deployments and must not drop or recreate production data.

## Date and time

- PostgreSQL timestamps representing instants use `timestamptz`.
- All date/datetime values crossing API, event, AI, tool, or other system boundaries must use ISO-8601 with timezone information.
- Do not emit timezone-less datetime strings or localize values for display.
- Calculate durations from timestamp values and represent durations as numeric seconds.

## Testing

- Prefer fast unit tests for pure domain logic; do not touch the database for unit tests.
- Use integration tests for queries, transactions, constraints, and PostgreSQL behavior.
- Test state-machine, transaction, validation, and concurrency invariants explicitly.

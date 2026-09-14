# Backend Engineering Guidelines

These rules apply to the active TypeScript backend under `backend/`.

## Stack

- Use Bun as the runtime and package manager.
- Use `bun:test` for backend unit and integration tests.
- Use Elysia for HTTP APIs and SSE.
- Use TypeBox through Elysia's `t` schema API for runtime schemas and validation.
- Use Kysely for PostgreSQL access and migrations.

## Structure

```text
backend/src/
├── config/
├── db/
│   └── migrations/
├── routes/
├── schemas/
├── services/
└── repositories/
```

- Routes are thin HTTP adapters and should delegate to services.
- Services own business/domain logic and transaction boundaries.
- Repositories are responsible for persistence and queries only; repositories must not contain business logic.
- AI tools must call application services and must not access Kysely or PostgreSQL directly.
- Compose dependencies explicitly at application startup.

## Transactions

- Services own transaction boundaries.
- Operations that must succeed or fail together must execute through the same Kysely transaction executor.
- For concurrent shipment status transitions, lock the shipment row with `SELECT ... FOR UPDATE` before validating and updating its state.
- `shipment.status` is the current state; `shipment_event` is append-only history. Successful state transitions must update both atomically.

## Date and Time

- PostgreSQL date/time columns use `timestamptz` for timestamps representing an instant in time.
- Do not modify, localize, or convert dates/datetimes on the backend for presentation.
- All date and datetime values crossing API, event, AI, tool, or other system boundaries MUST use ISO-8601 with timezone information.
- Do not emit timezone-less datetime strings.
- Preserve the timestamp as an instant; timezone conversion for display is a frontend responsibility.
- Calculate durations from timestamp values, not from formatted display strings.
- Represent durations in API/tool contracts as numeric seconds rather than human-formatted strings.

## Testing

- Prefer fast unit tests for pure domain logic; do not touch the database for unit tests.
- Use integration tests when verifying Kysely queries, transactions, constraints, or PostgreSQL behavior.
- Test important state-machine, transaction, and concurrency invariants explicitly.

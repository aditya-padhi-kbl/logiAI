# LogiAI Backend

Bun + Elysia + Kysely + PostgreSQL + Zod.

The backend is a modular monolith. HTTP routes delegate to application services, services own business logic and transaction boundaries, and repositories handle persistence through Kysely.

## Structure

```text
backend/
├── src/
│   ├── config/
│   ├── db/
│   │   └── migrations/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   └── services/
├── AGENTS.md
├── package.json
├── tsconfig.json
└── README.md
```

See [`AGENTS.md`](./AGENTS.md) for backend engineering rules.

## Architecture

```text
Elysia routes
      ↓
Application services
      ↓
Repositories
      ↓
Kysely
      ↓
PostgreSQL
```

AI tools must call application services rather than accessing Kysely directly.

## Transactions

Services own transaction boundaries. Shipment creation writes the shipment and its `CREATED` event atomically. Status changes lock the shipment row with `SELECT ... FOR UPDATE`, validate the domain transition, update `shipment.status`, and append the corresponding `shipment_event` in the same transaction.

## Date and time

PostgreSQL timestamps use `timestamptz`. Datetimes crossing system boundaries use ISO-8601 with timezone information. The backend does not localize or convert timestamps for presentation; timezone conversion is a frontend concern.

## Commands

```bash
bun install
bun run migrate
bun run dev
bun test
```

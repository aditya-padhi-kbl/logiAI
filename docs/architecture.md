# LogiAI Architecture

## Technology

- Next.js + TypeScript frontend
- Bun + TypeScript backend runtime
- Elysia for HTTP APIs and SSE
- Zod for runtime validation of untrusted external and AI-generated data
- Kysely for type-safe SQL and database access
- Kysely migrations for database schema changes
- PostgreSQL
- Groq for structured AI reasoning and tool calling
- SSE for realtime updates
- Docker for local infrastructure

The active application is the TypeScript backend under `backend/`. The previous Python implementation is retained under `backend_python/` as a reference only.

## High-level architecture

```text
Next.js
   │
   │ REST + SSE
   ▼
Bun / Elysia
   │
   ├── API routes
   ├── Application services
   ├── Deterministic risk engine
   ├── AI tool registry
   ├── Groq integration
   └── Action executor
          │
          ▼
        Kysely
          │
          ▼
      PostgreSQL
```

## Layering

```text
HTTP / Elysia routes
        ↓
Application Services
        ↓
Domain logic
        ↓
Repositories / Kysely
        ↓
PostgreSQL
```

The AI layer follows the same application boundary:

```text
Groq Agent
    ↓
AI Tool Registry
    ↓
Application Services
    ↓
Repositories / Kysely
    ↓
PostgreSQL
```

The AI never receives direct database access.

## Backend structure

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

Keep the backend as a modular monolith for the MVP. Do not introduce microservices without a concrete requirement.

## Dependency composition

Infrastructure dependencies are created at application startup and composed explicitly into repositories and services. Routes receive services rather than constructing their own dependency graphs.

```text
Application startup
       ↓
Kysely database instance
       ↓
Repositories
       ↓
Application services
       ↓
Elysia routes
```

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
    ├── Validate domain transition
    ├── UPDATE shipment.status
    └── INSERT shipment_event
    ↓
COMMIT
```

A successful state transition and its corresponding event must commit together.

## Validation

Zod is the runtime validation boundary for untrusted external and model-generated data. TypeScript provides compile-time safety.

## Date and time

PostgreSQL timestamps use `timestamptz`. All date and datetime values crossing system boundaries use ISO-8601 with timezone information. The backend preserves the instant and does not localize timestamps for presentation. The frontend owns user-local timezone presentation.

## Risk engine

Risk scoring is deterministic and remains in the backend. AI explains evidence and produces recommendations; it does not become the source of truth for operational calculations.

## AI tools

AI tools access controlled application services rather than Kysely directly. Write tools require explicit human approval.

## Realtime

Shipment events are published through SSE:

```text
Event Simulator → Bun / Elysia → SSE → Next.js
```

## Security principles

- Never expose the Groq API key to Next.js.
- Validate untrusted API and AI inputs at the boundary.
- Authorize consequential actions before execution.
- Record AI recommendations and action approvals in an audit trail.
- Keep database access inside the backend.
- Do not let LLM-generated identifiers or filters bypass application-level authorization.

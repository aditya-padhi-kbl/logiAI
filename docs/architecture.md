# LogiAI Detailed Architecture

## System overview

```text
                     ┌──────────────┐
                     │   Next.js    │
                     └──────┬───────┘
                            │
                     REST / SSE
                            │
                     ┌──────▼───────┐
                     │    Elysia    │
                     │     Bun      │
                     └──────┬───────┘
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
          ▼                 ▼                  ▼
     Application         AI Agent          Event Engine
      Services              │                  │
          │               Groq                 │
          ▼                 │                  │
     Repositories            │                  │
          │                 │                  │
          ▼                 ▼                  │
        Kysely         AI Tool Registry        │
          │                 │                  │
          └─────────────────┼──────────────────┘
                            │
                            ▼
                       PostgreSQL
```

## Backend stack

```text
Bun
  ↓
Elysia
  ↓
Zod validation
  ↓
Application services
  ↓
Repositories
  ↓
Kysely
  ↓
PostgreSQL
```

The backend is a modular monolith. HTTP, business logic, AI orchestration, and persistence have explicit boundaries while remaining in one deployable application.

## AI boundary

```text
User
  ↓
Elysia AI endpoint
  ↓
Groq Agent
  ↓
AI Tool Registry
  ↓
Application Services
  ↓
Repositories
  ↓
Kysely
  ↓
PostgreSQL
```

The AI never accesses PostgreSQL directly. Read tools expose controlled operational queries, while write tools are subject to human approval.

## Validation boundary

```text
HTTP request / Groq output
          ↓
      Zod schema
          ↓
  Validated TypeScript data
          ↓
   Application service
```

TypeScript provides compile-time guarantees and Zod provides runtime validation for external and model-generated data.

## Realtime flow

```text
Event Simulator
      ↓
Application / Event Engine
      ↓
Elysia SSE
      ↓
Next.js Control Tower
```

## Persistence

Kysely is the database access layer. Repositories own SQL queries and are the only application layer that talks to PostgreSQL.

Database schema changes are managed with Kysely migrations.

Core relational entities include:

```text
Party
Shipment
Carrier
Route
RouteStop
Warehouse
ShipmentEvent
```

Flexible event metadata and AI payloads can use PostgreSQL JSONB where appropriate.

## Dependency composition

Dependencies are composed explicitly at application startup:

```text
Kysely database
      ↓
Repositories
      ↓
Services
      ↓
Routes
```

This keeps infrastructure concerns out of domain/application services and avoids coupling the application to a framework-specific dependency-injection container.

## Python reference implementation

The previous FastAPI/Python backend is retained under `backend_python/`. It is not part of the active runtime path. The active implementation is under `backend/` and uses Bun, Elysia, TypeScript, Zod and Kysely.

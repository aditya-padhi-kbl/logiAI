# LogiAI Architecture

## Technology

- Next.js + TypeScript frontend
- Bun + TypeScript backend runtime
- Elysia for HTTP APIs and SSE
- Zod for request, response, and AI contract validation
- Kysely for type-safe SQL and persistence
- Kysely migrations for database schema changes
- PostgreSQL
- Groq for structured AI reasoning and tool calling
- SSE for realtime updates
- Docker for local infrastructure

The previous Python implementation is retained under `backend_python/` as a reference implementation. `backend/` is the active backend.

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

The AI layer follows the same service boundary:

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

## Domain model

```text
Party ──┐
        ├── Shipment ── Carrier
Party ──┘       │
                ├── Route ── RouteStop ── Warehouse
                └── ShipmentEvent
```

A shipment has `senderId` and `receiverId`, both referencing `Party`. Sender/receiver are relationship roles, not permanent party types.

## Backend modules

```text
backend/
├── src/
│   ├── config/
│   ├── db/
│   │   └── migrations/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   └── repositories/
├── package.json
├── tsconfig.json
└── README.md
```

Keep the backend as a modular monolith for the 30-day MVP. Do not introduce microservices just for the sake of demonstrating them.

The Python reference implementation lives under:

```text
backend_python/
```

It is intentionally kept separate from the active TypeScript backend.

## API design

Initial endpoints:

```text
GET /health
GET /api/shipments
GET /api/shipments/{id}
GET /api/shipments/{id}/events
GET /api/carriers
GET /api/warehouses
GET /api/routes/{id}
GET /api/shipments/at-risk
```

AI endpoints will be added after the deterministic APIs are stable.

## Dependency composition

Elysia does not require a framework-managed dependency-injection container for this application. Infrastructure dependencies are created at application startup and composed explicitly into repositories and services.

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

Business services remain independent of HTTP concerns where practical.

## Validation

Zod is the runtime validation boundary for external and model-generated data.

```text
HTTP / AI input
      ↓
Zod schema
      ↓
Validated TypeScript value
      ↓
Application service
```

TypeScript provides compile-time safety; Zod provides runtime validation for untrusted data.

## Risk engine

Risk scoring is deterministic:

```text
Delay             35%
Carrier           25%
Warehouse         20%
Route             20%
```

The backend calculates the score. Groq explains evidence and produces recommendations.

## AI tools

Read tools:

```text
searchShipments
getShipment
getShipmentEvents
getAtRiskShipments
getCarrierPerformance
getWarehouseStatus
getRouteInformation
```

Write tools:

```text
rerouteShipment
notifyCustomer
escalateCarrier
```

Write tools require explicit human approval.

## Structured AI contract

The backend validates model output with Zod schemas before returning it to Next.js. Use discriminated response types such as:

```text
text
risk_analysis
recommendation
shipment_table
action_confirmation
```

The frontend should render structured data rather than parse free-form AI prose.

## Realtime

Shipment events are simulated in development and published through SSE:

```text
Event simulator → Bun / Elysia → SSE → Next.js
```

## Data strategy

Use relational tables for core entities and JSONB for flexible event metadata and AI payloads. Keep pgvector out of the critical MVP path; add it later if semantic logistics knowledge search is implemented.

## Security principles

- Never expose the Groq API key to Next.js.
- Validate all API inputs at the boundary with Zod.
- Authorize consequential actions before execution.
- Record AI recommendations and action approvals in an audit trail.
- Keep database access inside the backend.
- Do not let LLM-generated identifiers or filters bypass application-level authorization.

## Why a modular monolith?

The project is intentionally a modular monolith because it provides the architecture benefits needed for a strong portfolio project without spending the 30-day schedule on distributed-systems infrastructure. Boundaries are kept explicit so individual modules can be extracted later if a real scale requirement appears.

## Python reference implementation

`backend_python/` contains the previous FastAPI/Python implementation. It is not part of the runtime path of the current application. Keeping it available makes the migration explicit and provides a useful reference when comparing Python and TypeScript backend approaches.

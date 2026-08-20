# LogiAI Architecture

## Technology

- Next.js + TypeScript frontend
- Python 3.13+ / FastAPI backend
- Pydantic v2 for API and AI contracts
- SQLAlchemy 2.x for persistence
- Alembic for database migrations
- PostgreSQL
- Groq for structured AI reasoning and tool calling
- SSE for realtime updates
- Docker for local infrastructure

## High-level architecture

```text
Next.js
   │
   │ REST + SSE
   ▼
FastAPI / Python
   │
   ├── API routes
   ├── Application services
   ├── Deterministic risk engine
   ├── AI tool registry
   ├── Groq integration
   └── Action executor
          │
          ▼
     SQLAlchemy 2.x
          │
          ▼
      PostgreSQL
```

## Layering

```text
HTTP / FastAPI routes
        ↓
Application Services
        ↓
Domain logic
        ↓
Repositories / SQLAlchemy
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
Repositories / SQLAlchemy
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
├── app/
│   ├── api/
│   │   └── routes/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── services/
│   └── main.py
├── migrations/
├── tests/
├── pyproject.toml
└── README.md
```

Keep the backend as a modular monolith for the 30-day MVP. Do not introduce microservices just for the sake of demonstrating them.

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

## Dependency injection

FastAPI dependencies provide request-scoped access to infrastructure such as the database session and authenticated user context. Business services should remain independent of HTTP concerns where practical.

```text
FastAPI dependency
       ↓
Application service
       ↓
Repository
       ↓
SQLAlchemy session
```

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

The backend validates model output with Pydantic models before returning it to Next.js. Use discriminated response types such as:

```text
risk_analysis
recommendation
shipment_list
action_confirmation
```

The frontend should render structured data rather than parse free-form AI prose.

## Realtime

Shipment events are simulated in development and published through SSE:

```text
Event simulator → FastAPI → SSE → Next.js
```

## Data strategy

Use relational tables for core entities and JSONB for flexible event metadata and AI payloads. Keep pgvector out of the critical MVP path; add it later if semantic logistics knowledge search is implemented.

## Security principles

- Never expose the Groq API key to Next.js.
- Validate all API inputs at the boundary with Pydantic.
- Authorize consequential actions before execution.
- Record AI recommendations and action approvals in an audit trail.
- Keep database access inside the backend.
- Do not let LLM-generated identifiers or filters bypass application-level authorization.

## Why a modular monolith?

The project is intentionally a modular monolith because it provides the architecture benefits needed for a strong portfolio project without spending the 30-day schedule on distributed-systems infrastructure. Boundaries are kept explicit so individual modules can be extracted later if a real scale requirement appears.

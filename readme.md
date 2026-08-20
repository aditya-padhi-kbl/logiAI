# 🚚 LogiAI

> AI-powered logistics operations control tower for detecting, investigating, and resolving shipment exceptions.

LogiAI is a 30-day AI-native portfolio project for a Logistics Operations Manager. It combines operational shipment data, deterministic risk scoring, realtime events, and a Groq-powered AI assistant.

## Product workflow

```text
What needs my attention?
        ↓
Why is it happening?
        ↓
What should I do?
        ↓
Human approval
        ↓
Execute + audit
```

The AI is an operational copilot, not the source of truth. Operational facts, risk calculations, and consequential actions remain controlled by the backend.

## Architecture

```text
Next.js
   │ REST + SSE
   ▼
FastAPI / Python
   ├── API routes
   ├── Application services
   ├── Risk Engine
   ├── AI Tool Registry
   ├── Groq Integration
   └── Action Executor
          │
          ▼
      SQLAlchemy 2.x
          │
          ▼
      PostgreSQL
```

AI accesses controlled application tools rather than PostgreSQL directly:

```text
Groq Agent → AI Tools → Application Services → SQLAlchemy → PostgreSQL
```

See [`architecture.md`](./architecture.md) for the detailed technical design.

## Technology stack

### Frontend

- Next.js
- TypeScript
- TanStack Query
- RxJS where shared realtime streams are useful
- Tailwind CSS / MUI

### Backend

- Python 3.13+
- FastAPI
- Pydantic v2
- SQLAlchemy 2.x
- Alembic
- asyncpg
- pytest

### Data / AI

- PostgreSQL
- Groq
- Structured JSON responses
- Tool calling
- SSE
- Docker / Docker Compose

### Python tooling

- `uv` for dependency and environment management
- Ruff for linting/formatting
- Pytest for tests

## Domain model

```text
Party ──┐
        ├── Shipment ── Carrier
Party ──┘       │
                ├── Route ── RouteStop ── Warehouse
                └── ShipmentEvent
```

A shipment has `senderId` and `receiverId`, both referencing `Party`. Sender and receiver are shipment relationship roles, not permanent party types.

## Core capabilities

- Control Tower with operational KPIs
- Shipment search and details
- Shipment event timeline
- Deterministic shipment risk scoring
- Carrier and warehouse analysis
- Groq-powered investigation
- Structured AI responses
- AI tool calling
- Human approval for consequential actions
- SSE realtime updates
- Audit trail

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

Write tools, protected by human approval:

```text
rerouteShipment
notifyCustomer
escalateCarrier
```

## Structured AI output

AI responses are validated before reaching Next.js. Example:

```json
{
  "type": "risk_analysis",
  "shipmentId": "TRK-1829",
  "riskScore": 0.91,
  "riskLevel": "CRITICAL",
  "summary": "Shipment is highly likely to miss its SLA.",
  "reasons": [
    {
      "factor": "Warehouse congestion",
      "impact": "HIGH",
      "evidence": "Pune warehouse is operating near capacity."
    }
  ],
  "recommendations": [
    {
      "action": "REROUTE_SHIPMENT",
      "reason": "An alternative route can reduce expected delay."
    }
  ]
}
```

Pydantic models validate these contracts before they become operational results. The UI renders cards, tables, evidence, risk indicators, and actions without parsing arbitrary prose.

## Risk engine

The MVP uses deterministic scoring rather than an ML model:

```text
Current delay       35%
Carrier performance 25%
Warehouse load      20%
Route history       20%
```

```text
Operational Data → Risk Engine → Risk Score → Groq → Explanation + Recommendation
```

## Realtime

```text
Event Simulator
      ↓
FastAPI
      ↓ SSE
Next.js Control Tower
```

## Development data

The target simulated dataset is:

```text
100+ Parties
10+ Carriers
20+ Warehouses
50+ Routes
2,000+ Shipments
15,000+ Shipment Events
```

Scenarios include normal shipments, carrier degradation, warehouse congestion, route disruption, SLA breaches, and combined high-risk shipments.

The hero scenario is `TRK-1829`, which combines multiple risk factors and demonstrates the full investigation → recommendation → approval → execution → audit flow.

## 30-day plan

1. **Foundation:** Python, FastAPI, Pydantic, SQLAlchemy, PostgreSQL, domain model and migrations.
2. **Control Tower:** APIs, Next.js dashboard, shipment details, events and deterministic risk engine.
3. **AI:** Groq, structured outputs, tool registry, investigation and recommendations.
4. **Realtime + Actions:** SSE, event simulator, approval workflow, action execution and audit.
5. **Polish:** tests, error handling, performance, observability, deployment and documentation.

See [`docs/30-day-roadmap.md`](./docs/30-day-roadmap.md).

## Non-goals

The 30-day MVP does not include real carrier integrations, GPS tracking, mobile apps, billing, multi-tenancy, enterprise SSO, advanced RBAC, ML training, production-grade route optimization, Kafka, Kubernetes, microservices, or a complete logistics ERP.

## Documentation

- [`product.md`](./product.md) — product requirements and MVP scope
- [`architecture.md`](./architecture.md) — backend and system architecture
- [`docs/30-day-roadmap.md`](./docs/30-day-roadmap.md) — implementation and Python/AI learning plan

## Learning objective

The project is intentionally built with Python/FastAPI so it doubles as practical backend and AI engineering preparation. Key concepts include Python typing, Pydantic, async/await, FastAPI dependency injection, SQLAlchemy, Alembic, transactions, concurrency, REST API design, SSE, testing, observability, and AI tool orchestration.

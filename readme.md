# LogiAI

> AI-powered logistics operations control tower for detecting, investigating, and resolving shipment exceptions.

LogiAI is an AI-native logistics operations prototype. The backend remains the source of truth for operational state, deterministic calculations, and consequential actions; AI provides investigation, explanation, and recommendations through controlled application tools.

## Architecture

```text
Next.js
   │ REST + SSE
   ▼
Bun / Elysia
   ├── API routes
   ├── Application services
   ├── Deterministic risk engine
   ├── AI tool registry
   └── Groq integration
          │
          ▼
       Kysely
          │
          ▼
      PostgreSQL
```

AI never accesses PostgreSQL directly:

```text
Groq Agent → AI Tools → Application Services → Kysely → PostgreSQL
```

## Technology

### Frontend

- Next.js
- TypeScript
- TanStack Query
- RxJS where shared realtime streams are useful
- Tailwind CSS / MUI

### Backend

- Bun
- TypeScript
- Elysia
- Kysely
- Zod
- PostgreSQL

The previous Python implementation is retained under `backend_python/` as a reference implementation and is not the active backend.

## Domain

```text
Party ──┐
        ├── Shipment ── Carrier
Party ──┘       │
                ├── Route ── RouteStop ── Warehouse
                └── ShipmentEvent
```

`shipment.status` represents the current state. `shipment_event` is append-only history. State changes and their corresponding events are committed atomically.

## Current shipment API

```text
POST   /shipments
GET    /shipments
GET    /shipments/:id
PATCH  /shipments/:id/status
GET    /shipments/:id/shipmentEvents
```

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

## Documentation

- [`docs/product.md`](./docs/product.md) — product specification, goals, domain, and MVP scope
- [`docs/architecture.md`](./docs/architecture.md) — system and backend architecture
- [`docs/ai-contract.md`](./docs/ai-contract.md) — AI response and tool contracts
- [`docs/30-day-roadmap.md`](./docs/30-day-roadmap.md) — implementation roadmap
- [`AGENTS.md`](./AGENTS.md) — repository-wide engineering rules
- [`backend/AGENTS.md`](./backend/AGENTS.md) — backend-specific engineering rules
- [`frontend/AGENTS.md`](./frontend/AGENTS.md) — frontend-specific engineering rules

## Development data

The target simulated dataset includes realistic parties, carriers, warehouses, routes, shipments, and shipment events covering normal operations, delays, carrier degradation, warehouse congestion, route disruption, and SLA breaches.

The hero scenario is `TRK-1829`, which demonstrates investigation → recommendation → approval → execution → audit.

## Project status

The project is being built incrementally as a modular monolith. The current focus is the shipment domain and its deterministic intelligence foundation before introducing the AI investigation layer.

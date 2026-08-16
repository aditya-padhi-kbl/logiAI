# 🚚 LogiAI

> **AI-powered logistics control tower for monitoring, investigating, and resolving shipment exceptions.**

LogiAI is an AI-native logistics operations platform designed to help logistics teams answer three questions:

> **What needs my attention?**
> **Why is it happening?**
> **What should I do about it?**

The application combines real-time shipment events, operational data, deterministic risk scoring, and AI-powered investigation to help operations managers identify and resolve logistics exceptions.

---

## 🎯 Problem

Logistics operations teams often have visibility into shipment status, but identifying and resolving exceptions requires manually correlating information from multiple sources:

- Shipment status
- Shipment event history
- Carrier performance
- Warehouse congestion
- Route performance
- Delivery SLAs

A typical investigation might look like:

```text
Shipment Dashboard
        ↓
Identify delayed shipment
        ↓
Check carrier performance
        ↓
Check warehouse status
        ↓
Check route
        ↓
Check shipment history
        ↓
Determine root cause
        ↓
Decide corrective action
        ↓
Notify relevant parties
```

LogiAI aims to reduce this workflow to:

```text
                 AI Control Tower
                        │
              ┌─────────┼─────────┐
              │         │         │
           Monitor   Investigate   Act
              │         │         │
              ▼         ▼         ▼
            Risks     Why?      Fix it
```

---

# ✨ Core Experience

The primary workflow is:

```text
"What needs my attention?"
              ↓
       Identify risks
              ↓
     Select shipment
              ↓
"Why is this shipment at risk?"
              ↓
      AI investigation
              ↓
     Root-cause analysis
              ↓
"What should I do?"
              ↓
     AI recommendation
              ↓
       Human review
              ↓
      Approve / Reject
              ↓
      Execute action
              ↓
        Audit trail
```

The goal is not to replace the operations manager.

The goal is to give them an **AI-powered operational copilot** that can investigate issues and recommend actions while keeping humans in control of operational changes.

---

# 🧠 AI Capabilities

LogiAI uses Groq for AI reasoning and structured responses.

The AI can answer questions such as:

```text
What needs my attention?

Which shipments are at risk?

Why is shipment TRK-1829 delayed?

Why are shipments through Pune delayed?

Which carrier is performing worst?

What should I do about TRK-1829?
```

The AI does not directly access the database.

Instead, it uses controlled backend tools:

```text
                    AI Agent
                       │
              ┌────────┼─────────┐
              │        │         │
              ▼        ▼         ▼
        Shipment    Carrier   Warehouse
           Tool       Tool       Tool
              │        │         │
              └────────┼─────────┘
                       ▼
                   PostgreSQL
```

This keeps data access controlled and makes the AI layer easier to test and evolve.

---

# 📦 Structured AI Output

AI responses are not treated as arbitrary text.

Groq produces structured JSON which is validated by the backend before being returned to the frontend.

Conceptually:

```text
                 Groq
                  │
                  ▼
           Structured JSON
                  │
                  ▼
           Schema Validation
                  │
                  ▼
             AI Response
                  │
                  ▼
               Next.js
```

Supported response types include:

```text
TextResponse
ShipmentTableResponse
RiskAnalysisResponse
RecommendationResponse
ActionConfirmationResponse
```

Example:

```json
{
  "type": "risk_analysis",
  "shipmentId": "TRK-1829",
  "riskScore": 0.91,
  "reasons": [
    {
      "factor": "Carrier delay",
      "impact": "HIGH",
      "explanation": "Carrier is experiencing significant delays on this route."
    },
    {
      "factor": "Warehouse congestion",
      "impact": "MEDIUM",
      "explanation": "The shipment is currently passing through a warehouse operating near capacity."
    }
  ],
  "recommendation": "Consider rerouting the shipment."
}
```

This allows the frontend to render AI responses as rich UI rather than relying entirely on Markdown/text.

---

# 🏗️ Architecture

```text
┌─────────────────────────────────────────────┐
│                  Next.js                    │
│                                             │
│  Control Tower                              │
│  Shipment Details                           │
│  AI Investigation                           │
│  Action Review                              │
└──────────────────────┬──────────────────────┘
                       │
                  REST + SSE
                       │
┌──────────────────────▼──────────────────────┐
│               Bun + Elysia                  │
│                                             │
│  Shipment APIs                              │
│  Event APIs                                 │
│  AI Agent                                   │
│  Tool Registry                              │
│  Risk Engine                                │
│  Action Executor                            │
└─────────────┬────────────────┬──────────────┘
              │                │
              ▼                ▼
       ┌────────────┐      ┌─────────┐
       │ PostgreSQL │      │  Groq   │
       │            │      │         │
       │  Drizzle   │      │   AI    │
       └────────────┘      └─────────┘
```

---

# 🛠️ Technology Stack

## Frontend

- **Next.js**
- **TypeScript**
- **TanStack Query**
- **RxJS**
- **Tailwind CSS / MUI**

## Backend

- **Bun**
- **Elysia**
- **TypeScript**

## Database

- **PostgreSQL**
- **Drizzle ORM**
- **pgvector** — planned for semantic search

## AI

- **Groq**
- Structured AI responses
- Tool calling
- AI orchestration

## Realtime

- **Server-Sent Events (SSE)**

## Infrastructure

- Docker
- Docker Compose

---

# 🧩 Domain Model

The logistics domain is built around a shipment.

```text
                         ┌──────────┐
                         │  Party   │
                         └────┬─────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
             senderId                 receiverId
                 │                         │
                 └───────────┬─────────────┘
                             ▼
                       ┌───────────┐
                       │ Shipment  │
                       └─────┬─────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
     ShipmentEvent       AIInsight           AIAction

                       Shipment
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                 Carrier         Route
                                  │
                                  ▼
                              RouteStop
                                  │
                                  ▼
                              Warehouse
```

### Core entities

| Entity            | Responsibility                                 |
| ----------------- | ---------------------------------------------- |
| **Party**         | Sender or receiver participating in a shipment |
| **Shipment**      | Central logistics object                       |
| **Carrier**       | Company transporting the shipment              |
| **Route**         | Planned transportation path                    |
| **RouteStop**     | Warehouse/hub involved in a route              |
| **Warehouse**     | Physical logistics facility                    |
| **ShipmentEvent** | Immutable history of shipment events           |
| **AIInsight**     | AI-generated investigation/analysis            |
| **AIAction**      | AI-proposed or executed operational action     |

---

# 📍 Shipment

A shipment contains:

```text
trackingNumber
orderNumber

sender
receiver

carrier
route

origin
destination
currentLocation

status

expectedDeliveryAt
actualDeliveryAt

riskScore
```

Example:

```text
Shipment: TRK-1829

Sender:
  Acme Electronics
  Bangalore

Receiver:
  Reliance Retail
  Mumbai

Carrier:
  BlueDart

Route:
  Bangalore → Pune → Mumbai

Status:
  DELAYED

Risk:
  91%
```

---

# 🔄 Shipment Lifecycle

```text
CREATED
   │
   ▼
PICKED_UP
   │
   ▼
IN_TRANSIT
   │
   ├─────────────► DELAYED
   │                  │
   │                  ▼
   │              IN_TRANSIT
   │
   ▼
OUT_FOR_DELIVERY
   │
   ▼
DELIVERED
```

A shipment can also enter:

```text
CANCELLED
```

---

# 📡 Shipment Events

Shipment status represents the **current state**.

Shipment events represent **what happened**.

Example:

```text
10:00  PICKED_UP
12:30  ARRIVED_AT_WAREHOUSE
16:00  WAREHOUSE_CONGESTION
18:00  DELAYED
```

Events provide the historical context required for AI investigation.

Example:

```text
User:
"Why is TRK-1829 delayed?"

                ↓

Shipment
   │
   ├── Current status
   ├── Expected delivery
   └── Current location

Events
   │
   ├── Warehouse arrival
   ├── Warehouse congestion
   ├── Route disruption
   └── Delay

Carrier
   │
   └── Historical performance

Route
   │
   └── Historical delays

                ↓

            Risk Engine

                ↓

               Groq

                ↓

        Structured Analysis
```

---

# ⚠️ Risk Engine

The MVP does not train a machine-learning model.

Risk is initially calculated using deterministic operational signals.

Example:

```text
Current delay       35%
Carrier performance 25%
Warehouse load      20%
Route history       20%
```

Conceptually:

```text
riskScore =
    delayRisk       × 0.35
  + carrierRisk     × 0.25
  + warehouseRisk   × 0.20
  + routeRisk       × 0.20
```

The backend calculates the operational risk.

The AI explains the risk and recommends actions.

```text
Operational Data
       ↓
Risk Engine
       ↓
Risk Score
       ↓
Groq
       ↓
Explanation + Recommendation
```

This keeps critical operational calculations deterministic rather than relying on an LLM.

---

# 🤖 AI Tools

The AI agent will have access to controlled read tools:

```text
searchShipments
getShipment
getShipmentEvents
getAtRiskShipments
getCarrierPerformance
getWarehouseStatus
getRouteInformation
```

Write tools will be introduced later:

```text
rerouteShipment
notifyCustomer
escalateCarrier
```

Write operations require human approval.

---

# 🙋 Human-in-the-Loop

AI should not independently perform operationally significant actions.

The workflow is:

```text
AI Recommendation
       ↓
Human Review
       ↓
Approve / Reject
       ↓
Execute
       ↓
Audit
```

Action lifecycle:

```text
PROPOSED
   │
   ├────────────► REJECTED
   │
   ▼
APPROVED
   │
   ▼
EXECUTING
   │
   ├────────────► FAILED
   │
   ▼
COMPLETED
```

---

# 📊 MVP Screens

## Control Tower

```text
/control-tower
```

Provides:

- Shipment KPIs
- Shipment map
- Active shipment table
- At-risk shipments
- Delayed shipments
- SLA breaches
- AI assistant

---

## Shipment Details

```text
/shipments/:id
```

Provides:

- Shipment information
- Sender
- Receiver
- Carrier
- Route
- Current location
- Risk score
- Event timeline
- AI investigation

---

## AI Investigation

```text
/investigation/:id
```

Provides:

- Investigation progress
- AI reasoning summary
- Risk factors
- Supporting operational data
- Recommendations

---

## Action Review

```text
/actions/:id
```

Provides:

- Proposed action
- Reason
- Expected impact
- Supporting evidence
- Approve / Reject

---

# 🗃️ Database

The MVP will use PostgreSQL with Drizzle ORM.

Initial tables:

```text
parties
carriers
warehouses
routes
route_stops
shipments
shipment_events
ai_insights
ai_actions
```

The database will use relational structures for core domain data and `jsonb` for flexible event metadata and AI payloads.

Planned future use of `pgvector` will support semantic search over logistics documents and operational knowledge.

---

# 📈 Seed Data

The application will use simulated logistics data rather than real carrier integrations.

The development dataset will contain approximately:

```text
100+ Parties
10+ Carriers
20+ Warehouses
50+ Routes
2,000+ Shipments
15,000+ Shipment Events
```

The seed data will intentionally contain realistic operational scenarios:

```text
Normal shipments
Delayed shipments
Carrier degradation
Warehouse congestion
Route disruption
SLA breaches
Combined high-risk shipments
```

This allows the AI features to operate on meaningful scenarios rather than trivial demo data.

---

# 🎯 Hero Scenario

The main demonstration scenario will be a shipment experiencing multiple risk factors.

Example:

```text
Shipment TRK-1829

        ↓

Existing delay
        +
Poor carrier performance
        +
Congested warehouse
        +
Route disruption

        ↓

High Risk Score

        ↓

AI Investigation

        ↓

Root Cause

        ↓

Recommended Action

        ↓

Human Approval

        ↓

Action Execution
```

This scenario represents the complete LogiAI product experience.

---

# 🚧 30-Day Scope

The project is intentionally scoped to be completed in 30 days.

## Phase 1 — Foundation

- Project setup
- Domain model
- PostgreSQL
- Drizzle
- Seed data
- Backend structure

## Phase 2 — Logistics Control Tower

- Shipment APIs
- Dashboard
- Shipment table
- Shipment details
- Event timeline
- Risk engine

## Phase 3 — AI

- Groq integration
- Structured outputs
- AI tool registry
- Shipment investigation
- Natural language queries
- AI recommendations

## Phase 4 — Actions & Realtime

- SSE
- Event simulator
- Human approval workflow
- Action execution
- Audit trail

## Phase 5 — Polish

- UX improvements
- Error handling
- Testing
- Performance
- Observability
- Deployment
- Documentation

---

# 🚫 Non-Goals

The following are intentionally outside the MVP:

- Real carrier integrations
- Real GPS tracking
- Mobile application
- Customer-facing portal
- Billing
- Multi-tenancy
- SSO
- Advanced RBAC
- ML model training
- Production-grade route optimization
- Kafka
- Kubernetes
- Microservices
- Full logistics ERP functionality

These may be considered after the MVP.

---

# 🔮 Future Extensions

Potential future capabilities:

- ML-based ETA prediction
- Route optimization
- Real carrier integrations
- Weather intelligence
- Semantic search over logistics SOPs
- Logistics document intelligence
- Automated customer communication
- Predictive warehouse congestion
- Carrier performance forecasting
- Multi-agent workflows
- Autonomous exception resolution

---

# 📁 Project Structure

The planned repository structure:

```text
logiai/
│
├── README.md
│
├── docs/
│   ├── product.md
│   ├── architecture.md
│   ├── ai-contract.md
│   └── non-goals.md
│
├── frontend/
│   └── ...
│
└── backend/
    └── ...
```

---

# 🗓️ Development Plan

The project is being built incrementally over 30 days.

### Day 1

Product definition and architecture

### Day 2

Domain model and database foundation

### Day 3

Backend foundation and shipment APIs

### Day 4–6

Shipment and logistics APIs

### Day 7–9

Control tower UI

### Day 10–12

Shipment details and event timeline

### Day 13–15

Risk engine

### Day 16–19

Groq integration and structured AI responses

### Day 20–22

AI tools and investigation workflow

### Day 23–25

Realtime events with SSE

### Day 26–27

Human-in-the-loop actions

### Day 28

Testing and error handling

### Day 29

Performance, observability and polish

### Day 30

Deployment, documentation and final demo

---

# 🏁 Definition of Done

The MVP is complete when an operator can:

```text
Open Control Tower
       ↓
Ask "What needs my attention?"
       ↓
See high-risk shipments
       ↓
Select a shipment
       ↓
Ask "Why is this shipment at risk?"
       ↓
Receive structured AI analysis
       ↓
Ask "What should I do?"
       ↓
Receive a recommendation
       ↓
Review the proposed action
       ↓
Approve it
       ↓
See the action executed
       ↓
See the result in the audit trail
```

The entire workflow should run against simulated logistics data without requiring manual database intervention.

---

# 📌 Project Philosophy

LogiAI follows a few principles:

### Deterministic where possible

Operational calculations such as risk scores should be deterministic and reproducible.

### AI where it adds value

Use AI for:

- investigation
- reasoning
- natural-language interaction
- summarization
- recommendations

### Structured over unstructured

AI responses should be machine-readable and validated before reaching the UI.

### Human in the loop

AI can recommend operational actions, but humans remain responsible for approving consequential changes.

### Domain-first architecture

The system should model real logistics concepts rather than forcing logistics workflows into generic CRUD abstractions.

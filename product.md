# LogiAI — Product Specification

## 1. Product Overview

**Product:** LogiAI  
**Type:** AI-powered logistics operations control tower  
**Primary user:** Logistics Operations Manager

### Vision

Help logistics operations teams detect shipment problems, understand their root causes, and take corrective action with an AI-powered operational assistant.

### Core value proposition

> Turn logistics data into actionable decisions.

The operator should move from:

```text
"I have thousands of shipments. Which ones should I care about?"
```

to:

```text
"These shipments are at risk."
"Here is why."
"Here is what I recommend doing."
```

The AI is an operational copilot, not the source of truth. Operational facts, deterministic risk calculations, and consequential actions remain controlled by the backend.

---

## 2. Target User

The primary user is a **Logistics Operations Manager** responsible for monitoring shipments and resolving operational exceptions.

Responsibilities include:

- Monitoring active shipments
- Identifying delayed and at-risk shipments
- Investigating exceptions
- Monitoring carrier performance
- Monitoring warehouse congestion
- Coordinating corrective actions
- Escalating operational issues

---

## 3. Problem Statement

Logistics operations generate large amounts of related data:

- Shipment status
- Shipment events
- Carrier performance
- Warehouse capacity
- Route information
- Delivery SLAs

When a shipment is delayed, an operator may need to manually correlate:

```text
Shipment
   ↓
Carrier
   ↓
Route
   ↓
Warehouse
   ↓
Historical events
   ↓
SLA
```

This makes exception management slow and reactive.

LogiAI provides a single operational interface that can:

1. Identify important exceptions.
2. Explain why they are happening.
3. Recommend what should be done next.
4. Execute approved actions safely.

---

## 4. Product Goals

### Detect

Identify shipments that require operational attention:

- Delayed shipments
- High-risk shipments
- SLA breaches
- Carrier-related issues
- Warehouse-related issues
- Route disruptions

### Investigate

Correlate shipment events, carrier performance, route history, warehouse conditions, and current shipment state to explain an exception.

### Recommend

Provide evidence-backed operational recommendations such as rerouting a shipment when the current route or warehouse conditions create significant delay risk.

### Execute safely

Allow an operator to review and approve consequential AI recommendations before execution.

The MVP does **not** allow AI to autonomously execute consequential operational actions.

---

## 5. Core User Journey

```text
Control Tower
     ↓
What needs attention?
     ↓
Identify shipment
     ↓
Investigate issue
     ↓
Understand why
     ↓
Get recommendation
     ↓
Review action
     ↓
 ┌───┴───┐
 ▼       ▼
Approve Reject
  ↓
Execute
  ↓
Audit
```

This is the primary workflow around which the MVP should be designed.

---

## 6. Control Tower

The Control Tower is the primary screen and provides a real-time operational overview.

### Key metrics

- Total shipments
- In-transit shipments
- Delayed shipments
- At-risk shipments
- SLA breaches
- Delivered shipments

### Main components

```text
┌─────────────────────────────────────────┐
│             Operational KPIs            │
├─────────────────────────────────────────┤
│  Total   In Transit   At Risk  Delayed  │
├─────────────────────────────────────────┤
│              Shipment Map               │
├─────────────────────────────────────────┤
│          Exceptions / Shipments         │
├─────────────────────────────────────────┤
│             AI Assistant                │
└─────────────────────────────────────────┘
```

The operator should understand the current operational state within a few seconds.

---

## 7. Core Domain Model

### Shipment

The central business object.

```text
Tracking Number
Order Number
Sender
Receiver
Carrier
Route
Origin
Destination
Current Location
Status
Expected Delivery
Actual Delivery
Risk Score
```

### Party

A Party represents an organization or customer participating in a shipment. A Party can act as either sender or receiver.

The shipment explicitly stores the relationship:

```text
senderId
receiverId
```

Sender and receiver are **shipment roles**, not permanent Party types.

Example:

```text
Shipment TRK-1829

Sender:
  Acme Electronics

Receiver:
  Reliance Retail
```

### Carrier

Responsible for transporting a shipment.

Attributes include:

- Name
- Code
- On-time rate
- Average delay
- Operational status

Carrier performance contributes to risk scoring.

### Route

Represents the planned transportation path.

Example:

```text
Bangalore
    ↓
Pune
    ↓
Mumbai
```

A route contains one or more route stops. A stop may represent a warehouse, distribution center, or logistics hub.

### Warehouse

Represents a physical logistics facility.

Operational attributes include:

- Capacity
- Current load
- Utilization
- Operational status

Example:

```text
Pune Warehouse
Capacity:      10,000
Current load:   9,600
Utilization:       96%
Status:       CONGESTED
```

### Shipment Events

Events represent what happened to a shipment over time.

```text
08:30  PICKED_UP
11:20  ARRIVED_AT_WAREHOUSE
16:10  WAREHOUSE_CONGESTION
18:40  DELAYED
```

**Shipment status** represents the current state. **Shipment events** represent historical state changes and operational observations.

---

## 8. Risk Detection

The MVP uses a deterministic risk engine rather than an ML model.

Inputs may include:

- Current delay
- Carrier performance
- Warehouse utilization
- Route performance
- SLA proximity

Initial weighting:

```text
Current delay        35%
Carrier performance 25%
Warehouse load       20%
Route performance    20%
```

The engine produces a score from `0` to `1` and a risk level.

Example:

```text
TRK-1829
Risk Score: 0.91
Risk Level: CRITICAL
```

### Principle

```text
Operational Data
      ↓
Risk Engine
      ↓
Risk Score
      ↓
AI
      ↓
Explanation + Recommendation
```

The backend calculates the risk. The AI explains the risk and recommends actions. The LLM must not become the source of truth for critical operational calculations.

---

## 9. AI Assistant

The assistant provides natural-language access to operational data.

### Monitoring

```text
What needs my attention?
Show me today's high-risk shipments.
Which shipments are likely to miss their SLA?
```

### Investigation

```text
Why is TRK-1829 delayed?
Why are shipments through Pune delayed?
What caused the SLA breach?
```

### Analysis

```text
Which carrier is performing worst?
Which routes have the highest delay rate?
What are the major operational issues today?
```

### Recommendation

```text
What should I do about TRK-1829?
Should I reroute this shipment?
How can we reduce the impact of this delay?
```

---

## 10. AI Investigation

For a shipment investigation, the AI gathers relevant operational context through controlled application tools.

Example:

```text
User
 │
 │ "Why is TRK-1829 delayed?"
 ▼
AI Agent
 │
 ├── getShipment()
 ├── getShipmentEvents()
 ├── getCarrierPerformance()
 ├── getRouteInformation()
 └── getWarehouseStatus()
 │
 ▼
Structured Context
 │
 ▼
Groq
 │
 ▼
Risk Analysis
```

The analysis should answer:

- **What happened?**
- **Why did it happen?**
- **What else contributed?**
- **What is the operational impact?**

Example evidence:

> Shipment remained at Pune warehouse for 8 hours while the facility was operating at 96% capacity. The carrier is also experiencing above-average delays on the route.

---

## 11. Structured AI Responses

AI responses must be structured and validated before reaching the frontend.

The backend uses **Pydantic models** to validate AI contracts. The frontend renders structured fields rather than parsing arbitrary model prose.

Example:

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
      "evidence": "Pune warehouse is operating at 96% capacity."
    },
    {
      "factor": "Carrier performance",
      "impact": "MEDIUM",
      "evidence": "Carrier average delay is 8 hours on this route."
    }
  ],
  "recommendations": [
    {
      "action": "REROUTE_SHIPMENT",
      "reason": "Alternative route can reduce expected delay."
    }
  ]
}
```

---

## 12. AI Tools

The AI does **not** access PostgreSQL directly. It accesses controlled application tools exposed by the FastAPI backend.

### Read tools

```text
searchShipments
getShipment
getShipmentEvents
getAtRiskShipments
getCarrierPerformance
getWarehouseStatus
getRouteInformation
```

### Write tools

```text
rerouteShipment
notifyCustomer
escalateCarrier
```

Write tools require human approval.

Architecture boundary:

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

The LLM never receives direct database credentials or unrestricted database access.

---

## 13. Human-in-the-Loop

Example recommendation:

```text
Reroute TRK-1829 through Route R42.

Expected delay reduction: 7 hours.

Reason:
Current route is experiencing significant congestion.
```

The operator sees:

```text
[ Approve ]    [ Reject ]
```

Only after approval does the backend execute the action.

### Action lifecycle

```text
PROPOSED
    │
    ├──────► REJECTED
    │
    ▼
APPROVED
    │
    ▼
EXECUTING
    │
    ├──────► FAILED
    │
    ▼
COMPLETED
```

---

## 14. Realtime Updates

Shipment events should appear in the Control Tower without requiring a page refresh.

The MVP uses **Server-Sent Events (SSE)**:

```text
Event Simulator
      ↓
FastAPI
      ↓ SSE
Next.js
      ↓
Control Tower
```

---

## 15. Auditability

The system preserves a record of AI-generated insights and operational actions.

For every AI action, the system should be able to answer:

```text
What did AI recommend?
Why?
When?
For which shipment?
Who approved it?
What happened after execution?
```

This is a core requirement for an operational system where AI influences consequential decisions.

---

## 16. MVP Scope

### Logistics

- Parties
- Shipments
- Carriers
- Routes
- Route stops
- Warehouses
- Shipment events

### Operations

- Control Tower
- Shipment search
- Shipment details
- Shipment timeline
- Risk detection
- Exception monitoring

### AI

- Natural-language queries
- Shipment investigation
- Root-cause analysis
- Structured AI responses
- Recommendations
- Tool calling through the FastAPI backend

### Actions

- Reroute shipment
- Notify customer
- Escalate carrier
- Human approval
- Action execution
- Audit trail

### Realtime

- Shipment event simulation
- SSE updates

### Platform

- Next.js frontend
- Python / FastAPI backend
- Pydantic validation
- SQLAlchemy 2.x data access
- Alembic migrations
- PostgreSQL persistence
- Groq for AI inference

---

## 17. Non-Goals

Explicitly outside the 30-day MVP:

- Real carrier integrations
- Real GPS tracking
- Mobile applications
- Customer portal
- Billing
- Payments
- Multi-tenancy
- Enterprise SSO
- Advanced RBAC
- ML model training
- Production-grade route optimization
- Autonomous logistics operations
- Kafka
- Kubernetes
- Microservices

The goal is a **strong AI-native logistics operations prototype**, not a complete logistics ERP.

---

## 18. Success Criteria

The MVP is complete when an operator can execute this workflow:

```text
1. Open Control Tower
2. Ask: "What needs my attention?"
3. See high-risk shipments
4. Select TRK-1829
5. Ask: "Why is this shipment at risk?"
6. AI retrieves relevant operational data through controlled tools
7. AI produces structured analysis
8. Ask: "What should I do?"
9. AI recommends an action
10. Operator reviews the recommendation
11. Operator approves the action
12. Backend executes the action
13. Action appears in the audit trail
14. Realtime shipment state is updated
```

This workflow is the definition of done for the MVP.

---

## 19. Product Principles

### 1. AI should reason over data, not invent data

Operational facts must come from the backend.

### 2. Deterministic systems remain deterministic

Risk calculations, shipment states, and operational actions should not depend solely on an LLM.

### 3. Structured AI over text-only AI

AI responses should be machine-readable and validated with Pydantic.

### 4. Humans remain in control

AI recommends. Humans approve consequential actions.

### 5. Investigate before recommending

The AI should gather sufficient operational context before producing a recommendation.

```text
Observe
   ↓
Investigate
   ↓
Explain
   ↓
Recommend
   ↓
Act
```

---

## 20. Future Vision

After the MVP, LogiAI could evolve into a broader logistics intelligence platform with capabilities such as:

- Predictive ETA
- ML-based risk prediction
- Route optimization
- Weather-aware logistics intelligence
- Carrier forecasting
- Warehouse congestion prediction
- Logistics document intelligence
- SOP knowledge base
- Semantic search
- Automated customer communication
- Multi-agent logistics workflows
- Human-supervised autonomous operations

These capabilities are intentionally outside the 30-day MVP.

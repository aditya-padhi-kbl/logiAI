# LogiAI — Product Specification

## 1. Product Overview

### Product Name

**LogiAI**

### Product Type

AI-powered logistics operations control tower.

### Product Vision

LogiAI helps logistics operations teams detect shipment problems, understand their root causes, and take corrective action using an AI-powered operational assistant.

### Core Value Proposition

> Turn logistics data into actionable decisions.

The product should help an operations manager move from:

```text
"I have thousands of shipments.
Which ones should I care about?"
```

to:

```text
"These 8 shipments are at risk."

"Here is why."

"Here is what I recommend doing."
```

---

# 2. Target User

## Primary User

**Logistics Operations Manager**

The user is responsible for monitoring shipments and resolving operational exceptions.

### Responsibilities

- Monitor active shipments
- Identify delayed shipments
- Identify shipments at risk of missing SLA
- Investigate shipment exceptions
- Monitor carrier performance
- Monitor warehouse congestion
- Coordinate corrective actions
- Escalate operational issues

---

# 3. Problem Statement

Modern logistics operations generate large amounts of operational data:

- Shipment status
- Shipment events
- Carrier performance
- Warehouse capacity
- Route information
- Delivery SLAs

However, this information is often difficult to correlate.

When a shipment is delayed, an operations manager may need to manually investigate:

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

### Problem

Operations teams lack a single intelligent interface that can:

1. Identify important exceptions.
2. Explain why they are happening.
3. Recommend what should be done next.

---

# 4. Product Goals

## Goal 1 — Detect

Identify shipments that require operational attention.

Examples:

- Delayed shipments
- High-risk shipments
- SLA breaches
- Carrier-related issues
- Warehouse-related issues
- Route disruptions

---

## Goal 2 — Investigate

Help the operator understand why an exception occurred.

For example:

> Why is shipment TRK-1829 delayed?

The system should correlate:

- Shipment events
- Carrier performance
- Route history
- Warehouse conditions
- Current shipment state

---

## Goal 3 — Recommend

Provide actionable recommendations.

For example:

> Reroute TRK-1829 through an alternative route because the current route has a significant delay and the next warehouse is congested.

---

## Goal 4 — Execute Safely

Allow operators to approve AI-recommended actions.

AI should **not autonomously execute consequential operational actions** in the MVP.

---

# 5. Core User Journey

The primary product journey is:

```text
                    Control Tower
                         │
                         ▼
               What needs attention?
                         │
                         ▼
                 Identify shipment
                         │
                         ▼
                 Investigate issue
                         │
                         ▼
                   Understand why
                         │
                         ▼
                  Get recommendation
                         │
                         ▼
                   Review action
                         │
                  ┌──────┴──────┐
                  ▼             ▼
               Approve        Reject
                  │
                  ▼
               Execute
                  │
                  ▼
                Audit
```

This is the core workflow around which the MVP should be designed.

---

# 6. Control Tower

The Control Tower is the primary screen.

## Purpose

Provide a real-time operational overview.

The operator should be able to understand the current state of logistics operations within a few seconds.

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
│                                         │
│  Total   In Transit   At Risk  Delayed  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│              Shipment Map               │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│          Exceptions / Shipments         │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│             AI Assistant                │
│                                         │
└─────────────────────────────────────────┘
```

---

# 7. Shipment

A shipment is the central business object.

A shipment contains:

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

---

# 8. Parties

The system distinguishes between a **Party** and a shipment role.

A Party can participate as:

- Sender
- Receiver

Example:

```text
Shipment TRK-1829

Sender:
  Acme Electronics

Receiver:
  Reliance Retail
```

The shipment explicitly defines:

```text
senderId
receiverId
```

This prevents ambiguity around the meaning of "customer".

---

# 9. Carrier

A Carrier is responsible for transporting a shipment.

Carrier information includes:

- Name
- Code
- On-time rate
- Average delay
- Operational status

Carrier performance is one of the inputs used by the risk engine.

---

# 10. Route

A Route represents the planned transportation path.

Example:

```text
Bangalore
    ↓
Pune
    ↓
Mumbai
```

A route consists of one or more `RouteStops`.

Each RouteStop may represent:

- Warehouse
- Distribution center
- Logistics hub

This allows the system to understand where a shipment is expected to travel.

---

# 11. Warehouse

A Warehouse represents a physical logistics facility.

Important operational attributes include:

- Capacity
- Current load
- Utilization
- Operational status

Example:

```text
Pune Warehouse

Capacity:     10,000
Current load:  9,600
Utilization:      96%
Status:      CONGESTED
```

Warehouse congestion can contribute to shipment risk.

---

# 12. Shipment Events

A shipment has a chronological event history.

Example:

```text
08:30  PICKED_UP
11:20  ARRIVED_AT_WAREHOUSE
16:10  WAREHOUSE_CONGESTION
18:40  DELAYED
```

### Important distinction

**Shipment status**

represents the current state.

**Shipment events**

represent what happened over time.

The event history is one of the primary sources used during AI investigation.

---

# 13. Risk Detection

The MVP uses a deterministic risk engine.

It does not use machine learning for the initial risk calculation.

Example inputs:

```text
Current delay
Carrier performance
Warehouse utilization
Route performance
SLA proximity
```

Example weighting:

```text
Current delay        35%
Carrier performance 25%
Warehouse load       20%
Route performance    20%
```

The result is:

```text
Risk Score = 0 → 1
```

Example:

```text
TRK-1829

Risk Score: 0.91

Risk Level: CRITICAL
```

### Principle

The backend calculates the risk.

The AI explains the risk.

```text
Operational Data
      ↓
Risk Engine
      ↓
Risk Score
      ↓
AI
      ↓
Explanation
```

This prevents an LLM from becoming the source of truth for critical operational calculations.

---

# 14. AI Assistant

The AI assistant provides natural-language access to logistics data.

The operator should be able to ask:

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

# 15. AI Investigation

When the operator investigates a shipment, the system should gather relevant operational context.

Example:

```text
User
 │
 │ "Why is TRK-1829 delayed?"
 ▼
AI Agent
 │
 ├── getShipment()
 │
 ├── getShipmentEvents()
 │
 ├── getCarrierPerformance()
 │
 ├── getRouteInformation()
 │
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

The AI should identify:

### What happened?

Example:

> Shipment arrived at Pune warehouse but remained there for 8 hours.

### Why?

Example:

> Pune warehouse is operating at 96% capacity.

### What else contributed?

Example:

> The carrier is currently experiencing above-average delays on this route.

### What is the impact?

Example:

> Shipment has a high probability of missing its delivery SLA.

---

# 16. Structured AI Responses

All AI responses must be structured.

The backend should validate the AI output before sending it to the frontend.

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

The frontend should be able to render this without parsing arbitrary prose.

---

# 17. AI Tools

The AI does not directly access PostgreSQL.

It accesses controlled application tools.

## Read tools

```text
searchShipments
getShipment
getShipmentEvents
getAtRiskShipments
getCarrierPerformance
getWarehouseStatus
getRouteInformation
```

## Write tools

```text
rerouteShipment
notifyCustomer
escalateCarrier
```

Write tools require human approval.

---

# 18. Human-in-the-Loop

The AI may recommend an action:

```text
Recommendation

Reroute TRK-1829 through Route R42.

Expected delay reduction:
7 hours

Reason:
Current route is experiencing significant congestion.
```

The operator sees:

```text
[ Approve ]    [ Reject ]
```

Only after approval should the backend execute the action.

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

# 19. Realtime Updates

Shipment events should appear in the Control Tower without requiring a page refresh.

Example:

```text
Shipment TRK-1829

IN_TRANSIT
    ↓
ARRIVED_AT_WAREHOUSE
    ↓
DELAYED
```

The MVP will use Server-Sent Events (SSE).

Example:

```text
Backend
   │
   │ SSE
   ▼
Next.js
   │
   ▼
Control Tower
```

---

# 20. Auditability

The system should preserve a record of AI-generated insights and actions.

For every AI action, we should be able to determine:

```text
What did AI recommend?
Why?
When?
For which shipment?
Who approved it?
What happened after execution?
```

This is especially important for operational systems.

---

# 21. MVP Scope

The 30-day MVP includes:

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
- Tool calling

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

---

# 22. Non-Goals

The following are explicitly outside the 30-day MVP:

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

The goal is to build a **strong AI-native logistics operations prototype**, not a complete logistics ERP.

---

# 23. Success Criteria

The MVP is successful when an operator can complete the following workflow:

```text
1. Open Control Tower

2. Ask:
   "What needs my attention?"

3. See high-risk shipments

4. Select TRK-1829

5. Ask:
   "Why is this shipment at risk?"

6. AI retrieves relevant operational data

7. AI produces structured analysis

8. Operator asks:
   "What should I do?"

9. AI recommends an action

10. Operator reviews the recommendation

11. Operator approves the action

12. Backend executes the action

13. Action appears in the audit trail

14. Realtime shipment state is updated
```

This workflow is the **definition of done for the MVP**.

---

# 24. Product Principles

## 1. AI should reason over data, not invent data

Operational facts must come from the backend.

---

## 2. Deterministic systems should remain deterministic

Risk calculations, shipment states, and operational actions should not depend solely on an LLM.

---

## 3. Structured AI over text-only AI

AI responses should be machine-readable and validated.

---

## 4. Humans remain in control

AI recommends.

Humans approve consequential actions.

---

## 5. Investigate before recommending

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

# 25. Future Vision

After the MVP, LogiAI could evolve into a more autonomous logistics operations platform.

Potential capabilities:

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
- Autonomous exception resolution

The MVP intentionally focuses on establishing the foundation for these capabilities without attempting to implement them all.

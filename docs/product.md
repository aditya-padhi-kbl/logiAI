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

The AI is an operational copilot, not the source of truth. Operational facts, deterministic calculations, and consequential actions remain controlled by the backend.

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

## 3. Problem Statement

Logistics operations generate large amounts of related data:

- Shipment status and events
- Carrier performance
- Warehouse capacity and utilization
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

Correlate relevant operational data to explain an exception and identify contributing factors.

### Recommend

Provide evidence-backed operational recommendations, such as rerouting a shipment when current route or warehouse conditions create significant delay risk.

### Execute safely

Allow an operator to review and approve consequential recommendations before execution.

The MVP does **not** allow AI to autonomously execute consequential operational actions.

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

## 6. Control Tower

The Control Tower is the primary operational screen. It should give the operator a real-time overview and make important exceptions immediately visible.

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

## 7. Core Domain

### Shipment

The central business object. A shipment has a tracking number, sender, receiver, carrier, route, status, delivery expectations, and operational risk information.

### Party

A Party represents an organization or customer participating in a shipment. A Party can act as either sender or receiver; these are shipment roles rather than permanent Party types.

### Carrier

Responsible for transporting a shipment. Carrier performance contributes to operational risk assessment.

### Route

Represents the planned transportation path and its stops. A stop may represent a warehouse, distribution center, or logistics hub.

### Warehouse

Represents a physical logistics facility with operational attributes such as capacity, utilization, and status.

### Shipment Events

Events represent what happened to a shipment over time. `shipment.status` represents the current state, while shipment events provide the historical timeline.

## 8. Risk Detection

The MVP uses a deterministic risk engine rather than an ML model.

Potential inputs include:

- Current delay
- Carrier performance
- Warehouse utilization
- Route performance
- SLA proximity

The engine produces a normalized risk score and risk level. The exact implementation and weighting belong in the technical architecture rather than the product specification.

The product principle is:

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

The backend remains the source of truth for critical operational calculations.

## 9. AI Assistant

The assistant provides natural-language access to operational information.

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

## 10. AI Investigation

For a shipment investigation, the AI gathers relevant operational context through controlled application capabilities.

The investigation should answer:

- **What happened?**
- **Why did it happen?**
- **What else contributed?**
- **What is the operational impact?**

The AI must reason only over supplied operational evidence. It must not invent missing facts.

See [`ai-contract.md`](./ai-contract.md) for response and tool contracts.

## 11. Human-in-the-Loop

Only after explicit operator approval does the backend execute consequential actions.

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

## 12. Realtime Updates

Shipment events should appear in the Control Tower without requiring a page refresh. The MVP uses Server-Sent Events (SSE).

The transport and implementation details belong in [`architecture.md`](./architecture.md).

## 13. Auditability

The system preserves a record of AI-generated insights and operational actions.

For every consequential AI action, the system should be able to answer:

```text
What did AI recommend?
Why?
When?
For which shipment?
Who approved it?
What happened after execution?
```

## 14. MVP Scope

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
- Controlled tool calling

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

The previous Python/FastAPI implementation is retained under `backend_python/` for reference only.

## 15. Non-Goals

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

## 16. Success Criteria

The MVP is complete when an operator can execute the investigation → recommendation → approval → execution → audit workflow described above.

## 17. Product Principles

### 1. AI should reason over data, not invent data

Operational facts must come from controlled backend/application data.

### 2. Deterministic systems remain deterministic

Risk calculations, shipment states, and operational actions should not depend solely on an LLM.

### 3. Structured AI over text-only AI

AI responses should be machine-readable and validated at the application boundary. The concrete contract is defined in [`ai-contract.md`](./ai-contract.md).

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

## 18. Future Vision

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
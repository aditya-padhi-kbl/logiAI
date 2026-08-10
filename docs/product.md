# LogiAI — Product Specification

## 1. Product Overview

**LogiAI** is an AI-powered logistics control tower that helps logistics operations teams identify shipment risks, investigate exceptions, understand their root causes, and take corrective actions.

### One-line description

> AI-powered control tower for monitoring, investigating, and resolving logistics shipment exceptions.

### Product goal

Help an operations manager answer three questions quickly:

1. **What needs my attention?**
2. **Why is it happening?**
3. **What should I do about it?**

---

# 2. Problem Statement

Logistics operations teams monitor large numbers of shipments across multiple carriers, warehouses, routes, and locations.

Although shipment status information is available, identifying important exceptions often requires manually correlating:

- shipment status
- shipment events
- carrier performance
- warehouse congestion
- route history
- delivery SLAs

This makes it difficult for an operations manager to quickly determine:

- which shipments are likely to miss their SLA
- why a shipment is at risk
- which operational factors are responsible
- what corrective action should be taken

LogiAI brings these signals into a single control tower and uses AI to assist with investigation and decision-making.

---

# 3. Target User

## Primary User: Logistics Operations Manager

The primary user is responsible for monitoring and resolving shipment exceptions.

### Responsibilities

- Monitor active shipments
- Identify delayed or at-risk shipments
- Investigate shipment exceptions
- Monitor carrier performance
- Manage SLA violations
- Coordinate corrective actions
- Escalate serious issues

### Current workflow

```text
Shipment Dashboard
       ↓
Identify delay
       ↓
Check carrier system
       ↓
Check warehouse status
       ↓
Check route
       ↓
Check shipment history
       ↓
Decide what to do
       ↓
Contact relevant team/customer
```

### Desired workflow

```text
AI Control Tower
       ↓
"What needs my attention?"
       ↓
AI identifies critical issues
       ↓
"Why?"
       ↓
AI investigates the issue
       ↓
"What should I do?"
       ↓
AI recommends actions
       ↓
Operator approves
       ↓
Action executed
```

---

# 4. Core Product Experience

The primary experience is an AI-assisted logistics control tower.

The user starts with a high-level operational question:

> "What needs my attention today?"

The system identifies important shipment exceptions.

The user can then investigate an individual shipment:

> "Why is shipment S1829 delayed?"

The AI gathers relevant operational information and produces a structured explanation.

The user can then ask:

> "What should I do?"

The AI proposes one or more corrective actions.

Actions that modify operational data require explicit human approval.

---

# 5. Core Features

## 5.1 Control Tower

The control tower provides an overview of current logistics operations.

### It should show:

- Total shipments
- Shipments in transit
- Delayed shipments
- At-risk shipments
- SLA breaches
- Shipment map
- Shipment table
- Critical exceptions

### Example

```text
Shipments        1,842

In Transit      1,284

At Risk            38

Delayed            17

SLA Breaches        9
```

---

## 5.2 Shipment Details

Users can inspect an individual shipment.

### Information displayed:

- Shipment status
- Origin
- Destination
- Carrier
- Route
- Expected delivery
- Current location
- Risk score
- Event timeline
- Customer information

Example timeline:

```text
08:30  ✓ Picked up
11:20  ✓ Bangalore Hub
16:10  ✓ Pune Hub
18:40  ⚠ Delayed
```

---

## 5.3 AI Investigation

The user can ask the AI to investigate a shipment.

Example:

> "Why is shipment S1829 delayed?"

The AI may analyze:

- shipment events
- current delay
- carrier performance
- warehouse conditions
- route history

The response must be structured.

Example:

```text
Risk Score: 91%

Reasons:

Carrier delay
HIGH

Carrier is currently experiencing an
average delay of 8 hours on this route.

Warehouse congestion
MEDIUM

Pune warehouse is operating at 92% capacity.

Recommendation:

Consider rerouting the shipment.
```

---

## 5.4 AI Operations Assistant

Users can ask operational questions using natural language.

Examples:

```text
What needs my attention?

Which shipments are likely to miss
their SLA today?

Why are Mumbai shipments delayed?

Which carrier is performing worst?

Show me high-risk shipments worth
more than ₹5 lakh.
```

The AI should retrieve relevant data through controlled backend tools rather than directly querying the database.

---

## 5.5 AI Recommendations

The AI can recommend corrective actions.

Supported actions in the MVP:

- Reroute shipment
- Notify customer
- Escalate carrier

Example:

```text
Recommended Action

Reroute S1829 through Route R42.

Expected improvement:
7 hours

Reason:
Current route is experiencing
significant congestion.

[Review Action]
```

---

## 5.6 Human-in-the-Loop Actions

AI must not directly execute operational actions.

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

Every action must have a lifecycle:

```text
PROPOSED
   ↓
APPROVED / REJECTED
   ↓
EXECUTING
   ↓
COMPLETED / FAILED
```

---

## 5.7 Real-Time Updates

Shipment events should appear in the control tower without requiring a page refresh.

Examples:

```text
Shipment delayed
Shipment arrived at warehouse
Shipment departed warehouse
Shipment delivered
```

The MVP will use Server-Sent Events (SSE).

---

# 6. AI Capabilities

The MVP AI will support:

### Query

```text
"What needs my attention?"
```

### Search

```text
"Show shipments at risk."
```

### Investigation

```text
"Why is S1829 delayed?"
```

### Recommendation

```text
"What should I do about S1829?"
```

### Action

```text
"Reroute S1829."
```

The AI will use controlled tools such as:

```text
searchShipments
getShipment
getShipmentEvents
getCarrierPerformance
getWarehouseStatus
getRouteInformation
getAtRiskShipments
```

Write operations such as:

```text
rerouteShipment
notifyCustomer
escalateCarrier
```

require human approval.

---

# 7. Structured AI Output

AI responses will not be treated as arbitrary text.

The backend will validate AI responses against predefined schemas.

Conceptually:

```text
Groq
  ↓
Structured JSON
  ↓
Schema validation
  ↓
AIResponse
  ↓
Frontend renderer
```

Supported response types:

```text
TextResponse
ShipmentTableResponse
RiskAnalysisResponse
RecommendationResponse
ActionConfirmationResponse
```

This allows the frontend to render AI-generated interfaces consistently.

Example:

```json
{
  "type": "risk_analysis",
  "shipmentId": "S1829",
  "riskScore": 0.91,
  "reasons": [
    {
      "factor": "Carrier delay",
      "impact": "HIGH",
      "explanation": "Carrier is experiencing significant delays."
    }
  ],
  "recommendation": "Consider rerouting the shipment."
}
```

---

# 8. Risk Model

The MVP will not train a machine-learning model.

Risk will initially be calculated using deterministic operational signals.

Example factors:

```text
Current delay       35%
Carrier performance 25%
Warehouse load      20%
Route history       20%
```

The backend calculates the risk score.

AI is responsible for explaining the score and generating recommendations based on the available operational data.

This separation keeps operational facts deterministic while using AI for reasoning and interaction.

---

# 9. Main Screens

The MVP will contain four primary experiences.

### Control Tower

```text
/control-tower
```

Operational overview.

### Shipment Details

```text
/shipments/:id
```

Detailed shipment information and timeline.

### AI Investigation

```text
/investigation/:id
```

AI-assisted investigation of a shipment.

### Action Review

```text
/actions/:id
```

Review and approve/reject an AI-proposed action.

The AI assistant can be accessible from the control tower and shipment investigation experience.

---

# 10. Success Criteria

The MVP is considered successful if an operator can complete this workflow:

```text
1. Open Control Tower

2. Ask:
   "What needs my attention?"

3. See at-risk shipments

4. Select a shipment

5. Ask:
   "Why is this shipment at risk?"

6. AI investigates relevant operational data

7. AI produces a structured explanation

8. Ask:
   "What should I do?"

9. AI recommends an action

10. Operator reviews the action

11. Operator approves it

12. Backend executes the action

13. Action appears in the audit trail
```

The complete workflow should be demonstrable without requiring manual database manipulation.

---

# 11. MVP Constraints

The project is intentionally scoped for a 30-day implementation.

The MVP will use simulated logistics data rather than real carrier integrations.

The system will prioritize:

- AI interaction
- structured AI output
- real-time events
- investigation workflows
- human-in-the-loop actions
- frontend experience
- backend architecture

over breadth of logistics functionality.

---

# 12. Non-Goals

The following are explicitly outside the MVP:

- Real carrier integrations
- Real GPS tracking
- Customer-facing portal
- Mobile application
- Billing
- Multi-tenancy
- SSO
- Advanced RBAC
- ML model training
- Production-grade route optimization
- Kafka
- Kubernetes
- Microservices
- Complex infrastructure
- Full logistics ERP functionality

These may be considered future extensions.

---

# 13. Future Extensions

Potential future capabilities include:

- ML-based ETA prediction
- Route optimization
- Real carrier integrations
- Weather intelligence
- Semantic search over logistics SOPs
- Document intelligence
- Automated customer communication
- Predictive warehouse congestion
- Carrier performance forecasting
- Multi-agent workflows

These features are intentionally excluded from the MVP.

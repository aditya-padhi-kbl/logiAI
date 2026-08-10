🚚 LogiAI — AI Logistics Control Tower
One-line description:
An AI-powered logistics control tower that helps operations teams identify shipment risks, investigate exceptions, and take corrective actions.

Logistics operations teams have visibility into shipment status, but identifying which shipments require attention, why they're at risk, and what action should be taken often requires manually correlating data across shipments, carriers, warehouses, routes, and events.

## Workflow

                START
                  │
                  ▼
        "What needs my attention?"
                  │
                  ▼
          AI identifies risks
                  │
                  ▼
          17 shipments at risk
                  │
                  ▼
        Operator selects shipment
                  │
                  ▼
        AI investigates shipment
                  │
          ┌───────┴────────┐
          │                │
          ▼                ▼
       WHY?            IMPACT?
          │                │
          └───────┬────────┘
                  ▼
          AI recommends action
                  │
                  ▼
          Human reviews action
                  │
             ┌────┴────┐
             │         │
           Reject    Approve
                       │
                       ▼
                  Execute action
                       │
                       ▼
                    Audit

MVP

### Control Tower

- KPI cards
- shipment map
- shipment table
- risk indicators
- exception list

### Shipment Investigation

- shipment details
- event timeline
- carrier information
- route information
- AI analysis

### AI

- natural language query
- shipment investigation
- risk explanation
- recommendations
- structured responses

### Actions

- reroute shipment
- notify customer
- escalate carrier
- human approval
- audit trail

### Realtime

- shipment events
- live status changes
- AI investigation progress

# Domain

Shipment
Carrier
Warehouse
Route
Customer
ShipmentEvent
AIInsight
AIAction

# Relationship

                    Customer
                       │
                       │
                       ▼

Shipment ──────────── Carrier
│
├──────── Route
│
├──────── Events
│
└──────── AI Insights
│
▼
AI Action

# Shipment

```typescript
type ShipmentStatus =
  | "CREATED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELAYED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

interface Shipment {
  id: string;
  orderId: string;

  customerId: string;
  carrierId: string;
  routeId: string;

  origin: Location;
  destination: Location;

  status: ShipmentStatus;

  expectedDeliveryAt: Date;
  actualDeliveryAt?: Date;

  riskScore: number;
}
```

# Shipment Event

```typescript
type ShipmentEventType =
  | "CREATED"
  | "PICKED_UP"
  | "ARRIVED_AT_WAREHOUSE"
  | "DEPARTED_WAREHOUSE"
  | "IN_TRANSIT"
  | "DELAYED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

interface ShipmentEvent {
  id: string;

  shipmentId: string;

  type: ShipmentEventType;

  timestamp: Date;

  location?: Location;

  metadata?: Record<string, unknown>;
}
```

Example

```json
{
"id": "evt_1829",
"shipmentId": "S1829",
"type": "DELAYED",
"timestamp": "2026-08-09T10:32:00Z",
"location": {
"city": "Pune"
},
"metadata": {
"delayHours": 8,
"reason": "WAREHOUSE_CONGESTION"
}};
```

# Risk Model

Risk
│
├── Current delay 35%
├── Carrier performance 25%
├── Warehouse load 20%
├── Route history 20%

so conceptualy

```javascript
riskScore =
  delayRisk * 0.35 + carrierRisk * 0.25 + warehouseRisk * 0.2 + routeRisk * 0.2;
```

# Groq explains the score

Backend
│
└── calculates facts
│
▼
Groq
│
└── reasons/explains

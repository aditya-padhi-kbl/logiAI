# LogiAI AI Contract

The AI layer uses structured, machine-readable responses. The active Bun/Elysia backend validates model output with Zod before returning it to Next.js.

## AI response types

The response contract is a discriminated union keyed by `type`:

```typescript
type AIResponse =
  | TextResponse
  | ShipmentTableResponse
  | RiskAnalysisResponse
  | RecommendationResponse
  | ActionConfirmationResponse;
```

### Text response

```typescript
interface TextResponse {
  type: "text";
  content: string;
}
```

### Shipment table

```typescript
interface ShipmentTableResponse {
  type: "shipment_table";
  title: string;
  shipments: {
    id: string;
    status: ShipmentStatus;
    riskScore: number;
    reason: string;
  }[];
}
```

### Risk analysis

```typescript
interface RiskAnalysisResponse {
  type: "risk_analysis";
  shipmentId: string;
  riskScore: number;
  reasons: {
    factor: string;
    impact: "LOW" | "MEDIUM" | "HIGH";
    explanation: string;
  }[];
  recommendation?: string;
}
```

### Recommendation

```typescript
interface RecommendationResponse {
  type: "recommendation";
  title: string;
  actions: {
    type: "REROUTE_SHIPMENT" | "NOTIFY_CUSTOMER" | "ESCALATE_CARRIER";
    shipmentId: string;
    reason: string;
  }[];
}
```

### Action confirmation

```typescript
interface ActionConfirmationResponse {
  type: "action_confirmation";
  actionId: string;
  action: {
    type: string;
    description: string;
  };
  requiresApproval: true;
}
```

## Validation boundary

TypeScript types describe the compile-time shape. Zod schemas enforce the runtime contract for untrusted model output.

```text
Groq
  ↓
Raw model output
  ↓
Zod validation
  ↓
Validated AIResponse
  ↓
Elysia API
  ↓
Next.js
```

Invalid model output must not be treated as an operational fact. The backend should return a controlled error or use a safe fallback.

## Initial AI questions

### What needs my attention?

```text
shipment_table
```

### Which shipments are at risk?

```text
shipment_table
```

### Why is shipment TRK-1829 delayed?

```text
risk_analysis
```

### What should I do about TRK-1829?

```text
recommendation
```

### Reroute TRK-1829.

```text
action_confirmation
```

The final action still requires explicit human approval before execution.

## AI tools

The LLM has access to controlled application tools. Tools must call application services rather than Kysely directly.

### Read tools

```text
searchShipments
getShipment
getShipmentEvents
getCarrierPerformance
getWarehouseStatus
getRouteInformation
getAtRiskShipments
```

### Write tools

```text
rerouteShipment
notifyCustomer
escalateCarrier
```

Write tools require human approval.

## Tool boundary

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

The LLM never receives database credentials or unrestricted database access.

## Screens

The initial product has four primary screens:

- `/control-tower` — Dashboard
- `/shipments/:id` — Shipment details
- `/investigation/:id` — AI investigation
- `/actions/:id` — Action approval

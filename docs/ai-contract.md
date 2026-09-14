# LogiAI AI Contract

The AI layer uses structured, machine-readable responses. The Bun/Elysia backend uses TypeBox schemas to validate model output before returning it to the frontend.

## Response contract

The response contract is a discriminated union keyed by `type`:

```typescript
const AIResponse = t.Union([
  TextResponse,
  ShipmentTableResponse,
  RiskAnalysisResponse,
  RecommendationResponse,
  ActionConfirmationResponse,
]);
```

TypeScript types can be derived from TypeBox schemas with `Static<typeof Schema>`.

### Text response

```typescript
const TextResponse = t.Object({
  type: t.Literal("text"),
  content: t.String(),
});
```

### Shipment table

```typescript
const ShipmentTableResponse = t.Object({
  type: t.Literal("shipment_table"),
  title: t.String(),
  shipments: t.Array(
    t.Object({
      id: t.String(),
      status: t.String(),
      riskScore: t.Number(),
      reason: t.String(),
    }),
  ),
});
```

### Risk analysis

```typescript
const RiskAnalysisResponse = t.Object({
  type: t.Literal("risk_analysis"),
  shipmentId: t.String(),
  riskScore: t.Number(),
  reasons: t.Array(
    t.Object({
      factor: t.String(),
      impact: t.Union([
        t.Literal("LOW"),
        t.Literal("MEDIUM"),
        t.Literal("HIGH"),
      ]),
      explanation: t.String(),
    }),
  ),
  recommendation: t.Optional(t.String()),
});
```

### Recommendation

```typescript
const RecommendationResponse = t.Object({
  type: t.Literal("recommendation"),
  title: t.String(),
  actions: t.Array(
    t.Object({
      type: t.Union([
        t.Literal("REROUTE_SHIPMENT"),
        t.Literal("NOTIFY_CUSTOMER"),
        t.Literal("ESCALATE_CARRIER"),
      ]),
      shipmentId: t.String(),
      reason: t.String(),
    }),
  ),
});
```

### Action confirmation

```typescript
const ActionConfirmationResponse = t.Object({
  type: t.Literal("action_confirmation"),
  actionId: t.String(),
  action: t.Object({
    type: t.String(),
    description: t.String(),
  }),
  requiresApproval: t.Literal(true),
});
```

## Validation boundary

```text
Groq
  ↓
Raw model output
  ↓
TypeBox validation
  ↓
Validated AIResponse
  ↓
Elysia API
  ↓
Next.js
```

Invalid model output must not be treated as an operational fact. The backend should return a controlled error or use a safe fallback.

## Initial AI questions

| User intent | Response type |
|---|---|
| What needs my attention? | `shipment_table` |
| Which shipments are at risk? | `shipment_table` |
| Why is shipment TRK-1829 delayed? | `risk_analysis` |
| What should I do about TRK-1829? | `recommendation` |
| Reroute TRK-1829. | `action_confirmation` |

Final consequential actions require explicit human approval.

## Tool boundary

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

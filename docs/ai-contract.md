# AI Response

```typescript
type AIResponse =
  | TextResponse
  | ShipmentTableResponse
  | RiskAnalysisResponse
  | RecommendationResponse
  | ActionConfirmationResponse;
```

```typescript
interface TextResponse {
  type: "text";
  content: string;
}
```

# Shipment Table

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

# Risk Analysis

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

Recommendation

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

# Action Confirmation

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

# Defining AI Questions

First version only need to answer these

### Question 1

# What needs my attention

```code
shipment_table
```

# Which shipments are at risk?

```code
shipment_table
```

# Why is shipment S1829 delayed?

```code
risk_analysis
```

# What should I do about S1829?

```code
recommendation
```

# Reroute S1829.

```code
action_confirmation
```

# Defining AI Tools

The LLM should have access to controlled tools:

```
searchShipments
getShipment
getShipmentEvents
getCarrierPerformance
getWarehouseStatus
getRouteInformation
getAtRiskShipments
```

Later:

```
rerouteShipment
notifyCustomer
escalateCarrier
```

# Notice the distinction:

### Read tools

```
searchShipments
getShipment
getCarrierPerformance
```

### Write tools

# Write tools require human approval.

```
rerouteShipment
notifyCustomer
escalateCarrier
```

13. Define the screens

### Only four

- /control-tower
  `Dashboard`

- /shipments/:id
  `Shipment details`

- /investigation/:id
  `AI investigation`

- /actions/:id
  `Action approval`

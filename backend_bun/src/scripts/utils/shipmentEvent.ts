import { NewShipmentEvent } from "../../db/types";
import { daysAgo } from "./tool";

export const shipmentEvents: NewShipmentEvent[] = [
  // ─────────────────────────────────────────────
  // S1 — Newly created
  // CREATED
  // ─────────────────────────────────────────────
  {
    id: "01a0c003-5f63-76c7-aeb3-de9e37e01ca7",
    shipment_id: "01a0c002-5f63-76c7-aeb3-de9e37e01ca7",
    event_type: "CREATED",
    occurred_at: daysAgo(1),
    location: "Mumbai",
    description: "Shipment created",
  },

  // ─────────────────────────────────────────────
  // S2 — Picked up
  // CREATED → PICKED_UP
  // ─────────────────────────────────────────────
  {
    id: "01a0c003-66b0-7358-9689-32d6db151ac5",
    shipment_id: "01a0c002-66b0-7358-9689-32d6db151ac5",
    event_type: "CREATED",
    occurred_at: daysAgo(5),
    location: "Bengaluru",
    description: "Shipment created",
  },
  {
    id: "01a0c003-6a53-7116-90e9-59b7beb68f89",
    shipment_id: "01a0c002-66b0-7358-9689-32d6db151ac5",
    event_type: "PICKED_UP",
    occurred_at: daysAgo(4),
    location: "Bengaluru",
    description: "Shipment picked up from sender",
  },

  // ─────────────────────────────────────────────
  // S3 — Normal transit
  // CREATED → PICKED_UP → IN_TRANSIT
  // ─────────────────────────────────────────────
  {
    id: "01a0c003-7304-775b-ae3a-525673e488fc",
    shipment_id: "01a0c002-6a53-7116-90e9-59b7beb68f89",
    event_type: "CREATED",
    occurred_at: daysAgo(8),
    location: "Bengaluru",
    description: "Shipment created",
  },
  {
    id: "01a0c003-7a11-73f1-8b4c-5e9d1a2b3c4d",
    shipment_id: "01a0c002-6a53-7116-90e9-59b7beb68f89",
    event_type: "PICKED_UP",
    occurred_at: daysAgo(7),
    location: "Bengaluru",
    description: "Shipment picked up",
  },
  {
    id: "01a0c003-7a11-74e2-9c5d-6f0e2b3c4d5e",
    shipment_id: "01a0c002-6a53-7116-90e9-59b7beb68f89",
    event_type: "IN_TRANSIT",
    occurred_at: daysAgo(2),
    location: "Mumbai",
    description: "Shipment is in transit",
  },

  // ─────────────────────────────────────────────
  // S4 — Normally delivered
  // CREATED → PICKED_UP → IN_TRANSIT → DELIVERED
  // ─────────────────────────────────────────────
  {
    id: "01a0c003-7a11-75f3-ad6e-7a1f3c4d5e6f",
    shipment_id: "01a0c002-7304-775b-ae3a-525673e488fc",
    event_type: "CREATED",
    occurred_at: daysAgo(12),
    location: "Mumbai",
    description: "Shipment created",
  },
  {
    id: "01a0c003-7a11-76a4-be7f-8b2e4d5e6f70",
    shipment_id: "01a0c002-7304-775b-ae3a-525673e488fc",
    event_type: "PICKED_UP",
    occurred_at: daysAgo(11),
    location: "Mumbai",
    description: "Shipment picked up",
  },
  {
    id: "01a0c003-7a11-77b5-cf8a-9c3f5e6f7081",
    shipment_id: "01a0c002-7304-775b-ae3a-525673e488fc",
    event_type: "IN_TRANSIT",
    occurred_at: daysAgo(9),
    location: "Pune",
    description: "Shipment entered transit",
  },
  {
    id: "01a0c003-7a11-78c6-d09b-ad4f6f708192",
    shipment_id: "01a0c002-7304-775b-ae3a-525673e488fc",
    event_type: "DELIVERED",
    occurred_at: daysAgo(3),
    location: "Delhi",
    description: "Shipment delivered successfully",
  },

  // ─────────────────────────────────────────────
  // S5 — Delay recovered
  // CREATED → PICKED_UP → IN_TRANSIT
  //          → DELAYED → IN_TRANSIT
  // ─────────────────────────────────────────────
  {
    id: "01a0c003-7a11-79d7-e1ac-be5f708192a3",
    shipment_id: "01a0c002-7a11-73f1-8b4c-5e9d1a2b3c4d",
    event_type: "CREATED",
    occurred_at: daysAgo(10),
    location: "Mumbai",
    description: "Shipment created",
  },
  {
    id: "01a0c003-7a11-7ae8-f2bd-cf60708192a3",
    shipment_id: "01a0c002-7a11-73f1-8b4c-5e9d1a2b3c4d",
    event_type: "PICKED_UP",
    occurred_at: daysAgo(9),
    location: "Mumbai",
    description: "Shipment picked up",
  },
  {
    id: "01a0c003-7a11-7bf9-a3ce-d0718192a3b4",
    shipment_id: "01a0c002-7a11-73f1-8b4c-5e9d1a2b3c4d",
    event_type: "IN_TRANSIT",
    occurred_at: daysAgo(7),
    location: "Pune",
    description: "Shipment entered transit",
  },
  {
    id: "01a0c003-7a11-7c0a-b4df-e18292a3b4c5",
    shipment_id: "01a0c002-7a11-73f1-8b4c-5e9d1a2b3c4d",
    event_type: "DELAYED",
    occurred_at: daysAgo(5),
    location: "Pune",
    description: "Shipment delayed due to operational disruption",
  },
  {
    id: "01a0c003-7a11-7d1b-c5e0-f293a3b4c5d6",
    shipment_id: "01a0c002-7a11-73f1-8b4c-5e9d1a2b3c4d",
    event_type: "IN_TRANSIT",
    occurred_at: daysAgo(1),
    location: "Delhi",
    description: "Shipment resumed transit after delay",
  },

  // ─────────────────────────────────────────────
  // S6 — Active delay
  // CREATED → PICKED_UP → IN_TRANSIT → DELAYED
  // ─────────────────────────────────────────────
  {
    id: "01a0c003-7a11-7e2c-d6f1-a3b4c5d6e7f8",
    shipment_id: "01a0c002-7a11-74e2-9c5d-6f0e2b3c4d5e",
    event_type: "CREATED",
    occurred_at: daysAgo(9),
    location: "Bengaluru",
    description: "Shipment created",
  },
  {
    id: "01a0c003-7a11-7f3d-e702-b4c5d6e7f809",
    shipment_id: "01a0c002-7a11-74e2-9c5d-6f0e2b3c4d5e",
    event_type: "PICKED_UP",
    occurred_at: daysAgo(8),
    location: "Bengaluru",
    description: "Shipment picked up",
  },
  {
    id: "01a0c003-7a11-704e-f813-c5d6e7f8091a",
    shipment_id: "01a0c002-7a11-74e2-9c5d-6f0e2b3c4d5e",
    event_type: "IN_TRANSIT",
    occurred_at: daysAgo(6),
    location: "Hyderabad",
    description: "Shipment entered transit",
  },
  {
    id: "01a0c003-7a11-715f-0924-d6e7f8091a2b",
    shipment_id: "01a0c002-7a11-74e2-9c5d-6f0e2b3c4d5e",
    event_type: "DELAYED",
    occurred_at: daysAgo(1),
    location: "Hyderabad",
    description: "Shipment delayed due to unexpected operational issue",
  },

  // ─────────────────────────────────────────────
  // S7 — Multiple delays
  // CREATED → PICKED_UP → IN_TRANSIT
  //          → DELAYED → IN_TRANSIT
  //          → DELAYED → IN_TRANSIT
  // ─────────────────────────────────────────────
  {
    id: "01a0c003-7a11-7260-1a35-e7f8091a2b3c",
    shipment_id: "01a0c002-7a11-75f3-ad6e-7a1f3c4d5e6f",
    event_type: "CREATED",
    occurred_at: daysAgo(14),
    location: "Delhi",
    description: "Shipment created",
  },
  {
    id: "01a0c003-7a11-7371-2b46-f8091a2b3c4d",
    shipment_id: "01a0c002-7a11-75f3-ad6e-7a1f3c4d5e6f",
    event_type: "PICKED_UP",
    occurred_at: daysAgo(13),
    location: "Delhi",
    description: "Shipment picked up",
  },
  {
    id: "01a0c003-7a11-7482-3c57-091a2b3c4d5e",
    shipment_id: "01a0c002-7a11-75f3-ad6e-7a1f3c4d5e6f",
    event_type: "IN_TRANSIT",
    occurred_at: daysAgo(11),
    location: "Jaipur",
    description: "Shipment entered transit",
  },
  {
    id: "01a0c003-7a11-7593-4d68-1a2b3c4d5e6f",
    shipment_id: "01a0c002-7a11-75f3-ad6e-7a1f3c4d5e6f",
    event_type: "DELAYED",
    occurred_at: daysAgo(9),
    location: "Jaipur",
    description: "Shipment delayed due to hub congestion",
  },
  {
    id: "01a0c003-7a11-76a4-5e79-2b3c4d5e6f70",
    shipment_id: "01a0c002-7a11-75f3-ad6e-7a1f3c4d5e6f",
    event_type: "IN_TRANSIT",
    occurred_at: daysAgo(7),
    location: "Ahmedabad",
    description: "Shipment resumed transit",
  },
  {
    id: "01a0c003-7a11-77b5-6f8a-3c4d5e6f7081",
    shipment_id: "01a0c002-7a11-75f3-ad6e-7a1f3c4d5e6f",
    event_type: "DELAYED",
    occurred_at: daysAgo(5),
    location: "Ahmedabad",
    description: "Shipment delayed again due to a transportation issue",
  },
  {
    id: "01a0c003-7a11-78c6-708b-4d5e6f708192",
    shipment_id: "01a0c002-7a11-75f3-ad6e-7a1f3c4d5e6f",
    event_type: "IN_TRANSIT",
    occurred_at: daysAgo(2),
    location: "Mumbai",
    description: "Shipment resumed transit after second delay",
  },

  // ─────────────────────────────────────────────
  // S8 — Delayed but eventually delivered
  // CREATED → PICKED_UP → IN_TRANSIT
  //          → DELAYED → IN_TRANSIT → DELIVERED
  // ─────────────────────────────────────────────
  {
    id: "01a0c003-7a11-79d7-819c-5e6f708192a3",
    shipment_id: "01a0c002-7a11-76a4-be7f-8b2e4d5e6f70",
    event_type: "CREATED",
    occurred_at: daysAgo(16),
    location: "Mumbai",
    description: "Shipment created",
  },
  {
    id: "01a0c003-7a11-7ae8-92ad-6f708192a3b4",
    shipment_id: "01a0c002-7a11-76a4-be7f-8b2e4d5e6f70",
    event_type: "PICKED_UP",
    occurred_at: daysAgo(15),
    location: "Mumbai",
    description: "Shipment picked up",
  },
  {
    id: "01a0c003-7a11-7bf9-a3be-708192a3b4c5",
    shipment_id: "01a0c002-7a11-76a4-be7f-8b2e4d5e6f70",
    event_type: "IN_TRANSIT",
    occurred_at: daysAgo(13),
    location: "Pune",
    description: "Shipment entered transit",
  },
  {
    id: "01a0c003-7a11-7c0a-b4cf-8192a3b4c5d6",
    shipment_id: "01a0c002-7a11-76a4-be7f-8b2e4d5e6f70",
    event_type: "DELAYED",
    occurred_at: daysAgo(10),
    location: "Pune",
    description: "Shipment delayed due to weather disruption",
  },
  {
    id: "01a0c003-7a11-7d1b-c5d0-92a3b4c5d6e7",
    shipment_id: "01a0c002-7a11-76a4-be7f-8b2e4d5e6f70",
    event_type: "IN_TRANSIT",
    occurred_at: daysAgo(7),
    location: "Delhi",
    description: "Shipment resumed transit",
  },
  {
    id: "01a0c003-7a11-7e2c-d6e1-a3b4c5d6e7f8",
    shipment_id: "01a0c002-7a11-76a4-be7f-8b2e4d5e6f70",
    event_type: "DELIVERED",
    occurred_at: daysAgo(3),
    location: "Delhi",
    description: "Shipment delivered after delay",
  },
] as const;

import { NewShipment } from "../../db/types";
import { daysAgo } from "./tool";

export const shipments: NewShipment[] = [
  // S1 — newly created
  {
    id: "01a0c002-5f63-76c7-aeb3-de9e37e01ca7",
    tracking_number: "LGAI-S1-CREATED",
    status: "CREATED",
    sender_id: "01a0c001-5f63-76c7-aeb3-de9e37e01ca7",
    receiver_id: "01a0c001-66b0-7358-9689-32d6db151ac5",
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
  },

  // S2 — picked up
  {
    id: "01a0c002-66b0-7358-9689-32d6db151ac5",
    tracking_number: "LGAI-S2-PICKED",
    status: "PICKED_UP",
    sender_id: "01a0c001-66b0-7358-9689-32d6db151ac5",
    receiver_id: "01a0c001-6a53-7116-90e9-59b7beb68f89",
    created_at: daysAgo(5),
    updated_at: daysAgo(4),
  },

  // S3 — normal transit
  {
    id: "01a0c002-6a53-7116-90e9-59b7beb68f89",
    tracking_number: "LGAI-S3-TRANSIT",
    status: "IN_TRANSIT",
    sender_id: "01a0c001-6a53-7116-90e9-59b7beb68f89",
    receiver_id: "01a0c001-7304-775b-ae3a-525673e488fc",
    created_at: daysAgo(8),
    updated_at: daysAgo(2),
  },

  // S4 — normally delivered
  {
    id: "01a0c002-7304-775b-ae3a-525673e488fc",
    tracking_number: "LGAI-S4-DELIVERED",
    status: "DELIVERED",
    sender_id: "01a0c001-5f63-76c7-aeb3-de9e37e01ca7",
    receiver_id: "01a0c001-7304-775b-ae3a-525673e488fc",
    created_at: daysAgo(12),
    updated_at: daysAgo(3),
  },

  // S5 — delay recovered
  {
    id: "01a0c002-7a11-73f1-8b4c-5e9d1a2b3c4d",
    tracking_number: "LGAI-S5-DELAY-RECOVERED",
    status: "IN_TRANSIT",
    sender_id: "01a0c001-5f63-76c7-aeb3-de9e37e01ca7",
    receiver_id: "01a0c001-6a53-7116-90e9-59b7beb68f89",
    created_at: daysAgo(10),
    updated_at: daysAgo(1),
  },

  // S6 — currently delayed
  {
    id: "01a0c002-7a11-74e2-9c5d-6f0e2b3c4d5e",
    tracking_number: "LGAI-S6-ACTIVE-DELAY",
    status: "DELAYED",
    sender_id: "01a0c001-66b0-7358-9689-32d6db151ac5",
    receiver_id: "01a0c001-7304-775b-ae3a-525673e488fc",
    created_at: daysAgo(9),
    updated_at: daysAgo(1),
  },

  // S7 — multiple delays, currently recovered
  {
    id: "01a0c002-7a11-75f3-ad6e-7a1f3c4d5e6f",
    tracking_number: "LGAI-S7-MULTI-DELAY",
    status: "IN_TRANSIT",
    sender_id: "01a0c001-6a53-7116-90e9-59b7beb68f89",
    receiver_id: "01a0c001-5f63-76c7-aeb3-de9e37e01ca7",
    created_at: daysAgo(14),
    updated_at: daysAgo(2),
  },

  // S8 — delayed but eventually delivered
  {
    id: "01a0c002-7a11-76a4-be7f-8b2e4d5e6f70",
    tracking_number: "LGAI-S8-DELAYED-DELIVERED",
    status: "DELIVERED",
    sender_id: "01a0c001-7304-775b-ae3a-525673e488fc",
    receiver_id: "01a0c001-66b0-7358-9689-32d6db151ac5",
    created_at: daysAgo(16),
    updated_at: daysAgo(3),
  },
] as const;

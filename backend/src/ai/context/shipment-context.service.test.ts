import { beforeEach, describe, expect, mock, test } from "bun:test";
import { ShipmentService } from "../../services/shipment.service";
import { ShipmentTimelineService } from "../../services/shipmentTimeline.service";
import { ShipmentContextService } from "./shipment-context.service";

describe("ShipmentContextService", () => {
  let service: ShipmentContextService;
  let getShipmentMock: ReturnType<typeof mock>;
  let getTimelineMock: ReturnType<typeof mock>;

  beforeEach(() => {
    getShipmentMock = mock(async (_shipmentId: string) => undefined);
    getTimelineMock = mock(async (_shipmentId: string) => ({
      events: [],
      stagedDurations: [],
      delayedPeriods: [],
    }));

    const shipmentService = {
      getShipment: getShipmentMock,
    } as unknown as ShipmentService;
    const shipmentTimelineService = {
      getTimeline: getTimelineMock,
    } as unknown as ShipmentTimelineService;

    service = new ShipmentContextService(
      shipmentService,
      shipmentTimelineService,
    );
  });

  test("builds an LLM-ready context from shipment and timeline data", async () => {
    getShipmentMock.mockResolvedValue({
      id: "shipment-1",
      tracking_number: "TRK-001",
      status: "DELAYED",
      sender: { id: "party-1", name: "Acme" },
      receiver: { id: "party-2", name: "Globex" },
      created_at: "2026-09-01T10:00:00.000Z",
    });

    getTimelineMock.mockResolvedValue({
      events: [
        {
          id: "event-1",
          shipment_id: "shipment-1",
          event_type: "CREATED",
          occurred_at: new Date("2026-09-01T10:00:00.000Z"),
          location: "Mumbai",
          description: "Shipment Created",
        },
        {
          id: "event-2",
          shipment_id: "shipment-1",
          event_type: "DELAYED",
          occurred_at: new Date("2026-09-02T10:00:00.000Z"),
          location: "Pune",
          description: "Weather delay",
        },
      ],
      stagedDurations: [
        {
          from: "CREATED",
          to: "DELAYED",
          duration_seconds: 86400,
        },
      ],
      delayedPeriods: [
        {
          started_at: "2026-09-02T10:00:00.000Z",
          ended_at: null,
          duration: null,
        },
      ],
    });

    const result = await service.getContext("shipment-1");

    expect(result).toEqual({
      shipment: {
        id: "shipment-1",
        tracking_number: "TRK-001",
        status: "DELAYED",
        sender: { id: "party-1", name: "Acme" },
        receiver: { id: "party-2", name: "Globex" },
        created_at: "2026-09-01T10:00:00.000Z",
      },
      events: [
        {
          id: "event-1",
          shipment_id: "shipment-1",
          event_type: "CREATED",
          occurred_at: "2026-09-01T10:00:00.000Z",
          location: "Mumbai",
          description: "Shipment Created",
        },
        {
          id: "event-2",
          shipment_id: "shipment-1",
          event_type: "DELAYED",
          occurred_at: "2026-09-02T10:00:00.000Z",
          location: "Pune",
          description: "Weather delay",
        },
      ],
      timeline: {
        stage_durations: [
          {
            from: "CREATED",
            to: "DELAYED",
            duration_seconds: 86400,
          },
        ],
        delayed_periods: [
          {
            started_at: "2026-09-02T10:00:00.000Z",
            ended_at: null,
            duration: null,
          },
        ],
      },
    });
  });

  test("throws when the shipment does not exist", async () => {
    await expect(service.getContext("missing-shipment")).rejects.toThrow(
      "Shipment not found",
    );
  });

  test("normalizes event dates to ISO strings", async () => {
    getShipmentMock.mockResolvedValue({
      id: "shipment-1",
      tracking_number: "TRK-001",
      status: "CREATED",
      sender: { id: "party-1", name: "Acme" },
      receiver: { id: "party-2", name: "Globex" },
      created_at: null,
    });
    getTimelineMock.mockResolvedValue({
      events: [
        {
          id: "event-1",
          shipment_id: "shipment-1",
          event_type: "CREATED",
          occurred_at: new Date("2026-09-01T10:00:00.000Z"),
          location: "Mumbai",
          description: null,
        },
      ],
      stagedDurations: [],
      delayedPeriods: [],
    });

    const result = await service.getContext("shipment-1");

    expect(result.events[0]?.occurred_at).toBe(
      "2026-09-01T10:00:00.000Z",
    );
  });
});

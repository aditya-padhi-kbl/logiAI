import { beforeEach, describe, expect, mock, test } from "bun:test";
import { ShipmentEventRepository } from "../repositories/shipmentEvent.repository";
import { ShipmentTimelineService } from "./shipmentTimeline.service";
import { ShipmentEventResponse } from "../schemas/shipment-event";

describe("ShipmentTimelineService", () => {
  let shipmentEventRepository: ShipmentEventRepository;
  let service: ShipmentTimelineService;
  let findByShipmentIdMock: ReturnType<typeof mock>;

  beforeEach(() => {
    findByShipmentIdMock = mock(async (_shipmentId: string) => []);
    shipmentEventRepository = {
      findByShipmentId: findByShipmentIdMock,
    } as unknown as ShipmentEventRepository;

    service = new ShipmentTimelineService(shipmentEventRepository);
  });

  test("returns an empty timeline when there are no events", async () => {
    findByShipmentIdMock.mockResolvedValue([]);

    const result = await service.getTimeline("shipment-123");

    expect(result).toStrictEqual({
      events: [],
      stagedDurations: [],
      delayedPeriods: [],
    });
  });

  test("returns the mocked events for the shipment", async () => {
    const events: ShipmentEventResponse[] = [
      {
        id: "1",
        shipment_id: "shipment-123",
        event_type: "IN_TRANSIT",
        occurred_at: new Date("2024-01-01T00:00:00.000Z"),
        location: "NYC",
        description: null,
      },
    ];

    findByShipmentIdMock.mockResolvedValue(events);

    const result = await service.getTimeline("shipment-123");

    expect(result.events).toEqual(events);
    expect(result.stagedDurations).toEqual([]);
    expect(result.delayedPeriods).toEqual([]);
  });

  test("calculates duration between consecutive stages", async () => {
    findByShipmentIdMock.mockResolvedValue([
      {
        id: "event-1",
        shipment_id: "shipment-1",
        event_type: "CREATED",
        occurred_at: new Date("2026-09-01T10:00:00Z"),
        location: "Mumbai",
        description: null,
      },
      {
        id: "event-2",
        shipment_id: "shipment-1",
        event_type: "PICKED_UP",
        occurred_at: new Date("2026-09-01T12:00:00Z"),
        location: "Mumbai",
        description: null,
      },
      {
        id: "event-3",
        shipment_id: "shipment-1",
        event_type: "IN_TRANSIT",
        occurred_at: new Date("2026-09-01T15:30:00Z"),
        location: "Pune",
        description: null,
      },
    ]);

    const result = await service.getTimeline("shipment-1");

    expect(result.stagedDurations).toEqual([
      {
        from: "CREATED",
        to: "PICKED_UP",
        duration_seconds: 7200,
      },
      {
        from: "PICKED_UP",
        to: "IN_TRANSIT",
        duration_seconds: 12600,
      },
    ]);
  });

  test("calculates completed delay use case", async () => {
    findByShipmentIdMock.mockResolvedValue([
      {
        id: "1",
        shipment_id: "shipment-1",
        event_type: "IN_TRANSIT",
        occurred_at: new Date("2026-09-01T10:00:00Z"),
        location: "Mumbai",
        description: null,
      },
      {
        id: "2",
        shipment_id: "shipment-1",
        event_type: "DELAYED",
        occurred_at: new Date("2026-09-01T12:00:00Z"),
        location: "Pune",
        description: "Weather delay",
      },
      {
        id: "3",
        shipment_id: "shipment-1",
        event_type: "IN_TRANSIT",
        occurred_at: new Date("2026-09-01T15:00:00Z"),
        location: "Pune",
        description: null,
      },
    ]);
    const result = await service.getTimeline("shipment-1");
    expect(result.delayedPeriods).toEqual([
      {
        started_at: "2026-09-01T12:00:00.000Z",
        ended_at: "2026-09-01T15:00:00.000Z",
        duration: 10800,
      },
    ]);
  });

  test("returns an active delayed period when DELAYED is the last event", async () => {
    findByShipmentIdMock.mockResolvedValue([
      {
        id: "1",
        shipment_id: "shipment-1",
        event_type: "DELAYED",
        occurred_at: new Date("2026-09-01T12:00:00Z"),
        location: "Pune",
        description: "Weather delay",
      },
    ]);

    const result = await service.getTimeline("shipment-1");

    expect(result.delayedPeriods).toEqual([
      {
        started_at: "2026-09-01T12:00:00.000Z",
        ended_at: null,
        duration: null,
      },
    ]);
  });
});

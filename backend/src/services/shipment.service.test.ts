import { beforeEach, describe, expect, mock, test } from "bun:test";
import { ShipmentEvent } from "../schemas/shipment-event";

const getByIdMock = mock();
const createShipmentMock = mock();
const getStatusForUpdateMock = mock();
const updateStatusMock = mock();
const createShipmentEventMock = mock();
const transactionExecuteMock = mock();
const transactionMock = mock(() => ({ execute: transactionExecuteMock }));

class MockShipmentRepository {
  create = createShipmentMock;
  getById = getByIdMock;
  getStatusForUpdate = getStatusForUpdateMock;
  updateStatus = updateStatusMock;

  constructor(_db: unknown) {}
}

class MockShipmentEventRepository {
  create = createShipmentEventMock;

  constructor(_db: unknown) {}
}

class MockPartyRepository {
  getById = getByIdMock;
}

mock.module("../repositories/shipment.repository", () => ({
  ShipmentRepository: MockShipmentRepository,
}));

mock.module("../repositories/shipmentEvent.repository", () => ({
  ShipmentEventRepository: MockShipmentEventRepository,
}));

mock.module("../repositories/party.repository", () => ({
  PartyRepository: MockPartyRepository,
}));

const { ShipmentService } = await import("./shipment.service");

describe("ShipmentService", () => {
  const sender = { id: "sender-1", name: "Sender" };
  const receiver = { id: "receiver-1", name: "Receiver" };

  const shipmentInput = {
    tracking_number: "TRK-001",
    sender_id: sender.id,
    receiver_id: receiver.id,
  };

  let service: InstanceType<typeof ShipmentService>;
  let db: { transaction: typeof transactionMock };

  beforeEach(() => {
    getByIdMock.mockReset();
    createShipmentMock.mockReset();
    getStatusForUpdateMock.mockReset();
    updateStatusMock.mockReset();
    createShipmentEventMock.mockReset();
    transactionExecuteMock.mockReset();
    transactionMock.mockClear();

    getByIdMock.mockImplementation(async (id: string) => {
      if (id === sender.id) return sender;
      if (id === receiver.id) return receiver;
      return undefined;
    });

    transactionExecuteMock.mockImplementation(async (callback) => {
      return callback({});
    });

    db = { transaction: transactionMock };
    service = new ShipmentService(
      new MockShipmentRepository({}),
      new MockPartyRepository(),
      new MockShipmentEventRepository({}),
      db,
    );
  });

  describe("createShipment", () => {
    test("throws when sender does not exist", async () => {
      getByIdMock.mockImplementation(async (id: string) =>
        id === receiver.id ? receiver : undefined,
      );

      await expect(service.createShipment(shipmentInput)).rejects.toThrow(
        "Sender or receiver not found",
      );

      expect(transactionMock).not.toHaveBeenCalled();
    });

    test("throws when receiver does not exist", async () => {
      getByIdMock.mockImplementation(async (id: string) =>
        id === sender.id ? sender : undefined,
      );

      await expect(service.createShipment(shipmentInput)).rejects.toThrow(
        "Sender or receiver not found",
      );

      expect(transactionMock).not.toHaveBeenCalled();
    });

    test("creates a shipment with CREATED status", async () => {
      const shipment = {
        id: "shipment-1",
        tracking_number: shipmentInput.tracking_number,
        sender_id: sender.id,
        receiver_id: receiver.id,
        status: ShipmentEvent.CREATED,
        created_at: new Date("2026-09-13T10:00:00.000Z"),
      };

      createShipmentMock.mockResolvedValue(shipment);
      createShipmentEventMock.mockResolvedValue({});

      const result = await service.createShipment(shipmentInput);

      expect(result).toEqual(shipment);
      expect(createShipmentMock).toHaveBeenCalledTimes(1);
      expect(createShipmentMock.mock.calls[0][0]).toMatchObject({
        tracking_number: shipmentInput.tracking_number,
        sender_id: sender.id,
        receiver_id: receiver.id,
        status: ShipmentEvent.CREATED,
      });
    });

    test("creates the initial CREATED shipment event", async () => {
      const shipment = {
        id: "shipment-1",
        tracking_number: shipmentInput.tracking_number,
        sender_id: sender.id,
        receiver_id: receiver.id,
        status: ShipmentEvent.CREATED,
        created_at: new Date("2026-09-13T10:00:00.000Z"),
      };

      createShipmentMock.mockResolvedValue(shipment);
      createShipmentEventMock.mockResolvedValue({});

      await service.createShipment(shipmentInput);

      expect(createShipmentEventMock).toHaveBeenCalledTimes(1);
      expect(createShipmentEventMock.mock.calls[0][0]).toMatchObject({
        shipment_id: shipment.id,
        event_type: ShipmentEvent.CREATED,
        location: "UNKNOWN",
        description: "Shipment Created",
      });
    });

    test("runs shipment and initial event creation inside the transaction", async () => {
      const shipment = {
        id: "shipment-1",
        tracking_number: shipmentInput.tracking_number,
        sender_id: sender.id,
        receiver_id: receiver.id,
        status: ShipmentEvent.CREATED,
        created_at: new Date("2026-09-13T10:00:00.000Z"),
      };

      createShipmentMock.mockResolvedValue(shipment);
      createShipmentEventMock.mockResolvedValue({});

      await service.createShipment(shipmentInput);

      expect(transactionMock).toHaveBeenCalledTimes(1);
      expect(transactionExecuteMock).toHaveBeenCalledTimes(1);
    });

    test("propagates an error when creating the initial event fails", async () => {
      const shipment = {
        id: "shipment-1",
        tracking_number: shipmentInput.tracking_number,
        sender_id: sender.id,
        receiver_id: receiver.id,
        status: ShipmentEvent.CREATED,
        created_at: new Date("2026-09-13T10:00:00.000Z"),
      };
      const error = new Error("event creation failed");

      createShipmentMock.mockResolvedValue(shipment);
      createShipmentEventMock.mockRejectedValue(error);

      await expect(service.createShipment(shipmentInput)).rejects.toThrow(
        "event creation failed",
      );
      expect(transactionExecuteMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateShipmentStatus", () => {
    test("throws when shipment does not exist", async () => {
      getStatusForUpdateMock.mockResolvedValue(undefined);

      await expect(
        service.updateShipmentStatus("shipment-1", ShipmentEvent.PICKED_UP),
      ).rejects.toThrow("Shipment not found");
    });

    test("throws when the status transition is invalid", async () => {
      getStatusForUpdateMock.mockResolvedValue({
        status: ShipmentEvent.CREATED,
      });

      await expect(
        service.updateShipmentStatus("shipment-1", ShipmentEvent.DELIVERED),
      ).rejects.toThrow(
        "Invalid transition from CREATED to DELIVERED",
      );

      expect(updateStatusMock).not.toHaveBeenCalled();
      expect(createShipmentEventMock).not.toHaveBeenCalled();
    });

    test("updates the shipment status for a valid transition", async () => {
      const updatedShipment = {
        id: "shipment-1",
        status: ShipmentEvent.PICKED_UP,
      };

      getStatusForUpdateMock.mockResolvedValue({
        status: ShipmentEvent.CREATED,
      });
      updateStatusMock.mockResolvedValue(updatedShipment);
      createShipmentEventMock.mockResolvedValue({});

      const result = await service.updateShipmentStatus(
        "shipment-1",
        ShipmentEvent.PICKED_UP,
      );

      expect(result).toEqual(updatedShipment);
      expect(updateStatusMock).toHaveBeenCalledWith(
        "shipment-1",
        ShipmentEvent.PICKED_UP,
      );
    });

    test("creates an event for a valid status transition", async () => {
      getStatusForUpdateMock.mockResolvedValue({
        status: ShipmentEvent.CREATED,
      });
      updateStatusMock.mockResolvedValue({
        id: "shipment-1",
        status: ShipmentEvent.PICKED_UP,
      });
      createShipmentEventMock.mockResolvedValue({});

      await service.updateShipmentStatus(
        "shipment-1",
        ShipmentEvent.PICKED_UP,
      );

      expect(createShipmentEventMock).toHaveBeenCalledTimes(1);
      expect(createShipmentEventMock.mock.calls[0][0]).toMatchObject({
        shipment_id: "shipment-1",
        event_type: ShipmentEvent.PICKED_UP,
        location: "UNKNOWN",
        description: "Shipment status changed to PICKED_UP",
      });
    });

    test("runs status update and event creation inside the transaction", async () => {
      getStatusForUpdateMock.mockResolvedValue({
        status: ShipmentEvent.CREATED,
      });
      updateStatusMock.mockResolvedValue({
        id: "shipment-1",
        status: ShipmentEvent.PICKED_UP,
      });
      createShipmentEventMock.mockResolvedValue({});

      await service.updateShipmentStatus(
        "shipment-1",
        ShipmentEvent.PICKED_UP,
      );

      expect(transactionMock).toHaveBeenCalledTimes(1);
      expect(transactionExecuteMock).toHaveBeenCalledTimes(1);
    });

    test("propagates an error when event creation fails", async () => {
      getStatusForUpdateMock.mockResolvedValue({
        status: ShipmentEvent.CREATED,
      });
      updateStatusMock.mockResolvedValue({
        id: "shipment-1",
        status: ShipmentEvent.PICKED_UP,
      });
      createShipmentEventMock.mockRejectedValue(
        new Error("event creation failed"),
      );

      await expect(
        service.updateShipmentStatus("shipment-1", ShipmentEvent.PICKED_UP),
      ).rejects.toThrow("event creation failed");
    });
  });
});

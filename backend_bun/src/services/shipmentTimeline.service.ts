import { type Static, t } from "elysia";
import { ShipmentEventRepository } from "../repositories/shipmentEvent.repository";
import {
  ShipmentEvent,
  ShipmentEventResponse,
  ShipmentEventResponseSchema,
  ShipmentEventValues,
} from "../schemas/shipment-event";
import { ShipmentEvent as ShipmentEventType } from "../db/types";

export const StageDurationSchema = t.Object({
  duration_seconds: t.Integer(),
  from: t.Unsafe<ShipmentEventValues>(t.String()),
  to: t.Unsafe<ShipmentEventValues>(t.String()),
});

export const DelayedPeriodSchema = t.Object({
  started_at: t.String({ format: "date-time" }),
  ended_at: t.Nullable(t.String({ format: "date-time" })),
  duration: t.Nullable(t.Integer()),
});

export const ShipmentTimelineSchema = t.Object({
  stagedDurations: t.Array(StageDurationSchema),
  delayedPeriods: t.Array(DelayedPeriodSchema),
  events: t.Array(ShipmentEventResponseSchema),
});

export type DelayedPeriod = Static<typeof DelayedPeriodSchema>;
export type StageDuration = Static<typeof StageDurationSchema>;
export type ShipmentTimelineStruct = Static<typeof ShipmentTimelineSchema>;

export class ShipmentTimelineService {
  constructor(
    private readonly shipmentEventRepository: ShipmentEventRepository,
  ) {}

  /** Calculate the duration between 2 stages */
  private calculateStageDurations(
    events: ShipmentEventResponse[],
  ): StageDuration[] {
    return events.slice(1).map((current, index) => {
      const previous = events[index];
      return {
        from: previous.event_type,
        to: current.event_type,
        duration_seconds:
          (new Date(current.occurred_at).getTime() -
            new Date(previous.occurred_at).getTime()) /
          1000,
      };
    });
  }

  /** IN_TRANSIT ---> DELAY ---> IN_TRANSIT (COMPLETED DELAY)*/
  /** IN_TRANSIT ---> DELAY ---> no more events (ACTIVE DELAY)*/

  private calculateDelayedPeriods(
    events: ShipmentEventResponse[],
  ): DelayedPeriod[] {
    const periods: DelayedPeriod[] = [];

    for (let i = 0; i < events.length; ++i) {
      const event = events[i];

      if (event.event_type !== ShipmentEvent.DELAYED) {
        continue;
      }

      const nextEvent = events[i + 1];
      const startedAt = new Date(event.occurred_at);
      if (!nextEvent) {
        periods.push({
          started_at: startedAt.toISOString(),
          ended_at: null,
          duration: null,
        });
        continue;
      }

      const endedAt = new Date(nextEvent.occurred_at);
      periods.push({
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        duration:
          (endedAt.getTime() - startedAt.getTime()) / 1000,
      });
    }
    return periods;
  }

  async getTimeline(shipmentId: string): Promise<ShipmentTimelineStruct> {
    const events =
      await this.shipmentEventRepository.findByShipmentId(shipmentId);
    const normalizedEvents: ShipmentEventResponse[] = events.map((event) => ({
      ...event,
      occurred_at: new Date(event.occurred_at).toISOString(),
    }));

    const stagedDurations = this.calculateStageDurations(normalizedEvents);
    const delayedPeriods = this.calculateDelayedPeriods(normalizedEvents);

    return {
      events: normalizedEvents,
      stagedDurations,
      delayedPeriods,
    };
  }
}

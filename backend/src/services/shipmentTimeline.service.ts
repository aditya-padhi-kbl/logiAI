import { ShipmentEventRepository } from "../repositories/shipmentEvent.repository";
import {
  ShipmentEvent,
  ShipmentEventResponse,
  ShipmentEventValues,
} from "../schemas/shipment-event";

export type StageDuration = {
  duration_seconds: number;
  from: ShipmentEventValues;
  to: ShipmentEventValues;
};

export type DelayedPeriod = {
  started_at: string;
  ended_at: string | null;
  duration: number | null;
};
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
          (current.occurred_at.getTime() - previous.occurred_at.getTime()) /
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
      if (!nextEvent) {
        periods.push({
          started_at: event.occurred_at.toISOString(),
          ended_at: null,
          duration: null,
        });
        continue;
      }

      periods.push({
        started_at: event.occurred_at.toISOString(),
        ended_at: nextEvent.occurred_at.toISOString(),
        duration:
          (nextEvent.occurred_at.getTime() - event.occurred_at.getTime()) /
          1000,
      });
    }
    return periods;
  }

  async getTimeline(shipmentId: string) {
    const events =
      await this.shipmentEventRepository.findByShipmentId(shipmentId);
    const stagedDurations = this.calculateStageDurations(events);
    const delayedPeriods = this.calculateDelayedPeriods(events);
    return {
      events,
      stagedDurations,
      delayedPeriods,
    };
  }
}

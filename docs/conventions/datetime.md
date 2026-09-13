# Date and Time Convention

## Rule

All date and time values communicated between system boundaries MUST use **ISO 8601 datetime strings with an explicit timezone offset**.

Examples:

- `2026-09-07T08:00:00Z`
- `2026-09-07T13:30:00+05:30`

Timezone-less datetime strings such as:

- `2026-09-07T08:00:00`

MUST NOT be used for API communication.

## Backend

The backend should represent timestamps as timezone-aware database timestamps and convert them to ISO 8601 strings at API boundaries.

The backend MUST NOT convert timestamps to the user's local timezone.

For example, if an event occurred at:

`2026-09-07T08:00:00Z`

the API should return that value as-is.

## Frontend

The frontend receives the canonical ISO 8601 timestamp and is responsible for presentation.

The browser/client may convert the timestamp to the user's local timezone when displaying it.

For example:

```text
API:
2026-09-07T08:00:00Z

User in India:
13:30

User in New York:
04:00
```

The underlying instant remains the same.

## Internal communication

The same convention applies to communication between:

- Frontend and backend
- Backend services
- Background jobs
- AI/LLM tools
- External integrations
- Events/messages
- Logs where timestamps are part of structured payloads

Datetime values should remain in their canonical ISO 8601 representation rather than being converted for a particular consumer.

## AI and Tools

AI services and tools should receive timestamps in ISO 8601 format with timezone information.

For example:

```json
{
  "event_type": "DELAYED",
  "occurred_at": "2026-09-07T08:00:00Z"
}
```

The AI/tool should reason about the timestamp as an absolute instant rather than assuming a local timezone.

## Duration Calculations

Duration calculations should be performed using the actual timestamp values, not formatted display values.

For example:

```text
2026-09-07T08:00:00Z
→
2026-09-07T20:00:00Z
```

represents a duration of 12 hours.

Formatting the timestamps for display is a presentation concern and must not affect domain calculations.

## Display

Timezone conversion belongs to the presentation layer.

The system should preserve the original timestamp throughout the backend and API layers and only convert it when displaying it to the user.

## Summary

**Canonical representation:**

```text
ISO 8601 + explicit timezone
```

**Backend:** preserve the instant.

**API:** return the canonical ISO timestamp.

**Tools/AI:** receive the canonical ISO timestamp.

**Frontend/browser:** convert to the user's local timezone for display.

**Domain logic:** calculate durations from the underlying timestamps, never from formatted strings.

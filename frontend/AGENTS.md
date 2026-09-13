# Frontend Engineering Guidelines

These rules apply to the frontend application under `frontend/`.

## Responsibilities

- Treat the backend as the source of truth for operational data and deterministic calculations.
- Do not reproduce backend business rules in the UI unless there is a clear presentation-only reason.
- Keep API communication separate from presentation components.

## Date and Time

- Consume API and event timestamps as ISO-8601 values with timezone information.
- Do not assume an API timestamp is already in the user's local timezone.
- Convert timestamps to the user's local timezone only for presentation.
- Never mutate the canonical timestamp received from the backend before sending it to another system.
- Durations received from APIs/tools are numeric seconds; format them for display in the UI.

## Realtime

- Use the backend's SSE/event contracts as the source of truth for realtime operational state.
- Keep shared realtime streams centralized when multiple components need the same event data.

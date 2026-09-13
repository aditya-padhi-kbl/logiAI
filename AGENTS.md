# Repository Guidelines

These instructions apply to the entire LogiAI repository. More specific `AGENTS.md` files override these rules for their directory.

## Architecture

- Keep the application as a modular monolith unless a concrete requirement justifies a different boundary.
- Keep business/domain logic in application or domain services, not in HTTP routes or persistence repositories.
- Keep database access inside the backend.
- AI components must access operational data through controlled application services/tools rather than directly accessing PostgreSQL.

## Date and Time

- All date and datetime values communicated across system boundaries MUST use ISO-8601 with timezone information.
- Do not use timezone-less datetime strings in API, event, AI, or tool payloads.
- The canonical timestamp represents an absolute instant; presentation-layer timezone conversion belongs to the client.
- Duration values should be represented as numeric seconds when part of an API or tool contract.

## Documentation

- Keep repository-wide guidance here.
- Keep backend-specific rules in `backend/AGENTS.md`.
- Keep frontend-specific rules in `frontend/AGENTS.md`.
- Keep product and technical documentation under `docs/`.
- Avoid duplicating the same rule across multiple Markdown files.

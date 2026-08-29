# LogiAI Backend

Bun + Elysia + Kysely + PostgreSQL + Zod.

The backend is a modular monolith: HTTP routes call application services, services call repositories, and repositories are the only layer that accesses PostgreSQL through Kysely.

## Commands

```bash
bun install
bun run migrate
bun run dev
```

## Architecture

```text
Elysia routes
      ↓
Application services
      ↓
Repositories
      ↓
Kysely
      ↓
PostgreSQL
```

AI tools must call application services rather than accessing Kysely directly.

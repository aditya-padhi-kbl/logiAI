# Non-Goals

The MVP will not include:

- Real carrier integrations
- Real GPS tracking
- Mobile application
- Customer-facing portal
- Billing
- Multi-tenancy
- Authentication/SSO
- ML model training
- Production-grade route optimization algorithms
- Kafka
- Kubernetes
- Microservices
- Advanced RBAC
- Autonomous execution of consequential AI actions

The MVP uses a Bun + Elysia modular monolith with Kysely/PostgreSQL. These non-goals are intentional so the project can focus on the operational workflow, deterministic risk engine, AI tool orchestration, human approval, realtime updates, and auditability.

The previous Python/FastAPI implementation is retained under `backend_python/` for reference and is not part of the active runtime path.

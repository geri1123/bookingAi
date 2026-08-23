# Architecture

## Overview

BookingAI is a **microservices** system built with **NestJS** (TypeScript) and a
**pnpm workspace / monorepo** layout. Each service is independently deployable
(own `Dockerfile`, own `docker-compose.prod.yml`) but they are developed together
in one repository.

```
                                   ┌─────────────┐
                     HTTPS         │   Frontend   │
                ┌─────────────────►│  (external)  │
                │                  └─────────────┘
                │
        ┌───────▼────────┐
        │   api-gateway    │  (port 8000, public entry point)
        │  auth, CORS,     │
        │  rate-limiting,  │
        │  reverse proxy   │
        └───┬───┬───┬───┬──┘
   /core     │   │   │   │   /billing
      ┌──────┘   │   │   └──────┐
      │      /ai │   │ /comm    │
      ▼          ▼   ▼          ▼
┌───────────┐ ┌────────┐ ┌────────────────┐ ┌────────────────┐
│   core-   │ │  ai-   │ │ communication- │ │   billing-      │
│  service  │ │service │ │    service     │ │    service      │
└─────┬─────┘ └───┬────┘ └───────┬────────┘ └────────┬────────┘
      │           │              │                    │
      └────────┬──┴──────┬───────┴──────────┬─────────┘
               │  Kafka (async events)       │
               └────────────┬─────────────────┘
                             ▼
                   ┌───────────────────┐
                   │ notification-      │
                   │ service (emails)   │
                   └───────────────────┘
```

`notification-service` has no public HTTP surface reachable from the gateway
(no route registered in `api-gateway`); it is purely a **Kafka consumer** that
reacts to domain events and sends transactional emails.

## Services

| Service | Framework | Database | Talks to Kafka | Public via gateway |
|---|---|---|---|---|
| `api-gateway` | NestJS + `http-proxy-middleware` | — | no | itself is the entry point |
| `core-service` | NestJS + Prisma | Postgres (`core_service`) | producer + consumer | `/core/*` |
| `ai-service` | NestJS + Prisma | Postgres (`ai_service`) | producer + consumer | `/ai/*` |
| `billing-service` | NestJS + Prisma | Postgres (`billing_service`) | producer + consumer | `/billing/*` |
| `communication-service` | NestJS + Prisma | Postgres (`communication_service`) | producer | `/comm/*` |
| `notification-service` | NestJS | — (no DB, uses a queue) | consumer only | not exposed |

## api-gateway routing table

Defined in `api-gateway/src/config/gateway.config.ts`:

| Public prefix | Forwards to (env var) | Default target |
|---|---|---|
| `/core` | `CORE_SERVICE_URL` | `http://localhost:8080` |
| `/ai` | `AI_SERVICE_URL` | `http://localhost:8082` |
| `/comm` | `COMMUNICATION_SERVICE_URL` | `http://localhost:8083` |
| `/billing` | `BILLING_SERVICE_URL` | `http://localhost:8084` |

> Note: the default ports written inside `gateway.config.ts` don't match the
> ports each service actually listens on in `docker-compose.yml` (see the table
> in [docs/README.md](./README.md)) — in `docker-compose.yml`/production the
> real target is whatever `*_SERVICE_URL` resolves to (the container's internal
> port), so this is not a bug in practice, just something to be aware of if you
> hardcode a fallback URL locally.

The gateway also applies:
- **CORS** — allowed origins from `CORS_ORIGINS` (comma separated), default `CLIENT_BASE_URL`.
- **Rate limiting** — via Redis (`REDIS_URL`), configurable window/max via
  `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX_REQUESTS` (default: 120 requests / 60s).
- **`x-forwarded-for`** header propagation to upstream services.

## Shared library: `libs/auth`

A workspace package (`libs/auth`) shared by the services that need authentication:

- `JwtStrategy` / `JwtAuthGuard` — validates the JWT issued by `core-service`.
- `RolesGuard` + `@Roles()` decorator — role-based access control.
- `BusinessContextGuard` — ensures a request is scoped to the correct business
  (multi-tenant safety).
- `@Public()` — marks a route as not requiring authentication.
- `@CurrentUser()` — injects the authenticated user into a controller method.

## Domain-Driven / layered structure inside each service

`core-service`, `billing-service`, `communication-service` and `ai-service` follow
the same internal layering per module (`src/modules/<name>/`):

```
<module>/
├── domain/           ← entities, value objects, domain events, repository interfaces
├── application/       ← use-cases / handlers / DTOs (application services)
├── infrastructure/    ← Prisma repositories, Kafka producers/consumers, external clients
└── presentation/       ← NestJS controllers (HTTP layer)
```

This is a lightweight **hexagonal / clean architecture** style: `domain` has no
framework dependencies, `application` orchestrates domain logic, `infrastructure`
implements the technical details, `presentation` exposes it over HTTP.

## Infrastructure dependencies

| Component | Local (docker-compose.yml) | Production (DEPLOYMENT.md) |
|---|---|---|
| PostgreSQL | container `postgres`, port 5432 | Neon (managed), 4 databases |
| Redis | container `redis`, port 6379 | Redis Cloud |
| Kafka | container `kafka`, port 9092 (+ `kafka-ui` on 9090) | self-hosted, dedicated server, firewalled to the 5 services that need it |
| Object storage / images | Cloudinary (`core-service/src/infrastructure/cloudinary`) | same |
| Outgoing email | Resend (`notification-service`) | same |
| Payments | Paddle webhooks (`billing-service`) | same |
| Messaging channels | Meta Graph API — WhatsApp Cloud API, Messenger, Instagram | same |

See [08-events-and-kafka.md](./08-events-and-kafka.md) for the async contract
between services, and [10-deployment.md](./10-deployment.md) for how each piece
is deployed.

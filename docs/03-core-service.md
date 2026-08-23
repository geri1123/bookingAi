# core-service

## Purpose

The source of truth for the platform: businesses, staff/auth, catalog
(services/resources/employees/schedules), customers and reservations. Most
other services reference data owned here (via internal endpoints or Kafka
events) rather than duplicating it.

- Folder: `core-service/`
- Framework: NestJS + Prisma (PostgreSQL, database `core_service`)
- Port (local): `8080` (env `PORT` / `CORE_PORT`)
- Reached publicly through the gateway at `/core/*`

## Data model (Prisma)

`core-service/prisma/schema.prisma` defines:

`User`, `VerificationToken`, `Business`, `BusinessMember`,
`BusinessChannelConnection`, `Service`, `Resource`, `Employee`, `Schedule`,
`Customer`, `Reservation`, `Invite`, `KafkaEvent` (outbox table).

## Modules

Each module follows the `domain / application / infrastructure / presentation`
layering described in [01-architecture.md](./01-architecture.md).

### `auth` — session authentication
- `POST auth/login`
- `POST auth/select-business` — pick which business to act as, after login
- `POST auth/refresh`
- `POST auth/logout`

### `users` — registration & account lifecycle
- `POST auth/register`
- `POST auth/verify-email`
- `POST auth/resend-verification`
- `POST auth/forgot-password`
- `POST auth/reset-password`

(Both `auth` and `users` mount under the `auth` prefix — `users` owns
registration/verification/password flows, `auth` owns the login session
itself.)

### `business` — the tenant/business entity
- `POST business` — create a business
- `POST business/profile-image` — upload profile image (Cloudinary)
- `PATCH business/location`
- `GET public/:businessId/info` — public business info (no auth)
- `GET internal/businesses/:businessId/contact` — service-to-service only

### `business-channels` — connected messaging channels (WhatsApp/Meta)
- `GET business/channels`
- `POST business/channels/:channel/connect`
- `POST business/channels/whatsapp/embedded-signup/complete`
- `POST business/channels/meta/login/complete` (Messenger + Instagram, one popup)
- `DELETE business/channels/:channel`
- `PATCH business/channels/:channel/ai-enabled` — toggle AI auto-responses per channel
- `GET internal/business-channels/lookup` — service-to-service only

See `DEPLOYMENT.md` / [10-deployment.md](./10-deployment.md) for the Meta
webhook/App configuration this module depends on.

### `employees`
- `POST employees`, `GET employees`, `PUT employees/:id`, `DELETE employees/:id`

### `services` — the bookable services a business offers
- `POST services`, `GET services`, `PUT services/:id`, `DELETE services/:id`
- `GET public/:businessId/services` — public catalog, no auth

### `resources` — bookable resources (rooms, equipment, chairs, etc.)
- `POST resources`, `GET resources`, `PUT resources/:id`, `DELETE resources/:id`

### `schedules` — working hours per employee
- Mounted at `employees/:employeeId/schedules`
- `POST`, `GET`, `DELETE :scheduleId`

### `customers`
- No HTTP controller (no `presentation/` layer) — currently only written to as a
  side-effect of reservations (domain + infrastructure only).

### `reservations`
- Authenticated/staff side (`reservations`):
  - `GET reservations`
  - `GET reservations/checked-in`
  - `DELETE reservations/:id`
- Public booking flow (`public/:businessId`):
  - `GET public/:businessId/availability`
  - `GET public/:businessId/available-resources`
  - `POST public/:businessId/reservations`
  - `GET public/:businessId/reservations/lookup`
  - `PATCH public/:businessId/reservations/:id/reschedule`
  - `POST public/:businessId/reservations/:id/cancel`

This is the flow the booking widget / end customers use directly — no login
required, scoped by `businessId` in the URL.

### `invitations` — inviting staff to a business
- `POST invitations` — create an invite
- `GET invitations/:token` — look up an invite
- `POST invitations/:token/register` — register a new account via invite
- `POST invitations/:token/accept` — accept invite with an existing account

### `business-activation`
- Domain/application logic only (no controller) — orchestrates what happens
  when a business is marked "activated" (emits `business.activated`, see
  [08-events-and-kafka.md](./08-events-and-kafka.md)).

### `outbox`
- Implements the **transactional outbox pattern**: domain events are written to
  the `KafkaEvent` table in the same DB transaction as the business change, then
  a background process (`infrastructure/persistence/outbox`) publishes them to
  Kafka. This guarantees events are not lost if Kafka is briefly unavailable.

## Cross-cutting infrastructure (`src/infrastructure/`, `src/common/`)

- `prisma/` — Prisma client wrapper
- `cloudinary/` — image upload client (business profile images)
- `redis/` — caching / shared state
- `kafka/` — producer/consumer setup
- `rate-limit/` — per-route rate limiting
- `common/guards`, `common/filters`, `common/exceptions` — shared HTTP-layer
  concerns (most auth guards actually come from the shared `libs/auth` package)

## Running locally

```bash
cd core-service
pnpm install
npx prisma migrate deploy   # first run only
pnpm run start:dev
```

Requires `CORE_DATABASE_URL` (Postgres), `REDIS_URL`, Kafka broker env vars, and
`CLOUDINARY_*` credentials. See
[09-local-development.md](./09-local-development.md) for the full list, or run
everything via `docker compose up` from the repo root.

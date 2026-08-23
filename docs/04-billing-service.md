# billing-service

## Purpose

Owns subscriptions, plans and usage limits, and integrates with **Paddle** for
payment/billing webhooks.

- Folder: `billing-service/`
- Framework: NestJS + Prisma (PostgreSQL, database `billing_service`)
- Port (local): `8084` (env `PORT` / `BILLING_PORT`)
- Reached publicly through the gateway at `/billing/*`

## Data model (Prisma)

`Plan`, `PaddleWebhookEvent`, `Subscription`, `UsageCounter`, `KafkaEvent`
(outbox table) — see `billing-service/prisma/schema.prisma`.

## Modules

### `subscriptions`

- Customer-facing (`subscriptions`, authenticated):
  - `GET subscriptions/me` — current business's subscription
  - `POST subscriptions/upgrade-checkout` — start a Paddle checkout for an upgrade
  - `POST subscriptions/cancel`
- Service-to-service (`internal/:businessId`):
  - `GET internal/:businessId/ai-access` — used by `ai-service` to check whether
    a business's plan allows AI features
  - `POST internal/:businessId/usage/consume-message` — decrements/tracks usage
    (e.g. AI message quota) against `UsageCounter`
- Payment provider webhook:
  - `POST webhooks/paddle` — receives Paddle billing events (subscription
    created/updated/cancelled, payment events) and records them in
    `PaddleWebhookEvent` before applying them to `Subscription`

### `outbox`

Same transactional-outbox pattern as `core-service` — subscription changes are
published as Kafka events (`subscription.created`, `subscription.updated`,
`subscription.expired`, and a usage-limit event) so other services (e.g.
`notification-service` for emails, `ai-service` for gating) can react without a
synchronous call.

## Events produced

See [08-events-and-kafka.md](./08-events-and-kafka.md) for the full catalog.
Notably: `subscription.created`, `subscription.updated`, `subscription.expired`,
and a subscription-limit-reached notification consumed by
`notification-service`.

## Running locally

```bash
cd billing-service
pnpm install
npx prisma migrate deploy   # first run only
pnpm run start:dev
```

Requires `BILLING_DATABASE_URL`, Kafka broker env vars, and Paddle API
credentials (for verifying/calling the Paddle API). See
[09-local-development.md](./09-local-development.md).

# notification-service

## Purpose

Sends all transactional emails for the platform. It has **no public HTTP API**
and **no database** — it is a pure event-driven worker: it consumes domain
events from Kafka, queues an email job, and sends the email via **Resend**.

- Folder: `notification-service/`
- Framework: NestJS
- Port (local): `8081` (env `PORT` / `NOTIFICATION_PORT`) — used only for a
  health-check endpoint, not registered in the gateway's routing table
- Not reachable through the gateway

## Flow

```
Kafka topic  →  email-events.consumer.ts  →  email-queue.producer.ts (enqueue)
                                                        │
                                              email-queue.processor.ts (worker)
                                                        │
                                          resend-email-sender.ts → Resend API
```

- `infrastructure/kafka/email-events.consumer.ts` — subscribes to the relevant
  Kafka topics and maps each event to an email job.
- `infrastructure/queue/email-queue.producer.ts` / `email-queue.processor.ts` —
  an internal job queue so email sending is retried/decoupled from the Kafka
  consumer.
- `infrastructure/resend/resend-email-sender.ts` — the actual email delivery,
  implementing `domain/services/email-sender.ts`.

## Emails handled (one handler + one template per email type)

`application/handlers/` + `application/templates/`:

| Email | Triggered by |
|---|---|
| Welcome email | `user.welcome-email.requested` |
| Email verification | `user.email-verification.requested` |
| Password reset requested | `user.password-reset.requested` |
| Business created | `business.created` |
| Business activated | `business.activated` |
| Business setup reminder | (scheduled/internal trigger) |
| Invitation sent | invite created |
| Invitation accepted | `invitation.accepted` |
| Reservation created | `reservation.created` |
| Reservation rescheduled | `reservation.rescheduled` |
| Reservation cancelled | `reservation.cancelled` |
| Subscription created | `subscription.created` |
| Subscription expired | `subscription.expired` |
| Subscription limit reached | usage-limit event from `billing-service` |

See [08-events-and-kafka.md](./08-events-and-kafka.md) for the exact topic
names shared across services.

## Running locally

```bash
cd notification-service
pnpm install
pnpm run start:dev
```

Requires Kafka broker env vars and a `RESEND_API_KEY`. No database migration
step — this service has no Prisma schema.

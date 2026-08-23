# Events & Kafka

All asynchronous, cross-service communication goes through **Kafka**. Services
that own data (`core-service`, `billing-service`) write domain events into an
**outbox table** (`KafkaEvent`) in the same DB transaction as the change, and a
background publisher relays them to Kafka — this avoids losing events if Kafka
is briefly unreachable (the transactional outbox pattern).

## Infrastructure

| Environment | Where Kafka runs | Notes |
|---|---|---|
| Local | `docker-compose.yml`, container `kafka`, port `9092` (+ `kafka-ui` on `9090`) | plaintext, no auth needed |
| Production | Dedicated self-hosted server (`kafka/`, `deploy/kafka/docker-compose.prod.yml`) | firewalled by IP (only the 5 services that need it), `KAFKA_SASL_*` left blank — protected by firewall rather than SASL |

Each service's production `.env` sets `*_KAFKA_BROKERS` / `*_KAFKA_BROKER` to
the Kafka server's IP.

## Event catalog

Topic/event names found in the codebase, grouped by producing service:

### Produced by `core-service`

| Event | Meaning |
|---|---|
| `user.created` | A new user account was registered |
| `user.updated` | User profile changed |
| `user.email-verification.requested` | Triggers a verification email |
| `user.password-reset.requested` | Triggers a password-reset email |
| `user.welcome-email.requested` | Triggers the welcome email |
| `business.created` | A business was created |
| `business.activated` | A business finished setup / went live |
| `business.location.updated` | Business address/location changed |
| `business.profile-image.updated` | Business profile image changed |
| `employee.created` | An employee was added |
| `service.created` | A bookable service was added |
| `resource.created` | A bookable resource was added |
| `schedule.created` | A working-hours schedule was added |
| `invitation.accepted` | A staff invitation was accepted |
| `reservation.created` | A reservation was booked |
| `reservation.rescheduled` | A reservation's time changed |
| `reservation.cancelled` | A reservation was cancelled |

### Produced by `billing-service`

| Event | Meaning |
|---|---|
| `subscription.created` | A business subscribed to a plan |
| `subscription.updated` | Subscription changed (plan/status) |
| `subscription.expired` | Subscription lapsed |
| *(usage-limit reached)* | Emitted when a plan's usage quota (e.g. AI messages) is hit — consumed by `notification-service` for the "subscription limit reached" email |

## Consumers

| Service | Consumes | For |
|---|---|---|
| `notification-service` | all of the events above that have a corresponding email | sends transactional emails (see [06-notification-service.md](./06-notification-service.md)) |
| `ai-service` | business/subscription-related events (as needed) | keeping AI access/usage state in sync |
| `communication-service` | business-channel related events (as needed) | keeping channel connection state in sync |

## Adding a new event

1. Define/emit it from the owning module's `application` layer (write to the
   outbox table in the same transaction as the state change — don't publish to
   Kafka directly from inside a request handler).
2. Add a Kafka consumer in whichever service needs to react (typically
   `infrastructure/kafka/*.consumer.ts`).
3. If it should trigger an email, add a handler + template under
   `notification-service/src/modules/email/application/`.
4. Document it in the table above.

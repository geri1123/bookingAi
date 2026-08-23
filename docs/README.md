# BookingAI — Technical Documentation

This `docs/` folder contains the technical documentation for the BookingAI platform: a
microservices-based booking / scheduling system with AI-assisted conversations and
multi-channel messaging (WhatsApp, Messenger, Instagram).

## Where this documentation lives

```
booking/
├── docs/                          ← you are here (all documentation, in English)
│   ├── README.md                  ← this index
│   ├── 01-architecture.md         ← system architecture & service map
│   ├── 02-api-gateway.md          ← api-gateway service
│   ├── 03-core-service.md         ← core-service (business, users, reservations, ...)
│   ├── 04-billing-service.md      ← billing-service (subscriptions, Paddle)
│   ├── 05-communication-service.md← communication-service (WhatsApp/Meta webhooks)
│   ├── 06-notification-service.md← notification-service (emails)
│   ├── 07-ai-service.md           ← ai-service (AI conversations / booking intents)
│   ├── 08-events-and-kafka.md     ← Kafka event catalog (cross-service contract)
│   ├── 09-local-development.md   ← running the whole stack locally
│   └── 10-deployment.md           ← production deployment (mirrors DEPLOYMENT.md)
├── DEPLOYMENT.md                  ← original deployment notes (kept for reference)
├── docker-compose.yml
└── <service folders>
```

Keep this `docs/` folder at the root of the repository, next to `docker-compose.yml`,
so it stays next to the code it describes and travels with the repo in git.

## Reading order

1. **[01-architecture.md](./01-architecture.md)** — start here. Explains the six
   services, how they talk to each other (HTTP through the gateway, async through
   Kafka), and what infrastructure each one depends on (Postgres, Redis, Kafka).
2. Then read the per-service file for whichever service you're working on.
3. **[08-events-and-kafka.md](./08-events-and-kafka.md)** is the shared contract
   between services — read it whenever you add or consume an event.
4. **[09-local-development.md](./09-local-development.md)** to run everything on
   your machine.
5. **[10-deployment.md](./10-deployment.md)** for production/CI-CD.

## One-line summary of each service

| Service | Responsibility | Port (local) |
|---|---|---|
| `api-gateway` | Single public entry point; proxies to internal services, rate-limits, CORS | 8000 |
| `core-service` | Source of truth: businesses, users/auth, employees, services, resources, schedules, customers, reservations, invitations | 8080 |
| `ai-service` | AI-driven conversations and booking-intent extraction per business | 8081 |
| `communication-service` | Inbound/outbound messaging via WhatsApp & Meta (Messenger/Instagram) webhooks | 8082 |
| `billing-service` | Subscriptions, plans, usage limits, Paddle billing webhooks | 8083 |
| `notification-service` | Transactional emails (queued, sent via Resend) | 8084 |
| `kafka` | Async event bus connecting all of the above | 9092 |

See [01-architecture.md](./01-architecture.md) for the full picture.

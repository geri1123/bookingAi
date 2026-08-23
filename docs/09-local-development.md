# Local Development

## Prerequisites

- Node.js + [pnpm](https://pnpm.io/) (this is a pnpm workspace — see root
  `package.json` / `pnpm-workspace.yaml`)
- Docker + Docker Compose (for Postgres, Redis, Kafka, and optionally the
  services themselves)

## Quick start (everything in Docker)

```bash
cp .env.example .env   # fill in real/fake values for local testing
docker compose build
docker compose up
```

This starts, per `docker-compose.yml`:

| Container | Purpose | Port |
|---|---|---|
| `postgres` | database for core/ai/billing/communication services | 5432 |
| `redis` | cache / rate-limiting / shared state | 6379 |
| `kafka` | event bus | 9092 |
| `kafka-ui` | web UI to browse Kafka topics | 9090 |
| `api-gateway` | public entry point | 8000 (`GATEWAY_PORT`) |
| `core-service` | | 8080 (`CORE_PORT`) |
| `ai-service` | | 8081 (`AI_PORT`) |
| `communication-service` | | 8082 (`COMMUNICATION_PORT`) |
| `billing-service` | | 8083 (`BILLING_PORT`) |
| `notification-service` | | 8084 (`NOTIFICATION_PORT`) |

First run only — apply database migrations:

```bash
docker compose exec core-service npx prisma migrate deploy
docker compose exec ai-service npx prisma migrate deploy
docker compose exec billing-service npx prisma migrate deploy
docker compose exec communication-service npx prisma migrate deploy
```

Then hit the gateway at `http://localhost:8000`, e.g.
`http://localhost:8000/core/public/<businessId>/info`.

## Running a single service outside Docker

Useful when actively developing one service (hot reload):

```bash
cd <service>          # e.g. core-service
pnpm install
npx prisma migrate deploy   # only for services with a prisma/ folder
pnpm run start:dev
```

Point it at the shared Postgres/Redis/Kafka containers started via
`docker compose up postgres redis kafka` (start only the infra, not the app
containers), and set its `.env` accordingly (e.g.
`DATABASE_URL=postgresql://.../core_service?host=localhost`).

## Where each service's config comes from

Every service reads its config from environment variables (see each service's
`src/config/`). In Docker Compose these are injected from the root `.env`
file via `${VARIABLE}` interpolation (see `docker-compose.yml`). There is no
`.env.example` currently committed in this archive — create one from the
variables referenced in `docker-compose.yml` (`grep -oE '\$\{[A-Z_]+' docker-compose.yml`)
before running the stack, or ask whoever maintains deployment secrets for a
reference `.env`.

## Testing webhooks locally

`communication-service`'s Meta/WhatsApp webhooks require a public HTTPS URL.
Use a tunnel (e.g. `ngrok http 8000`) pointed at the gateway, and register
`https://<tunnel>/comm/webhooks/whatsapp` and `https://<tunnel>/comm/webhooks/meta`
in the Meta App Dashboard. `test-webhook.js` at the repo root is a small script
useful for sending synthetic webhook payloads while developing.

## Useful commands

```bash
# unit tests / e2e tests / coverage (per service)
pnpm run test
pnpm run test:e2e
pnpm run test:cov

# tail logs for one container
docker compose logs -f core-service

# rebuild a single service after a Dockerfile change
docker compose build core-service && docker compose up -d core-service
```

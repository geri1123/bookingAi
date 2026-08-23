# communication-service

## Purpose

Handles inbound and outbound messaging through external channels: **WhatsApp
Cloud API**, **Messenger** and **Instagram** (the latter two via the Meta Graph
API). It receives webhooks from Meta, stores the conversation as `Message`
records, and (via Kafka/`ai-service`) can trigger AI-generated replies.

- Folder: `communication-service/`
- Framework: NestJS + Prisma (PostgreSQL, database `communication_service`)
- Port (local): `8083` (env `PORT` / `COMMUNICATION_PORT`)
- Reached publicly through the gateway at `/comm/*`

## Data model (Prisma)

`Message` — see `communication-service/prisma/schema.prisma`.

## Modules

### `messaging`

- `GET/POST webhooks/whatsapp` — WhatsApp Cloud API webhook. `GET` is the Meta
  verification handshake (`hub.challenge`), `POST` receives incoming messages
  and delivery/status updates.
- `GET/POST webhooks/meta` — shared webhook for Messenger and Instagram (same
  verification/receive pattern as above).

Webhook authenticity is verified using `META_APP_SECRET` (signature check) and
the verification handshake uses `META_WEBHOOK_VERIFY_TOKEN` — both are
environment variables, see [10-deployment.md](./10-deployment.md).

## Public webhook URLs (production)

Through the gateway, with the `/comm` prefix:

```
WhatsApp:             https://<domain>/comm/webhooks/whatsapp
Messenger/Instagram:  https://<domain>/comm/webhooks/meta
```

## Automatic business connection (Embedded Signup)

Business owners connect their own WhatsApp/Messenger/Instagram accounts via
Meta's **Embedded Signup** / **Facebook Login for Business** flow on the
frontend, then call (on `core-service`, not here):

```
POST business/channels/whatsapp/embedded-signup/complete
POST business/channels/meta/login/complete
```

This requires two Meta **Configuration IDs** (one for WhatsApp, one for
Messenger+Instagram) from the Meta App Dashboard, used client-side only.

> ⚠️ Embedded Signup v2 is being deprecated **October 15, 2026** — the frontend
> must use JS SDK v4 before then.

## Running locally

```bash
cd communication-service
pnpm install
npx prisma migrate deploy   # first run only
pnpm run start:dev
```

Requires `COMMUNICATION_DATABASE_URL`, `REDIS_URL`, `META_APP_SECRET`,
`META_WEBHOOK_VERIFY_TOKEN`, and other Meta app credentials. Note that Meta
webhooks require a **publicly reachable HTTPS URL**, so local testing typically
needs a tunnel (e.g. ngrok) pointed at the gateway.

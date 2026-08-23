# ai-service

## Purpose

Runs AI-driven conversations on behalf of a business (e.g. answering WhatsApp/
Messenger/Instagram messages relayed by `communication-service`), and extracts
**booking intents** (e.g. "the customer wants to book a haircut Friday at 3pm")
that can be turned into a reservation via `core-service`.

- Folder: `ai-service/`
- Framework: NestJS + Prisma (PostgreSQL, database `ai_service`)
- Port (local): `8082` (env `PORT` / `AI_PORT`)
- Reached publicly through the gateway at `/ai/*`

## Data model (Prisma)

`AiSettings`, `Conversation`, `BookingIntent` — see
`ai-service/prisma/schema.prisma`.

## Modules

### `conversation`

- `GET business/ai-settings` — read the AI configuration for the current
  business (e.g. tone, enabled/disabled, system prompt customization)
- `PUT business/ai-settings` — update it
- `POST internal/conversations/handle-message` — **service-to-service** entry
  point: `communication-service` calls this with an incoming message, and
  `ai-service` returns/dispatches the AI-generated reply and/or a detected
  booking intent

## How it fits with other services

1. A customer messages the business on WhatsApp/Messenger/Instagram.
2. `communication-service` receives the webhook, stores the `Message`, and (if
   AI is enabled for that channel — see `business-channels` in
   [core-service](./03-core-service.md)) calls
   `POST internal/conversations/handle-message` on `ai-service`.
3. Before responding, `ai-service` checks the business's AI access/usage quota
   via `billing-service` (`GET internal/:businessId/ai-access`,
   `POST internal/:businessId/usage/consume-message` — see
   [billing-service](./04-billing-service.md)).
4. If the message expresses a booking request, `ai-service` records a
   `BookingIntent` and can call `core-service`'s public reservation endpoints
   to create/reschedule/cancel a reservation on the customer's behalf.

## Running locally

```bash
cd ai-service
pnpm install
npx prisma migrate deploy   # first run only
pnpm run start:dev
```

Requires `AI_DATABASE_URL`, `REDIS_URL`, an AI/LLM provider API key, and the
internal URLs for `core-service`/`billing-service`/`communication-service`. See
[09-local-development.md](./09-local-development.md).

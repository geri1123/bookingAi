# Deployment

> This mirrors and slightly expands the repo-root `DEPLOYMENT.md` — kept here so
> all documentation lives in one place. If the two ever disagree, treat
> `DEPLOYMENT.md` at the repo root as the source of truth (it's the one meant to
> be updated quickly during an incident).

## Topology

**7 servers**: 6 application services, each on its own machine, + 1 dedicated
Kafka server.

| Component | Where |
|---|---|
| Postgres | [Neon](https://neon.tech) — 4 databases: `core_service`, `ai_service`, `billing_service`, `communication_service` |
| Redis | Redis Cloud |
| Kafka | self-hosted, its own server (`kafka/`, `deploy/kafka/`) |
| Docker images | GitHub Container Registry (`ghcr.io`) |

## Repository layout relevant to deployment

```
api-gateway/Dockerfile
core-service/Dockerfile
ai-service/Dockerfile
billing-service/Dockerfile
communication-service/Dockerfile
notification-service/Dockerfile

deploy/api-gateway/docker-compose.prod.yml
deploy/core-service/docker-compose.prod.yml
deploy/ai-service/docker-compose.prod.yml
deploy/billing-service/docker-compose.prod.yml
deploy/communication-service/docker-compose.prod.yml
deploy/notification-service/docker-compose.prod.yml
deploy/kafka/docker-compose.prod.yml

.github/workflows/ci.yml
.github/workflows/build-and-push.yml
.github/workflows/deploy.yml
```

(Each service folder also has its own `docker-compose.prod.yml` colocated with
it — the `deploy/` copies above are what actually gets shipped to servers.)

## Database migrations (first deploy)

```bash
docker compose exec core-service npx prisma migrate deploy
docker compose exec ai-service npx prisma migrate deploy
docker compose exec billing-service npx prisma migrate deploy
docker compose exec communication-service npx prisma migrate deploy
```

## Kafka server setup (manual — not part of CI/CD)

```bash
mkdir -p /opt/bookingai && cd /opt/bookingai
# copy deploy/kafka/docker-compose.prod.yml + .env
# .env: KAFKA_ADVERTISED_HOST=<public IP of this server>
docker compose -f docker-compose.prod.yml --env-file .env up -d
```

Firewall — only the 5 service IPs that need Kafka are allowed on port 9092:

```bash
sudo ufw default deny incoming
sudo ufw allow ssh
sudo ufw allow from <core-service-IP> to any port 9092
sudo ufw allow from <ai-service-IP> to any port 9092
sudo ufw allow from <billing-service-IP> to any port 9092
sudo ufw allow from <communication-service-IP> to any port 9092
sudo ufw allow from <notification-service-IP> to any port 9092
sudo ufw enable
```

Note: `KAFKA_SASL_*` is intentionally left blank in production — access is
controlled by the firewall rule above rather than SASL auth.

## The 6 application services (automatic deploy after push)

```bash
mkdir -p /opt/bookingai && cd /opt/bookingai
# copy deploy/<service>/docker-compose.prod.yml → docker-compose.prod.yml + .env
```

Each service's `.env` needs:
- `CORE_DATABASE_URL` / equivalent → Neon connection string
- `*_REDIS_URL` → Redis Cloud connection string
- `*_KAFKA_BROKERS` / `*_KAFKA_BROKER` → IP of the Kafka server

## GitHub Environments (6 — not needed for Kafka)

In GitHub: **Settings → Environments**, create one each for `api-gateway`,
`core-service`, `ai-service`, `billing-service`, `communication-service`,
`notification-service`. Each environment needs these secrets:

```
DEPLOY_HOST
DEPLOY_USER
DEPLOY_SSH_KEY
DEPLOY_PORT   (optional)
```

## CI/CD pipeline

Push to `main` triggers, in order:
1. **CI** (`ci.yml`) — lint + test, only for services that changed
2. **Build & Push** (`build-and-push.yml`) — builds the Docker image and pushes
   it to `ghcr.io`
3. **Deploy** (`deploy.yml`) — SSHes into the target server and runs
   `docker compose pull && docker compose up -d`

Manual trigger: **Actions → Deploy → Run workflow**.

First-time setup on a server may require logging into GHCR:

```bash
echo $GHCR_TOKEN | docker login ghcr.io -u <github-username> --password-stdin
```

(or make the GHCR package public under its Package settings, to skip login).

## Meta (WhatsApp / Messenger / Instagram) production configuration

Callback URLs (through `api-gateway`, `/comm` prefix):

```
WhatsApp:             https://<domain>/comm/webhooks/whatsapp
Messenger/Instagram:  https://<domain>/comm/webhooks/meta
```

- Verify Token = `META_WEBHOOK_VERIFY_TOKEN`
- Use the **real** (not test) App Secret in `META_APP_SECRET`

Automatic business connection (Embedded Signup / Facebook Login for Business),
called on `core-service`:

```
POST business/channels/whatsapp/embedded-signup/complete
POST business/channels/meta/login/complete   (Messenger + Instagram, one popup)
```

Requires two **Configuration IDs** (WhatsApp, and Messenger/Instagram — they
need different permissions) from the Meta App Dashboard → Facebook Login for
Business. These are used on the **frontend**, not the backend.

> ⚠️ Embedded Signup v2 is being deprecated **October 15, 2026** — migrate the
> frontend to JS SDK v4 before then.

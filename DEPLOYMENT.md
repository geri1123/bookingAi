# Deployment — BookingAI

7 servers: 6 application services + 1 Kafka, each on its own machine.

## Infrastructure

| | Where |
|---|---|
| Postgres | Neon (4 databases: `core_service`, `ai_service`, `billing_service`, `communication_service`) |
| Redis | Redis Cloud |
| Kafka | self-hosted, its own server (`deploy/kafka/`) |
| Docker images | ghcr.io |

## Structure

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

## Local

```bash
cp .env.example .env
docker compose build
docker compose up
```

Migrations, first time:
```bash
docker compose exec core-service npx prisma migrate deploy
docker compose exec ai-service npx prisma migrate deploy
docker compose exec billing-service npx prisma migrate deploy
docker compose exec communication-service npx prisma migrate deploy
```

## Servers

**Kafka** (manual setup, not part of CI/CD):
```bash
mkdir -p /opt/bookingai && cd /opt/bookingai
# copy deploy/kafka/docker-compose.prod.yml + .env
# .env: KAFKA_ADVERTISED_HOST=<public IP of this server>
docker compose -f docker-compose.prod.yml --env-file .env up -d
```

Firewall — only the 5 service IPs are allowed on port 9092:
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

**The 6 application services** (automatic deploy after push):
```bash
mkdir -p /opt/bookingai && cd /opt/bookingai
# copy deploy/<service>/docker-compose.prod.yml → docker-compose.prod.yml + .env
```

Each service's `.env`: `CORE_DATABASE_URL` etc. → Neon, `*_REDIS_URL` → Redis Cloud, `*_KAFKA_BROKERS`/`BROKER` → IP of the Kafka server (`KAFKA_SASL_*` left blank, protected by firewall rather than SASL).

## GitHub — Environments (6, not for Kafka)

Settings → Environments → create `api-gateway`, `core-service`, `ai-service`, `billing-service`, `communication-service`, `notification-service`. In each one:
```
DEPLOY_HOST, DEPLOY_USER, DEPLOY_SSH_KEY, DEPLOY_PORT (optional)
```

## CI/CD

Push to `main` → CI (lint+test, only changed services) → Build & Push (image → ghcr.io) → Deploy (SSH, `pull` + `up -d`).

Manual: Actions → Deploy → Run workflow.

First time, GHCR may require login on the server:
```bash
echo $GHCR_TOKEN | docker login ghcr.io -u <github-username> --password-stdin
```
(or make the package public under Package settings)

## Meta — WhatsApp / Messenger / Instagram

Callback URLs (through api-gateway, `/comm` prefix):
```
WhatsApp:            https://<domain>/comm/webhooks/whatsapp
Messenger/Instagram: https://<domain>/comm/webhooks/meta
```

Verify Token = `META_WEBHOOK_VERIFY_TOKEN`. Real (not test) App Secret in `META_APP_SECRET`.

Automatic business connection (Embedded Signup / Facebook Login for Business):
```
POST business/channels/whatsapp/embedded-signup/complete
POST business/channels/meta/login/complete   (Messenger + Instagram, 1 popup)
```

Requires 2 Configuration IDs (WhatsApp + Messenger/Instagram, different permissions) from the Meta App Dashboard → Facebook Login for Business — used on the frontend, not the backend.



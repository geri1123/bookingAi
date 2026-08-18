# Deployment guide — BookingAI

## Çfarë u shtua

```
.dockerignore
.env.example
docker-compose.yml            (dev — build lokal)
docker-compose.prod.yml       (prod — imazhe nga ghcr.io)
docker/postgres-init/01-create-databases.sh
api-gateway/Dockerfile
core-service/Dockerfile
ai-service/Dockerfile
billing-service/Dockerfile
communication-service/Dockerfile
notification-service/Dockerfile
.github/workflows/ci.yml              (lint+test, vetëm serviset e ndryshuara)
.github/workflows/build-and-push.yml  (build+push imazhe → ghcr.io)
.github/workflows/deploy.yml          (SSH deploy → serveri i çdo shërbimi)
```

## 3 bug-e reale që u gjetën dhe u rregulluan në kod (jo vetëm Docker)

1. **`pnpm-lock.yaml` jo-sinkron** me `api-gateway/package.json` (mungonte `dotenv`) → do e thyente çdo `pnpm install --frozen-lockfile` (pra CI). U rregullua duke rifreskuar lockfile-in.
2. **`libs/auth/package.json`**: `@nestjs/common`, `@nestjs/core`, `rxjs`, `reflect-metadata` ishin `devDependencies`/`peerDependencies` jo `dependencies` reale → në build prodhimi (pa devDependencies) do dështonte `Cannot find module '@nestjs/common'`. U bënë `dependencies` reale. E testova me `pnpm install --prod` + run — funksionon.
3. **`nest-cli.json`** te `ai-service`, `billing-service`, `communication-service`: kopjonte Prisma client të gjeneruar te `dist/src/generated/prisma-client`, por kodi i kompiluar e pret në `dist/generated/prisma-client` (import relativ). Kjo do thyente app-in **edhe pa Docker**, në çdo build prodhimi. U korrigjua `outDir` në `dist`.

U hoq gjithashtu një `tsconfig.tsbuildinfo` i ngecur te `libs/auth` (cache nga makina jote lokale, jo pjesë e git-ut, por ishte në zip) — nëse futet në build, `tsc` mund të "harrojë" të gjenerojë `dist/index.js`. Tashmë është edhe në `.dockerignore` që të mos ndodhë më.

## ⚠️ Nuk u testua plotësisht (kufizim i sandbox-it tim)

Sandbox-i im s'ka akses në `binaries.prisma.sh` (aty ku Prisma shkarkon query-engine), pra s'munda të bëj `prisma generate` real për `core/ai/billing/communication-service`, as build të plotë Docker (s'kam `docker` në sandbox). Testova çdo pjesë tjetër drejtpërdrejt me `pnpm`/`node` (workspace linking, `--prod` install, resolution i `@bookingai/auth`, etj — jo thjesht "duket mirë"). **Përpara se me bo deploy, provoje lokalisht:**

```bash
docker compose build core-service
docker compose up core-service
```

Nëse core-service ngrihet pa error, gjithçka tjetër (ai/billing/communication ndjekin të njëjtin pattern) duhet të jetë OK.

## Çfarë duhet të bësh ti tani

### 1. Lokalisht
```bash
cp .env.example .env
# plotëso JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, INTERNAL_API_KEY,
# CHANNEL_TOKEN_ENCRYPTION_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY,
# CLOUDINARY_URL, RESEND_API_KEY, META_* — edhe me vlera fake për test lokal

docker compose build          # build gjithë 6 serviset
docker compose up             # ngre gjithçka + Postgres/Redis/Kafka

# migrimet e DB duhen ekzekutuar manualisht herën e parë për çdo service:
docker compose exec core-service npx prisma migrate deploy
docker compose exec ai-service npx prisma migrate deploy
docker compose exec billing-service npx prisma migrate deploy
docker compose exec communication-service npx prisma migrate deploy
```

### 2. Përgatit serverat — 1 VPS për secilin nga 6 shërbimet
Në secilin server:
```bash
mkdir -p /opt/bookingai
# kopjo docker-compose.prod.yml + .env (me vlera REALE prodhimi, jo ato lokale!)
```
Instalo Docker + Docker Compose plugin në secilin server.

### 3. GitHub — Secrets & Environments
Shko te **Settings → Environments** dhe krijo nga një environment për secilin nga këta emra (duhet të përputhen saktë me emrat e serviseve):
```
api-gateway, core-service, ai-service, billing-service,
communication-service, notification-service
```
Në secilin environment shto:
```
DEPLOY_HOST     — IP/hostname i serverit të atij shërbimi
DEPLOY_USER     — user SSH (p.sh. deploy)
DEPLOY_SSH_KEY  — private key SSH për atë user
DEPLOY_PORT     — porti SSH (opsional, default 22)
```
Nëse disa shërbime ndajnë të njëjtin server, thjesht vendos të njëjtin `DEPLOY_HOST` në disa environments — asgjë s'ndryshon.

`GITHUB_TOKEN` për push në `ghcr.io` krijohet automatikisht nga GitHub, s'duhet ta shtosh vetë.

### 4. Rrjedha e CI/CD (automatike pas push)
1. Push në `main` → **CI** lint+test vetëm serviset e ndryshuara.
2. **Build & Push** ndërton imazhin Docker vetëm për ato shërbime dhe e push-on te `ghcr.io/<org>/<repo>/<service>:latest` + `:sha-<commit>`.
3. **Deploy** hyn me SSH te serveri i atij shërbimi, bën `docker compose pull && up -d --no-deps <service>`.

Mund ta lansosh deploy edhe manualisht nga tab-i **Actions → Deploy → Run workflow**, duke shkruar emrat e serviseve (të ndara me presje).

### 5. Kontroll fillestar i `ghcr.io`
Herën e parë, paketa e imazhit në GHCR mund të jetë **private** dhe serveri yt s'do arrijë ta bëjë `pull` pa u autentikuar. Në secilin server:
```bash
echo $GHCR_TOKEN | docker login ghcr.io -u <github-username> --password-stdin
```
(krijo një Personal Access Token me scope `read:packages`), ose thjesht bëje paketën publike nga **Package settings** në GitHub pasi të jetë krijuar herën e parë.

## Pse këto zgjedhje (jo tjera)

- **GitHub Actions + ghcr.io + SSH/docker compose** — asnjë infrastrukturë shtesë (jo Kubernetes), përshtatet natyrshëm me "servera të ndryshëm" pa overhead.
- **Multi-stage Dockerfile me pnpm** — layer caching (ndryshimi i kodit s'rindërton `node_modules`), imazh final pa devDependencies, pa `prisma`/`typescript`/`eslint` në prodhim.
- **Environment i veçantë GitHub për secilin service** — nëse kompromentohet një server, çelësi i tij s'jep akses te të tjerët; mundësia për "required reviewers" nëse dëshiron miratim manual para se një service të shkojë live.

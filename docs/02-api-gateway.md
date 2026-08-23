# api-gateway

## Purpose

Single public HTTP entry point for the whole platform. It does not contain
business logic — it authenticates/authorizes at the edge where needed, applies
CORS and rate-limiting, and reverse-proxies requests to the internal services.

- Folder: `api-gateway/`
- Framework: NestJS
- Public port (local): `8000` (env `PORT`, default `8000`)

## Folder structure

```
api-gateway/src/
├── main.ts
├── app.module.ts
├── app.controller.ts        # health check ("@Controller()")
├── config/
│   └── gateway.config.ts    # routing table, CORS, rate-limit config
├── middleware/               # request-level middleware (e.g. logging)
├── proxy/
│   └── proxy.factory.ts      # builds one http-proxy-middleware instance per route
├── redis/                    # Redis client used for rate limiting
└── common/
    ├── helpers/
    └── errors/
```

## Routing

See the routing table in [01-architecture.md](./01-architecture.md#api-gateway-routing-table).
Each entry in `gateway.config.ts`'s `routes` array becomes one proxy created by
`createServiceProxy()` (`proxy/proxy.factory.ts`):

- `pathFilter`: the public prefix (e.g. `/core`)
- `pathRewrite`: strips that prefix before forwarding (`/core/business` → `/business`
  on `core-service`)
- `changeOrigin: true`
- Forwards `x-forwarded-for` so downstream services see the real client IP
- On upstream failure, responds `502` with `{ success: false, code: "UPSTREAM_UNAVAILABLE" }`

## Configuration (environment variables)

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | Port the gateway listens on | `8000` |
| `CLIENT_BASE_URL` | Fallback CORS origin | `http://localhost:3000` |
| `CORS_ORIGINS` | Comma-separated list of allowed origins | value of `CLIENT_BASE_URL` |
| `REDIS_URL` | Redis connection string, used for rate limiting | `redis://localhost:6379` |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window in ms | `60000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `120` |
| `CORE_SERVICE_URL` | Target for `/core` | `http://localhost:8080` |
| `AI_SERVICE_URL` | Target for `/ai` | `http://localhost:8082` |
| `COMMUNICATION_SERVICE_URL` | Target for `/comm` | `http://localhost:8083` |
| `BILLING_SERVICE_URL` | Target for `/billing` | `http://localhost:8084` |

## Running locally

```bash
cd api-gateway
pnpm install
pnpm run start:dev
```

Or as part of the full stack — see
[09-local-development.md](./09-local-development.md).

## Notes / gotchas

- `notification-service` has **no route** registered here — it is reachable only
  internally, through Kafka. Do not expect `/notifications/*` to work.
- If a downstream service is down, callers get a `502` with a stable JSON error
  body (`UPSTREAM_UNAVAILABLE`) instead of a raw connection error — handle that
  code explicitly on the frontend.

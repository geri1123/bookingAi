# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=22-alpine
ARG PNPM_VERSION=9.15.9

FROM node:${NODE_VERSION} AS base
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

# ---------------------------------------------------------------------------
# deps
# ---------------------------------------------------------------------------
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY api-gateway/package.json api-gateway/package.json

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---------------------------------------------------------------------------
# build
# ---------------------------------------------------------------------------
FROM deps AS build
COPY api-gateway api-gateway

RUN pnpm --filter api-gateway build

# ---------------------------------------------------------------------------
# runtime
# ---------------------------------------------------------------------------
FROM base AS runtime
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY api-gateway/package.json api-gateway/package.json
COPY --from=build /app/api-gateway/dist api-gateway/dist

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

USER app
WORKDIR /app/api-gateway
EXPOSE 8000
CMD ["node", "dist/main.js"]

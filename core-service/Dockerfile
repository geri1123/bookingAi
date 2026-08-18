# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=22-alpine
ARG PNPM_VERSION=9.15.9

# ---------------------------------------------------------------------------
# base — shared tool setup, reused by every stage below
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS base
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app


FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY libs/auth/package.json libs/auth/package.json
COPY core-service/package.json core-service/package.json
# core-service's "postinstall" script runs `prisma generate`, which needs the
# schema to already be on disk at install time.
COPY core-service/prisma core-service/prisma

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---------------------------------------------------------------------------
# build — compile the shared lib, then the service
# ---------------------------------------------------------------------------
FROM deps AS build
COPY libs/auth libs/auth
COPY core-service core-service

RUN pnpm --filter @bookingai/auth build
RUN pnpm --filter core-service build

FROM base AS runtime
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY libs/auth/package.json libs/auth/package.json
COPY --from=build /app/libs/auth/dist libs/auth/dist
COPY core-service/package.json core-service/package.json
COPY core-service/prisma core-service/prisma
COPY --from=build /app/core-service/dist core-service/dist

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile --ignore-scripts

USER app
WORKDIR /app/core-service
EXPOSE 8080
CMD ["node", "dist/src/main.js"]

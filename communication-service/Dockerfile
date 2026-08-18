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
COPY libs/auth/package.json libs/auth/package.json
COPY communication-service/package.json communication-service/package.json
COPY communication-service/prisma communication-service/prisma

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---------------------------------------------------------------------------
# build — no "postinstall" script here, generate the Prisma client explicitly.
# ---------------------------------------------------------------------------
FROM deps AS build
COPY libs/auth libs/auth
COPY communication-service communication-service

RUN pnpm --filter @bookingai/auth build
RUN pnpm --filter communication-service exec prisma generate
RUN pnpm --filter communication-service build

# ---------------------------------------------------------------------------
# runtime
# ---------------------------------------------------------------------------
FROM base AS runtime
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY libs/auth/package.json libs/auth/package.json
COPY --from=build /app/libs/auth/dist libs/auth/dist
COPY communication-service/package.json communication-service/package.json
COPY communication-service/prisma communication-service/prisma
COPY --from=build /app/communication-service/dist communication-service/dist

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile --ignore-scripts

USER app
WORKDIR /app/communication-service
EXPOSE 8082
CMD ["node", "dist/src/main.js"]

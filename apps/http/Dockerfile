# =========================
# 1. Base image
# =========================
FROM node:20-bullseye AS base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate


# =========================
# 2. Dependencies
# =========================
FROM base AS deps

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile


# =========================
# 3. Prisma generate
# =========================
FROM deps AS prisma

# IMPORTANT: force binary engine for alpine
ENV PRISMA_CLIENT_ENGINE_TYPE=binary
RUN pnpm exec prisma generate --config apps/http/prisma.config.ts


# =========================
# 4. Build HTTP app
# =========================
FROM prisma AS build

WORKDIR /app
RUN pnpm -w exec tsc -p apps/http/tsconfig.json


# =========================
# 5. Runtime
# =========================
FROM node:20-bullseye AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY --from=build /app /app

WORKDIR /app/apps/http
EXPOSE 3000

CMD ["node", "dist/index.js"]
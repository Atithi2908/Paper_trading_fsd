FROM node:20-bullseye AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy workspace files
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY apps ./apps
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build WS app
WORKDIR /app/apps/ws
RUN pnpm run build


# ================================
# Runtime image
# ================================
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
# Copy only required files
COPY --from=builder /app/apps/ws/dist ./dist
COPY --from=builder /app/apps/ws/package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --prod
EXPOSE 4000

CMD ["node", "dist/index.js"]
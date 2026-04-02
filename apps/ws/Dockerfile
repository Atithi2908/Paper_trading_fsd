FROM node:20-bullseye AS builder

WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm ci

WORKDIR /app/apps/ws
RUN npm run build

FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/ws/dist ./dist
COPY --from=builder /app/apps/ws/package.json ./
COPY package-lock.json ./

RUN npm install --omit=dev

EXPOSE 4000
CMD ["node", "dist/index.js"]
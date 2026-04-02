FROM node:20-bullseye AS build

WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm ci

WORKDIR /app/apps/http
RUN npm run build

FROM node:20-bullseye AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

COPY --from=build /app/apps/http /app

RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "dist/index.js"]
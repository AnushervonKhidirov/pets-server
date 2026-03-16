# Stage 1: Build
FROM node:24-slim AS builder
WORKDIR /server

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate

COPY . .

RUN npm run build

# Stage 2: Runtime
FROM node:24-slim
WORKDIR /server
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /server/node_modules ./node_modules
COPY --from=builder /server/dist ./dist
COPY --from=builder /server/package*.json ./
COPY --from=builder /server/prisma ./prisma/
COPY --from=builder /server/prisma.config.ts ./
COPY --from=builder /server/secret ./secret

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["./docker-entrypoint.sh"]

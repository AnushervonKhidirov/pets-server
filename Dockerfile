# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /server
RUN apk add --no-cache openssl ca-certificates libc6-compat

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate

COPY . .

RUN npm run build

# Stage 2: Runtime
FROM node:24-alpine
WORKDIR /server
RUN apk add --no-cache openssl ca-certificates libc6-compat

COPY --from=builder /server/node_modules ./node_modules
COPY --from=builder /server/dist ./dist
COPY --from=builder /server/package*.json ./
COPY --from=builder /server/prisma ./prisma/
COPY --from=builder /server/prisma.config.ts ./

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]

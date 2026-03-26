#!/bin/sh
set -e

echo "Syncing database schema..."
npx prisma migrate deploy --config ./prisma.config.ts

echo "Starting application..."
exec npm run start:dev

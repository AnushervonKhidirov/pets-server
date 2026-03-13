#!/bin/sh
set -e

echo "Syncing database schema..."
npx prisma db push --config ./prisma.config.ts

echo "Starting application..."
exec node dist/src/main

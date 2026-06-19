#!/bin/sh
set -e

echo "Generating Prisma client..."
npx prisma generate

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Preparing seed assets..."
mkdir -p uploads
cp -n seed-assets/*.png uploads/ 2>/dev/null || true

echo "Seeding database..."
npx prisma db seed

echo "Starting backend..."
exec npm run start:dev

#!/bin/bash
set -e

APP_DIR="/var/www/bannana-id"
echo "▶ Deploying bannana-id to $APP_DIR"

cd "$APP_DIR"

echo "▶ Pulling latest code..."
git pull origin main

echo "▶ Installing dependencies..."
npm install

echo "▶ Building..."
npm run build

echo "▶ Copying static assets into standalone output..."
cp -r .next/static  .next/standalone/.next/static
cp -r public        .next/standalone/public

echo "▶ Copying .env..."
cp .env .next/standalone/.env

echo "▶ Restarting PM2..."
pm2 delete bannana-id 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "▶ Reloading nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "✅ Deploy complete. Check: https://bannana.teknopatih.com/api/health"

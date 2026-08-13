#!/usr/bin/env bash
set -euo pipefail

# Redeploy the API on the VPS after pulling latest code.
# Usage (from repo root on the server):
#   chmod +x scripts/redeploy-production.sh
#   ./scripts/redeploy-production.sh

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> Pulling latest code..."
git pull origin ur-server

echo "==> Installing dependencies..."
npm install

echo "==> Building TypeScript..."
npm run build

echo "==> Applying database migrations..."
npm run migrate:deploy

use_docker=false
if command -v docker >/dev/null 2>&1 && [ -f docker-compose.yml ]; then
  if docker compose ps --status running 2>/dev/null | grep -q imotrack-backend; then
    use_docker=true
  fi
fi

if [ "$use_docker" = true ]; then
  echo "==> Docker container detected — rebuilding..."
  docker compose up --build -d
  docker compose ps
else
  echo "==> Using PM2 (port 4000 — Caddy usually proxies here)..."
  if ! command -v pm2 >/dev/null 2>&1; then
    echo "ERROR: pm2 is required. Install: npm i -g pm2"
    exit 1
  fi
  if pm2 describe imotrak-api >/dev/null 2>&1; then
    pm2 restart imotrak-api --update-env
  else
    pm2 start ecosystem.config.cjs --env production
  fi
  pm2 save
  pm2 list
fi

echo "==> Verifying maintenance route..."
sleep 2
for url in "http://127.0.0.1:4000/v2/maintenance" "http://127.0.0.1:7017/v2/maintenance"; do
  code="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$url" 2>/dev/null || echo "000")"
  echo "  POST $url -> HTTP $code"
  if echo "$code" | grep -Eq '^(401|403|400|415)$'; then
    echo "OK: maintenance route is live."
    exit 0
  fi
done

echo "WARN: Route check failed. Run: ./scripts/diagnose-server.sh"
exit 1

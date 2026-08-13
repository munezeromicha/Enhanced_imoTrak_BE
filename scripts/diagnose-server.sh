#!/usr/bin/env bash
# Show how the API is running on this VPS.
set -uo pipefail

echo "=== Listening ports (4000 / 7017) ==="
if command -v ss >/dev/null 2>&1; then
  ss -tlnp | grep -E ':4000|:7017' || echo "(nothing on 4000 or 7017)"
elif command -v netstat >/dev/null 2>&1; then
  netstat -tlnp 2>/dev/null | grep -E ':4000|:7017' || echo "(nothing on 4000 or 7017)"
else
  echo "Install ss or netstat to inspect ports."
fi

echo
echo "=== PM2 processes ==="
if command -v pm2 >/dev/null 2>&1; then
  pm2 list || true
else
  echo "pm2 not installed"
fi

echo
echo "=== Docker containers ==="
if command -v docker >/dev/null 2>&1; then
  docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || true
else
  echo "docker not installed"
fi

echo
echo "=== Route probe ==="
for url in "http://127.0.0.1:4000/v2/maintenance" "http://127.0.0.1:7017/v2/maintenance"; do
  code="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$url" 2>/dev/null || echo "000")"
  echo "POST $url -> HTTP $code"
done

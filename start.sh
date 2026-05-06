#!/usr/bin/env bash
# Bring up the unified cuentas-venezuela stack (Next.js + Hono + Postgres + MinIO).
# The mapa-olvido SPA is now bundled directly into the Next.js app, so a single
# compose project runs the whole site.
#
# Open http://localhost:3100
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"

check_port() {
  local port="$1"
  if ss -tln 2>/dev/null | awk '{print $4}' | grep -qE "[:.]${port}\$"; then
    local owner
    owner=$(docker ps --format '{{.Names}}\t{{.Ports}}' \
              | awk -v p=":${port}->" '$0 ~ p {print $1; exit}')
    if [[ -z "$owner" ]]; then
      echo "WARN: port ${port} is in use by a non-docker process." >&2
    fi
  fi
}
check_port 3100
check_port 8100
check_port 5433

echo "==> docker compose up -d"
( cd "$DIR" && docker compose up -d )

echo "==> Smoke check on http://localhost:3100 ..."
ok=0
for i in $(seq 1 30); do
  code=$(curl -so /dev/null -w "%{http_code}" --max-time 3 http://localhost:3100/ || true)
  if [[ "$code" == "200" ]]; then ok=1; break; fi
  sleep 2
done
[[ $ok -eq 1 ]] && echo "  OK: cuentas-venezuela responding." \
                || echo "  WARN: :3100 did not respond 200 after 60s. docker compose logs web" >&2

cat <<EOF

Stack up:
  - http://localhost:3100/                 cuentas-venezuela landing
  - http://localhost:3100/mapa-del-olvido  Mapa del Olvido
  - http://localhost:3100/datos-chile      Datos Chile dashboards
  - http://localhost:8100/api/obras        Hono API (obras)

Tear down:
  ( cd $DIR && docker compose down )
EOF

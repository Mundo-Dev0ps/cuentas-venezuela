#!/usr/bin/env bash
# Bind production hostnames to the deployed Workers.
# Idempotent: re-runs do nothing if the binding already exists.
#
#   api.cuentasvenezuela.org   → cuentas-venezuela-api worker
#   cuentasvenezuela.org       → cuentas-venezuela-web worker
#   www.cuentasvenezuela.org   → cuentas-venezuela-web worker
#
# Cloudflare auto-creates the DNS record + cert when a custom domain
# is bound to a Worker, so we don't need separate DNS:Edit calls.

set -euo pipefail

ENV_FILE="${ENV_FILE:-.env}"
[[ -f $ENV_FILE ]] || { echo "ERROR: $ENV_FILE not found" >&2; exit 1; }
set -a; . "$ENV_FILE"; set +a

: "${CLOUDFLARE_API_TOKEN:?required}"
: "${CLOUDFLARE_ACCOUNT_ID:?required}"

API="https://api.cloudflare.com/client/v4"
H_AUTH=(-H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")
H_JSON=(-H "Content-Type: application/json")

cf() { curl -sS -X "$1" "${H_AUTH[@]}" "${H_JSON[@]}" "$@" "${API}${2}"; }

bind() {
  local hostname="$1"
  local worker="$2"
  echo "→ $hostname → $worker"
  local body
  body=$(printf '{"environment":"production","hostname":"%s","service":"%s"}' "$hostname" "$worker")
  local resp
  resp=$(curl -sS -X PUT "${H_AUTH[@]}" "${H_JSON[@]}" \
    --data "$body" \
    "${API}/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/domains")
  if echo "$resp" | grep -q '"success":true'; then
    echo "  ✓ bound"
  elif echo "$resp" | grep -q "already exists"; then
    echo "  ✓ already bound"
  else
    echo "  ✗ $(echo "$resp" | head -c 300)" >&2
  fi
}

bind "api.cuentasvenezuela.org" "cuentas-venezuela-api"
bind "cuentasvenezuela.org"     "cuentas-venezuela-web"
bind "www.cuentasvenezuela.org" "cuentas-venezuela-web"

echo
echo "Done. Verify in dashboard:"
echo "  https://dash.cloudflare.com/${CLOUDFLARE_ACCOUNT_ID}/workers-and-pages"

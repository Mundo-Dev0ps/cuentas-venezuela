#!/usr/bin/env bash
# Push runtime secrets into the deployed Workers.
# Wrangler `secret put` reads from stdin; same effect via CF API:
#   PUT /accounts/{acct}/workers/scripts/{name}/secrets
# Idempotent (PUT replaces).
#
# Reads from .env. Worker NAMES match wrangler.{toml,jsonc} `name` fields.

set -euo pipefail

ENV_FILE="${ENV_FILE:-.env}"
[[ -f $ENV_FILE ]] || { echo "ERROR: $ENV_FILE not found" >&2; exit 1; }
set -a; . "$ENV_FILE"; set +a

: "${CLOUDFLARE_API_TOKEN:?required}"
: "${CLOUDFLARE_ACCOUNT_ID:?required}"
: "${DATABASE_URL_PROD:?required (Neon HTTP connection string)}"

API="https://api.cloudflare.com/client/v4"
ACCT="$CLOUDFLARE_ACCOUNT_ID"

put_secret() {
  local script="$1"
  local name="$2"
  local value="$3"
  if [[ -z "$value" ]]; then
    echo "  skip $script.$name (empty)"
    return 0
  fi
  local body
  body=$(printf '{"name":"%s","text":%s,"type":"secret_text"}' \
    "$name" "$(printf '%s' "$value" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')")
  local resp
  resp=$(curl -sS -X PUT \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data "$body" \
    "${API}/accounts/${ACCT}/workers/scripts/${script}/secrets")
  if echo "$resp" | grep -q '"success":true'; then
    echo "  ✓ $script.$name"
  else
    echo "  ✗ $script.$name: $(echo "$resp" | head -c 240)" >&2
  fi
}

echo "Setting Worker secrets ..."
echo "API worker (cuentas-venezuela-api):"
put_secret cuentas-venezuela-api DATABASE_URL            "${DATABASE_URL_PROD:-}"
put_secret cuentas-venezuela-api KOFI_VERIFICATION_TOKEN "${KOFI_VERIFICATION_TOKEN:-}"

# Web worker reads only public env vars (set in wrangler.jsonc [vars]); no
# secrets needed for the OpenNext Next.js bundle.
echo "Done."

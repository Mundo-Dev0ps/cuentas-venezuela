#!/usr/bin/env bash
# Apply Cloudflare zone hardening for cuentasvenezuela.org via the public API.
# Idempotent: re-running updates rule names instead of duplicating.
#
# Reads from local .env:
#   CLOUDFLARE_API_TOKEN   (must include Zone:Read, Zone:Edit, Zone WAF:Edit)
#   CLOUDFLARE_ACCOUNT_ID
#
# Sets:
#   1. Zone settings: Always HTTPS, HSTS, Min TLS 1.2, Bot Fight Mode,
#      Email obfuscation, Hotlink protection.
#   2. WAF custom rules (block direct R2 + non-domain hosts).
#   3. Rate-limit rule on /api/* sensitive endpoints.
#
# Run:
#   ./scripts/cf-security-bootstrap.sh
# Override target zone:
#   CF_ZONE=otra.com ./scripts/cf-security-bootstrap.sh

set -euo pipefail

ENV_FILE="${ENV_FILE:-.env}"
ZONE_NAME="${CF_ZONE:-cuentasvenezuela.org}"
ACCOUNT_HASH_PATTERN='[0-9a-f]{32}'

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found" >&2
  exit 1
fi
set -a; . "$ENV_FILE"; set +a

: "${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN required in $ENV_FILE}"
: "${CLOUDFLARE_ACCOUNT_ID:?CLOUDFLARE_ACCOUNT_ID required in $ENV_FILE}"

API="https://api.cloudflare.com/client/v4"
H_AUTH=(-H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")
H_JSON=(-H "Content-Type: application/json")

cf() {
  local method="$1"; shift
  local path="$1"; shift
  curl -sS -X "$method" "${H_AUTH[@]}" "${H_JSON[@]}" "$@" "${API}${path}"
}

ok() {
  local resp="$1"
  echo "$resp" | grep -q '"success":true'
}

jget() {
  # Tiny field extractor without jq dependency. $2 = json key. $1 = json blob.
  echo "$1" | grep -oE "\"$2\":\"[^\"]*\"" | head -1 | sed -E "s/.*\"$2\":\"([^\"]*)\".*/\1/"
}

echo "→ Resolving zone id for $ZONE_NAME ..."
ZONE_RESP=$(cf GET "/zones?name=$ZONE_NAME&account.id=$CLOUDFLARE_ACCOUNT_ID")
if ! ok "$ZONE_RESP"; then
  echo "ERROR fetching zone:"; echo "$ZONE_RESP" | head -c 400; echo; exit 1
fi
ZONE_ID=$(jget "$ZONE_RESP" "id")
if [[ -z "$ZONE_ID" || ${#ZONE_ID} -ne 32 ]]; then
  echo "ERROR: zone $ZONE_NAME not found in account or token lacks Zone:Read."
  echo "$ZONE_RESP" | head -c 400; echo; exit 1
fi
echo "  zone_id=$ZONE_ID"

# ---------------------------------------------------------------------
# 1. Zone settings
# ---------------------------------------------------------------------
set_setting() {
  local key="$1"; local value="$2"
  local r
  r=$(cf PATCH "/zones/$ZONE_ID/settings/$key" --data "{\"value\":$value}")
  if ok "$r"; then echo "  ✓ $key = $value"
  else echo "  ✗ $key: $(echo "$r" | head -c 200)" >&2; fi
}

echo "→ Zone settings ..."
set_setting always_use_https      "\"on\""
set_setting automatic_https_rewrites "\"on\""
set_setting min_tls_version       "\"1.2\""
set_setting tls_1_3               "\"on\""
set_setting opportunistic_encryption "\"on\""
set_setting email_obfuscation     "\"on\""
set_setting hotlink_protection    "\"on\""
set_setting browser_check         "\"on\""
set_setting security_level        "\"medium\""
set_setting challenge_ttl         1800

echo "→ HSTS (6 months, includeSubdomains, no preload yet) ..."
HSTS_BODY='{"value":{"strict_transport_security":{"enabled":true,"max_age":15552000,"include_subdomains":true,"preload":false,"nosniff":true}}}'
HSTS_R=$(cf PATCH "/zones/$ZONE_ID/settings/security_header" --data "$HSTS_BODY")
ok "$HSTS_R" && echo "  ✓ HSTS enabled" || echo "  ✗ HSTS: $(echo "$HSTS_R" | head -c 200)" >&2

echo "→ Bot Fight Mode (free tier toggle) ..."
BFM_R=$(cf POST "/zones/$ZONE_ID/bot_management" --data '{"fight_mode":true}')
ok "$BFM_R" && echo "  ✓ Bot Fight Mode on" || \
  echo "  ! Bot Fight Mode: needs zone level toggle in dashboard if API rejects: $(echo "$BFM_R" | head -c 160)"

# ---------------------------------------------------------------------
# 2. WAF custom rules (free, max 5 on free plan)
# ---------------------------------------------------------------------
echo "→ WAF custom rules ..."

# Find or create the entrypoint custom ruleset for this zone (phase = http_request_firewall_custom)
RULESET_LIST=$(cf GET "/zones/$ZONE_ID/rulesets")
RULESET_ID=$(echo "$RULESET_LIST" \
  | grep -oE '\{[^{}]*"phase":"http_request_firewall_custom"[^{}]*\}' \
  | head -1 \
  | grep -oE '"id":"[a-f0-9]+"' | head -1 | sed 's/"id":"\(.*\)"/\1/')

if [[ -z "$RULESET_ID" ]]; then
  echo "  → creating new custom ruleset ..."
  RULESET_R=$(cf POST "/zones/$ZONE_ID/rulesets" --data '{
    "name": "cuentas-venezuela-custom-waf",
    "kind": "zone",
    "phase": "http_request_firewall_custom",
    "rules": []
  }')
  RULESET_ID=$(jget "$RULESET_R" "id")
  echo "  ruleset_id=$RULESET_ID"
fi

# Replace all rules with the canonical set (idempotent — overwrites every run).
cat >/tmp/cv-waf-rules.json <<'JSON'
{
  "rules": [
    {
      "description": "Block hosts outside cuentasvenezuela.org",
      "expression": "(http.host ne \"cuentasvenezuela.org\" and http.host ne \"www.cuentasvenezuela.org\" and http.host ne \"api.cuentasvenezuela.org\")",
      "action": "block"
    },
    {
      "description": "Block known bad bots on POST endpoints",
      "expression": "(http.request.method eq \"POST\" and cf.client.bot)",
      "action": "block"
    },
    {
      "description": "Challenge admin / config probes",
      "expression": "(http.request.uri.path matches \"^/(\\.env|wp-admin|wp-login|admin|phpmyadmin|\\.git|\\.aws)\")",
      "action": "managed_challenge"
    }
  ]
}
JSON

WAF_R=$(cf PUT "/zones/$ZONE_ID/rulesets/$RULESET_ID" --data @/tmp/cv-waf-rules.json)
if ok "$WAF_R"; then
  echo "  ✓ 3 custom WAF rules applied"
else
  echo "  ✗ WAF rules: $(echo "$WAF_R" | head -c 300)" >&2
fi
rm -f /tmp/cv-waf-rules.json

# ---------------------------------------------------------------------
# 3. Rate-limit rule (free plan = 1 ruleset)
# Uses the rulesets engine (phase = http_ratelimit).
# ---------------------------------------------------------------------
echo "→ Rate limit on /api/* sensitive endpoints ..."

RL_LIST=$(cf GET "/zones/$ZONE_ID/rulesets")
RL_RULESET_ID=$(echo "$RL_LIST" \
  | grep -oE '\{[^{}]*"phase":"http_ratelimit"[^{}]*\}' \
  | head -1 \
  | grep -oE '"id":"[a-f0-9]+"' | head -1 | sed 's/"id":"\(.*\)"/\1/')

if [[ -z "$RL_RULESET_ID" ]]; then
  RL_CREATE=$(cf POST "/zones/$ZONE_ID/rulesets" --data '{
    "name": "cuentas-venezuela-ratelimit",
    "kind": "zone",
    "phase": "http_ratelimit",
    "rules": []
  }')
  RL_RULESET_ID=$(jget "$RL_CREATE" "id")
fi

cat >/tmp/cv-rl.json <<'JSON'
{
  "rules": [
    {
      "description": "Rate limit POST /api/{reportes,subscribers,kofi/webhook} 10/min/IP",
      "expression": "(http.request.method eq \"POST\" and starts_with(http.request.uri.path, \"/api/\"))",
      "action": "block",
      "ratelimit": {
        "characteristics": ["cf.colo.id", "ip.src"],
        "period": 60,
        "requests_per_period": 10,
        "mitigation_timeout": 600
      }
    },
    {
      "description": "Rate limit GET /api/* 120/min/IP",
      "expression": "(http.request.method eq \"GET\" and starts_with(http.request.uri.path, \"/api/\"))",
      "action": "block",
      "ratelimit": {
        "characteristics": ["cf.colo.id", "ip.src"],
        "period": 60,
        "requests_per_period": 120,
        "mitigation_timeout": 60
      }
    }
  ]
}
JSON

RL_R=$(cf PUT "/zones/$ZONE_ID/rulesets/$RL_RULESET_ID" --data @/tmp/cv-rl.json)
if ok "$RL_R"; then
  echo "  ✓ rate-limit rules applied (1 POST + 1 GET)"
else
  echo "  ✗ rate-limit: $(echo "$RL_R" | head -c 300)" >&2
fi
rm -f /tmp/cv-rl.json

# ---------------------------------------------------------------------
# 4. Cache rule for /api/obras + /api/supporters (already 60s in code,
#    but enforce edge-side too).
# ---------------------------------------------------------------------
echo "→ Cache rules (edge cache for cacheable GETs) ..."

CACHE_LIST=$(cf GET "/zones/$ZONE_ID/rulesets")
CACHE_RULESET_ID=$(echo "$CACHE_LIST" \
  | grep -oE '\{[^{}]*"phase":"http_request_cache_settings"[^{}]*\}' \
  | head -1 \
  | grep -oE '"id":"[a-f0-9]+"' | head -1 | sed 's/"id":"\(.*\)"/\1/')

if [[ -z "$CACHE_RULESET_ID" ]]; then
  CACHE_CREATE=$(cf POST "/zones/$ZONE_ID/rulesets" --data '{
    "name": "cuentas-venezuela-cache",
    "kind": "zone",
    "phase": "http_request_cache_settings",
    "rules": []
  }')
  CACHE_RULESET_ID=$(jget "$CACHE_CREATE" "id")
fi

cat >/tmp/cv-cache.json <<'JSON'
{
  "rules": [
    {
      "description": "Cache GET /api/obras + supporters at edge (5 min)",
      "expression": "(http.request.method eq \"GET\" and (http.request.uri.path eq \"/api/obras\" or http.request.uri.path eq \"/api/supporters\" or starts_with(http.request.uri.path, \"/v1/ve-macro/\") or starts_with(http.request.uri.path, \"/v1/ddhh/\") or starts_with(http.request.uri.path, \"/v1/migracion/\") or starts_with(http.request.uri.path, \"/v1/data/\")))",
      "action": "set_cache_settings",
      "action_parameters": {
        "cache": true,
        "edge_ttl": {"mode": "override_origin", "default": 300},
        "browser_ttl": {"mode": "override_origin", "default": 60}
      }
    }
  ]
}
JSON

CACHE_R=$(cf PUT "/zones/$ZONE_ID/rulesets/$CACHE_RULESET_ID" --data @/tmp/cv-cache.json)
if ok "$CACHE_R"; then
  echo "  ✓ cache rule applied (5min edge / 60s browser for /api/* GETs)"
else
  echo "  ✗ cache rule: $(echo "$CACHE_R" | head -c 300)" >&2
fi
rm -f /tmp/cv-cache.json

echo
echo "Done. Verify in dashboard:"
echo "  https://dash.cloudflare.com/$CLOUDFLARE_ACCOUNT_ID/$ZONE_NAME/security/waf"
echo "  https://dash.cloudflare.com/$CLOUDFLARE_ACCOUNT_ID/$ZONE_NAME/caching/cache-rules"

#!/usr/bin/env bash
# Push secrets from local .env to GitHub Actions for the personal repo.
# Run via the wrapper so the gh active account flips temporarily:
#   ./scripts/with-personal-gh.sh ./scripts/set-gh-secrets.sh
#
# Never prints secret values. Reads them from .env (set -a; source) so the
# raw bytes only exist in the parent shell + gh process.

set -euo pipefail

REPO="${REPO:-Mundo-Dev0ps/cuentas-venezuela}"
ENV_FILE="${ENV_FILE:-.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found" >&2
  exit 1
fi

# Load env. Inline `set -a` exports every var defined.
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

push() {
  local name="$1"
  local value="$2"
  if [[ -z "$value" ]]; then
    echo "  skip $name (empty)"
    return 0
  fi
  if printf '%s' "$value" | gh secret set "$name" --repo "$REPO" >/dev/null 2>&1; then
    echo "  ✓ $name"
  else
    echo "  ✗ $name (gh secret set failed)" >&2
    return 1
  fi
}

echo "Setting GitHub Actions secrets on $REPO ..."

# Cloudflare deploy creds
push CLOUDFLARE_API_TOKEN      "${CLOUDFLARE_API_TOKEN:-}"
push CLOUDFLARE_ACCOUNT_ID     "${CLOUDFLARE_ACCOUNT_ID:-}"

# Neon (used by db-migrate + etl-cron)
push DATABASE_URL_PROD         "${DATABASE_URL_PROD:-}"
push DATABASE_URL_STAGING      "${DATABASE_URL_STAGING:-}"

# R2 (used by etl-cron — mapped to S3_* in workflow)
push S3_ENDPOINT               "${R2_ENDPOINT:-}"
push S3_REGION                 "${R2_REGION:-auto}"
push S3_BUCKET                 "${R2_BUCKET:-cuentas-venezuela-prod}"
push S3_KEY                    "${R2_KEY:-}"
push S3_SECRET                 "${R2_SECRET:-}"

# Ko-fi (optional — empty value is skipped)
push KOFI_VERIFICATION_TOKEN   "${KOFI_VERIFICATION_TOKEN:-}"

echo "Done."

#!/usr/bin/env bash
# Run a command with gh + git temporarily using the personal GitHub account
# (Mundo-Dev0ps), then revert back to whatever account was active before.
#
# Usage:
#   scripts/with-personal-gh.sh gh secret set FOO --body=bar
#   scripts/with-personal-gh.sh git push origin main
#
# Detects current active gh account, switches to Mundo-Dev0ps, runs the
# command, and (regardless of success/failure) switches back via trap.

set -euo pipefail

PERSONAL_USER="Mundo-Dev0ps"

# Capture currently active account, if any. The format is:
#   "  ✓ Logged in to github.com account <user> (keyring)"
#   "  - Active account: true"
# so the username is $(NF-1), not $NF.
PREV_USER=$(gh auth status 2>&1 \
  | awk '/Logged in to github.com account/{u=$(NF-1)} /Active account: true/{print u; exit}' \
  || true)

if [[ -z "${PREV_USER:-}" ]]; then
  echo "ERROR: no active gh account detected. Run 'gh auth login' first." >&2
  exit 1
fi

cleanup() {
  if [[ "$PREV_USER" != "$PERSONAL_USER" ]]; then
    gh auth switch --user "$PREV_USER" >/dev/null 2>&1 || \
      echo "WARN: failed to revert gh active account to $PREV_USER" >&2
    echo "→ reverted gh active account to $PREV_USER"
  fi
}
trap cleanup EXIT

if [[ "$PREV_USER" != "$PERSONAL_USER" ]]; then
  echo "→ switching gh active account: $PREV_USER → $PERSONAL_USER"
  gh auth switch --user "$PERSONAL_USER" >/dev/null
else
  echo "→ already on $PERSONAL_USER (no switch needed)"
fi

# Run the user-supplied command (gh / git / wrangler, etc).
"$@"

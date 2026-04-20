#!/usr/bin/env bash
set -euo pipefail

echo "Checking internal routes are protected by InternalServiceGuard..."
MATCHES=$(rg -n "internal/" apps -g "*.controller.ts" || true)
if [ -z "$MATCHES" ]; then
  echo "No internal routes found"
  exit 0
fi

echo "$MATCHES" | while IFS= read -r line; do
  FILE=$(echo "$line" | cut -d: -f1)
  if ! rg -q "InternalServiceGuard" "$FILE"; then
    echo "Potential issue: $FILE contains internal routes but no InternalServiceGuard import/use"
    exit 1
  fi
done

echo "Access-control audit passed"

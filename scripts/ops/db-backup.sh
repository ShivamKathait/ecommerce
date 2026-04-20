#!/usr/bin/env bash
set -euo pipefail

OUT_DIR=${1:-./backups}
STAMP=$(date +%Y%m%d_%H%M%S)
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-postgres}
DB_NAME=${DB_NAME:-learningPostgres}

mkdir -p "$OUT_DIR"
FILE="$OUT_DIR/${DB_NAME}_${STAMP}.dump"

echo "Creating backup: $FILE"
PGPASSWORD="${DB_PASSWORD:-}" pg_dump \
  -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
  -Fc "$DB_NAME" -f "$FILE"

echo "Backup completed: $FILE"

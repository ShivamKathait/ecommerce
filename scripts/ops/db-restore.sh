#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <backup-file.dump>"
  exit 1
fi

BACKUP_FILE="$1"
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-postgres}
DB_NAME=${DB_NAME:-learningPostgres}

echo "Restoring $BACKUP_FILE into $DB_NAME"
PGPASSWORD="${DB_PASSWORD:-}" pg_restore \
  -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" \
  -d "$DB_NAME" --clean --if-exists "$BACKUP_FILE"

echo "Restore completed"

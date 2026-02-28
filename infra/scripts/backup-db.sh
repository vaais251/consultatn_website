#!/usr/bin/env bash
#
# backup-db.sh — PostgreSQL backup script for GB Guide
#
# Usage:
#   ./infra/scripts/backup-db.sh
#   DATABASE_URL="postgresql://user:pass@host:5432/dbname" ./infra/scripts/backup-db.sh
#
# Output:
#   Timestamped .sql.gz file in ./infra/backups/
#
# Schedule with cron:
#   0 2 * * * /path/to/project/infra/scripts/backup-db.sh >> /var/log/gb-backup.log 2>&1

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/../backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/gbguide_${TIMESTAMP}.sql.gz"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Use DATABASE_URL or defaults
DB_URL="${DATABASE_URL:-postgresql://gbguide:gbguide_secret@localhost:5432/gbguide}"

echo "🗄️  Starting backup at $(date)"
echo "   Target: ${BACKUP_FILE}"

# Run pg_dump and compress
pg_dump "${DB_URL}" | gzip > "${BACKUP_FILE}"

# Get file size
SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo "✅ Backup complete: ${BACKUP_FILE} (${SIZE})"

# Cleanup: keep only last 14 days of backups
find "${BACKUP_DIR}" -name "gbguide_*.sql.gz" -mtime +14 -delete 2>/dev/null || true
echo "🧹 Old backups cleaned (keeping 14 days)"

echo "Done at $(date)"

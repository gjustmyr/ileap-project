#!/bin/bash

# ILEAP Backup Script
# Backs up database and uploaded files

BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

echo "Starting backup at $(date)"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
echo "Backing up database..."
pg_dump -U ileap_user -d ileap_db > $BACKUP_DIR/ileap_db_$DATE.sql

if [ $? -eq 0 ]; then
    echo "Database backup completed: ileap_db_$DATE.sql"
    gzip $BACKUP_DIR/ileap_db_$DATE.sql
else
    echo "Database backup failed!"
    exit 1
fi

# Backup uploads
echo "Backing up uploaded files..."
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/html/uploads

if [ $? -eq 0 ]; then
    echo "Uploads backup completed: uploads_$DATE.tar.gz"
else
    echo "Uploads backup failed!"
    exit 1
fi

# Clean old backups
echo "Cleaning old backups (older than $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Show backup size
echo ""
echo "Backup summary:"
du -sh $BACKUP_DIR/*_$DATE.*

echo ""
echo "Backup completed at $(date)"

# Database Backup & Disaster Recovery Guide — RMS Creations

This document details the automated backup strategies and disaster recovery procedures for RMS Creations.

---

## 1. Automated Cloud Backups (Supabase Native)
- **Daily Automated Backups**:
  - Supabase automatically takes daily physical snapshots of the Postgres database.
  - Backups are stored encrypted in secure cloud storage with point-in-time retention.
  - Accessible directly in the **Supabase Dashboard** &rarr; **Project Settings** &rarr; **Database** &rarr; **Backups**.
- **Point-in-Time Recovery (PITR)**:
  - In production Pro tier, PITR allows continuous write-ahead log (WAL) archiving, enabling rollbacks to any specific minute if required.

---

## 2. On-Demand Automated Local Snapshot (`npm run backup-db`)
You can take a complete, portable snapshot of all core application tables anytime before major changes or migrations.

### How to Run:
```bash
npm run backup-db
```

### What It Backs Up:
- `categories`: Hamper departments & catalogue sections.
- `products`: All ready-to-ship hampers and gift boxes.
- `product_details`: Individual hamper inclusions & custom hamper studio inventory.
- `product_mappings`: Hamper-to-item bundle relationships.
- `purchase_order`: Customer orders, addresses, and order tracking records.
- `purchase_order_details`: Line items per customer order.
- `app_settings`: Active WhatsApp contact number, email, and studio location.
- `banner_images`: Promotional hero carousel banners.

### Location:
Backups are saved to timestamped JSON files in `supabase/backups/backup-<TIMESTAMP>.json` (automatically ignored by git for security and customer data privacy).

---

## 3. Full Postgres SQL Dump (CLI Method)
For a complete SQL schema + data dump:
```bash
# Using Supabase CLI (if installed)
supabase db dump -f supabase/backups/full-db-dump-$(date +%F).sql

# Or using standard pg_dump with connection pooler
pg_dump "postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres" > supabase/backups/full-backup.sql
```

---

## 4. Disaster Recovery / Restore Procedure
To restore from an on-demand snapshot:
1. Open the Supabase SQL editor or run the migration script with your chosen JSON backup.
2. In Supabase Dashboard, you can also click **"Restore"** on any automated daily backup snapshot to restore the entire database state within minutes.

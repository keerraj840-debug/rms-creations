import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to load .env
function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim().replace(/^['"](.*)['"]$/, '$1');
    }
  }
  return env;
}

const localEnv = loadEnvFile(path.join(rootDir, '.env'));
const supabaseUrl = process.env.SUPABASE_URL || localEnv.SUPABASE_URL || 'https://igwbbfrhgyrfavvkpheh.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || localEnv.SUPABASE_ANON_KEY || 'sb_publishable_tooz3bkl3NXwLVgKMlT4zA_yZWxdYbZ';

const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES = [
  'categories',
  'products',
  'product_details',
  'product_mappings',
  'purchase_order',
  'purchase_order_details',
  'pincodes',
  'app_settings',
  'banner_images',
  'users'
];

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(rootDir, 'supabase', 'backups');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupData = {
    createdAt: new Date().toISOString(),
    supabaseUrl,
    tables: {}
  };

  console.log(`[Database Backup] Starting backup at ${backupData.createdAt}...`);

  for (const table of TABLES) {
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.warn(`  ⚠️ Could not export table "${table}":`, error.message);
        backupData.tables[table] = { error: error.message };
      } else {
        backupData.tables[table] = data || [];
        console.log(`  ✓ Exported ${table} (${(data || []).length} records)`);
      }
    } catch (err) {
      console.warn(`  ⚠️ Exception while backing up "${table}":`, err.message);
    }
  }

  const backupFilePath = path.join(backupDir, `backup-${timestamp}.json`);
  fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf8');

  console.log(`\n🎉 Backup successfully created: ${backupFilePath}`);
  console.log(`File size: ${(fs.statSync(backupFilePath).size / 1024).toFixed(1)} KB`);
}

runBackup().catch((err) => {
  console.error('Backup failed:', err);
  process.exit(1);
});

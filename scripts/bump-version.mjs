import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const versionFilePath = path.join(rootDir, 'VERSION');
const packageJsonPath = path.join(rootDir, 'package.json');
const swPath = path.join(rootDir, 'src', 'sw.js');
const versionJsonPath = path.join(rootDir, 'src', 'version.json');
const versionTsPath = path.join(rootDir, 'src', 'environments', 'version.ts');

const isSyncOnly = process.argv.includes('--sync-only');

function incrementSemver(ver) {
  const parts = ver.trim().split('.').map((p) => parseInt(p, 10) || 0);
  while (parts.length < 3) parts.push(0);
  parts[2] += 1;
  return parts.join('.');
}

let currentVersion = '1.6.0';
if (fs.existsSync(versionFilePath)) {
  currentVersion = fs.readFileSync(versionFilePath, 'utf8').trim();
}

const nextVersion = isSyncOnly ? currentVersion : incrementSemver(currentVersion);
const nowIso = new Date().toISOString();

console.log(`[Version Management] ${isSyncOnly ? 'Syncing' : 'Incrementing'} version to: ${nextVersion}`);

// 1. Update VERSION file
fs.writeFileSync(versionFilePath, `${nextVersion}\n`, 'utf8');

// 2. Update package.json
if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  pkg.version = nextVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

// 3. Update src/version.json
const versionJson = {
  version: nextVersion,
  buildTime: nowIso,
  appName: 'RMS Creations'
};
fs.writeFileSync(versionJsonPath, JSON.stringify(versionJson, null, 2) + '\n', 'utf8');

// 4. Update src/environments/version.ts
const versionTsContent = `export const APP_VERSION = '${nextVersion}';
export const APP_BUILD_TIME = '${nowIso}';
`;
fs.writeFileSync(versionTsPath, versionTsContent, 'utf8');

// 5. Update src/sw.js cache version
if (fs.existsSync(swPath)) {
  let swContent = fs.readFileSync(swPath, 'utf8');
  swContent = swContent.replace(/const CACHE_VERSION = 'rms-v[^']+';/, `const CACHE_VERSION = 'rms-v${nextVersion}';`);
  fs.writeFileSync(swPath, swContent, 'utf8');
}

console.log(`✅ Version successfully updated to ${nextVersion} across VERSION, package.json, version.json, version.ts, and sw.js!`);

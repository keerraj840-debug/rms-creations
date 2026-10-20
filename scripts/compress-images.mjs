import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '..', 'src', 'assets');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

const allFiles = getFiles(assetsDir);
let savedBytes = 0;

console.log('[Image Optimizer] Scanning for large images...');

for (const file of allFiles) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

  const statBefore = fs.statSync(file);
  // Compress if larger than 180KB (skip already optimized preview files)
  if (statBefore.size > 180 * 1024 && !file.includes('preview')) {
    try {
      if (ext === '.jpg' || ext === '.jpeg') {
        execSync(`sips -s format jpeg -s formatOptions 80 "${file}" --out "${file}"`, { stdio: 'ignore' });
      } else if (ext === '.png') {
        // Check image width
        const output = execSync(`sips -g pixelWidth "${file}"`, { encoding: 'utf8' });
        const match = output.match(/pixelWidth:\s*(\d+)/);
        const width = match ? parseInt(match[1], 10) : 0;
        if (width > 800) {
          execSync(`sips --resampleWidth 800 "${file}"`, { stdio: 'ignore' });
        }
      }
      const statAfter = fs.statSync(file);
      const diff = statBefore.size - statAfter.size;
      if (diff > 0) {
        savedBytes += diff;
        console.log(`✓ Optimized ${path.relative(assetsDir, file)}: ${(statBefore.size/1024).toFixed(0)}KB -> ${(statAfter.size/1024).toFixed(0)}KB`);
      }
    } catch (err) {
      // Ignore non-standard image files
    }
  }
}

console.log(`\n🎉 Image compression complete! Total savings: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);

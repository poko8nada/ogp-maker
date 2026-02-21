import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const bucket = 'portfolio-bucket';
const sourceDir = path.resolve('./seeds/r2');

function uploadDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.name.startsWith('.')) continue;
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      uploadDir(fullPath);
    } else {
      const key = path.relative(sourceDir, fullPath);
      const cmd = `pnpm exec wrangler r2 object put "${bucket}/${key}" --file="${fullPath}"`;
      console.log(`Uploading: ${key}`);
      execSync(cmd, { stdio: 'inherit' });
    }
  }
}

console.log(`Seeding target`);
uploadDir(sourceDir);
console.log('Seeding done!');

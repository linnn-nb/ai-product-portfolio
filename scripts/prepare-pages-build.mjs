import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const client = path.join(root, 'dist', 'client');
const entry = path.join(client, 'index.html');

// GitHub Pages is static: give each case a real entrypoint for direct links and refresh.
for (const route of ['work/forgeax', 'work/forma']) {
  const directory = path.join(client, route);
  mkdirSync(directory, { recursive: true });
  copyFileSync(entry, path.join(directory, 'index.html'));
}
copyFileSync(entry, path.join(client, '404.html'));
writeFileSync(path.join(client, '.nojekyll'), '');
console.log('Prepared GitHub Pages: homepage and both direct case routes.');

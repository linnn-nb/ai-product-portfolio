import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { sitePath, routePath } from '../src/paths.mjs';

test('project-site navigation, assets and deep routes keep the repository prefix', () => {
  const base = '/ai-product-portfolio/';
  assert.equal(sitePath('/work/forma', base), '/ai-product-portfolio/work/forma');
  assert.equal(sitePath('/downloads/jinlin-hu-resume.pdf', base), '/ai-product-portfolio/downloads/jinlin-hu-resume.pdf');
  assert.equal(sitePath('/assets/forgeax-demo.wav', base), '/ai-product-portfolio/assets/forgeax-demo.wav');
  assert.equal(sitePath('/#work', base), '/ai-product-portfolio/#work');
  assert.equal(routePath('/ai-product-portfolio/work/forma/', base), '/work/forma');
  assert.equal(routePath('/ai-product-portfolio/', base), '');
  assert.equal(routePath('/work/forma/', '/'), '/work/forma');
  assert.equal(routePath('/ai-product-portfolio-other/', base), '/ai-product-portfolio-other');
});

test('both case URLs have real static entrypoints and the same application shell', () => {
  const home = readFileSync('dist/client/index.html', 'utf8');
  for (const route of ['work/forgeax', 'work/forma']) {
    assert.equal(readFileSync(`dist/client/${route}/index.html`, 'utf8'), home);
  }
  assert.equal(readFileSync('dist/client/404.html', 'utf8'), home);
  assert.ok(existsSync('dist/client/.nojekyll'));
});

test('built scripts, styles and font URLs resolve inside the selected Pages base', () => {
  const base = process.env.PAGES_BASE_PATH || '/';
  const home = readFileSync('dist/client/index.html', 'utf8');
  const assets = [...home.matchAll(/(?:src|href)="([^"\s]*\/assets\/[^"\s]+)"/g)].map(match => match[1]);
  assert.ok(assets.length >= 2, 'Expected the built JS and CSS references');
  for (const url of assets) {
    assert.ok(url.startsWith(base), `${url} must use ${base}`);
    assert.ok(existsSync(path.join('dist/client', url.slice(base.length))), `${url} must exist`);
  }
  const cssUrl = assets.find(url => url.endsWith('.css'));
  const css = readFileSync(path.join('dist/client', cssUrl.slice(base.length)), 'utf8');
  assert.ok(css.includes(`${base}assets/fonts/archivo-black.ttf`));
});

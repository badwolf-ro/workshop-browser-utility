// Copy Microsoft's official playwright-cli skill docs (shipped inside
// playwright-core) into skills/browser/reference/ so the skill can point at a
// copy that matches the installed CLI version. Run after upgrading @playwright/cli.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(ROOT, 'node_modules', '@playwright', 'cli', 'package.json'));
const corePkg = require.resolve('playwright-core/package.json');
const src = path.join(path.dirname(corePkg), 'lib', 'tools', 'skills', 'playwright-cli');
const dest = path.join(ROOT, 'skills', 'browser', 'reference', 'playwright-cli');

if (!fs.existsSync(src)) {
  console.error(`official skill not found at ${src}`);
  process.exit(1);
}
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
const version = require('playwright-core/package.json').version;
fs.writeFileSync(path.join(dest, 'VERSION'), `playwright-core ${version}\n`);
console.log(`synced official playwright-cli skill (playwright-core ${version}) -> ${path.relative(ROOT, dest)}`);

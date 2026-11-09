#!/usr/bin/env node
// run.mjs - run a one-shot Playwright script with a fresh browser.
//
//   node bin/run.mjs <script.mjs> [--headed] [--browser=chromium|firefox|webkit]
//                    [--state=auth.json] [--device="iPhone 15"] [-- script args...]
//
// The script never imports Playwright itself (it would not resolve from a
// scratch folder). It default-exports a function that receives everything:
//
//   export default async ({ page, context, browser, playwright, args, out }) => {
//     await page.goto('https://example.com');
//     await page.screenshot({ path: out('example.png') });
//     return { title: await page.title() };   // printed as JSON
//   };
//
// `out(name)` resolves a path inside the output folder (PW_OUT_DIR, default <repo>/.out).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as playwright from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.resolve(process.env.PW_OUT_DIR || path.join(ROOT, '.out'));

const opts = { headed: false, browser: 'chromium', state: null, device: null };
const args = [];
let file = null;
// Runner options may appear anywhere before `--`; everything after `--`
// (or any extra positional) is passed to the script as `args`.
let passthrough = false;
for (const a of process.argv.slice(2)) {
  if (passthrough) args.push(a);
  else if (a === '--') passthrough = true;
  else if (a === '--headed') opts.headed = true;
  else if (a.startsWith('--browser=')) opts.browser = a.slice(10);
  else if (a.startsWith('--state=')) opts.state = a.slice(8);
  else if (a.startsWith('--device=')) opts.device = a.slice(9);
  else if (!file) file = a;
  else args.push(a);
}

if (!file) {
  console.error('usage: node bin/run.mjs <script.mjs> [--headed] [--browser=...] [--state=...] [--device=...] [-- args]');
  process.exit(2);
}

const engine = playwright[opts.browser];
if (!engine) {
  console.error(`unknown browser "${opts.browser}" (use chromium, firefox or webkit)`);
  process.exit(2);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const out = (name = '') => path.join(OUT_DIR, name);

const mod = await import(pathToFileURL(path.resolve(file)).href);
const fn = mod.default;
if (typeof fn !== 'function') {
  console.error(`${file} must default-export an async function`);
  process.exit(2);
}

const browser = await engine.launch({ headless: !opts.headed });
let exitCode = 0;
try {
  const contextOptions = {
    ...(opts.device ? playwright.devices[opts.device] : {}),
    ...(opts.state ? { storageState: opts.state } : {}),
  };
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const result = await fn({ page, context, browser, playwright, args, out });
  if (result !== undefined) console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error(err?.stack || String(err));
  exitCode = 1;
} finally {
  await browser.close();
}
process.exit(exitCode);

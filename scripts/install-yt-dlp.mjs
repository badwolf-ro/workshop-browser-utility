// Download the latest standalone yt-dlp build for this platform into vendor/.
// Re-run to upgrade (or use `bin/ytdl -U`). ffmpeg is needed separately for
// merging video+audio and converting formats (`brew install ffmpeg` on macOS).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const builds = { darwin: 'yt-dlp_macos', win32: 'yt-dlp.exe', linux: 'yt-dlp_linux' };
const asset = builds[process.platform];
if (!asset) {
  console.error(`no yt-dlp build for platform ${process.platform}`);
  process.exit(1);
}
const dest = path.join(ROOT, 'vendor', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
const url = `https://github.com/yt-dlp/yt-dlp/releases/latest/download/${asset}`;

const res = await fetch(url);
if (!res.ok) {
  console.error(`download failed: ${res.status} ${url}`);
  process.exit(1);
}
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
fs.chmodSync(dest, 0o755);
console.log(`installed ${asset} -> ${path.relative(ROOT, dest)}`);

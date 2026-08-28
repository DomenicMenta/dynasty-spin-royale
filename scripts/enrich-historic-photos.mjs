import { writeFile } from 'node:fs/promises';
import { PLAYER_POOL } from '../app/players.generated.ts';

const missing = [...new Set(PLAYER_POOL.filter(player => !player.photo).map(player => player.name))];
const overrides = {};
let cursor = 0;

async function findPhoto(name) {
  const endpoint = `https://site.web.api.espn.com/apis/search/v2?query=${encodeURIComponent(name)}&limit=10`;
  const response = await fetch(endpoint);
  if (!response.ok) return;
  const payload = await response.json();
  const players = payload.results?.find(result => result.type === 'player')?.contents ?? [];
  const match = players.find(item =>
    item.displayName?.toLowerCase() === name.toLowerCase() &&
    item.description === 'NFL' &&
    item.image?.default?.includes('/headshots/nfl/players/')
  );
  if (!match) return;
  const image = await fetch(match.image.default, { method: 'HEAD' });
  if (image.ok && image.headers.get('content-type')?.startsWith('image/')) overrides[name] = match.image.default;
}

async function worker() {
  while (cursor < missing.length) {
    const name = missing[cursor++];
    try { await findPhoto(name); } catch {}
  }
}

await Promise.all(Array.from({ length: 12 }, worker));
const sorted = Object.fromEntries(Object.entries(overrides).sort(([a], [b]) => a.localeCompare(b)));
await writeFile('app/historic-photo-overrides.ts', `// Curated transparent NFL player cutouts from ESPN's player image service.\nexport const HISTORIC_PHOTOS:Record<string,string>=${JSON.stringify(sorted, null, 2)};\n`);
console.log(`Matched ${Object.keys(sorted).length} of ${missing.length} missing historic players.`);

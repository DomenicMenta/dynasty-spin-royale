import { env } from 'cloudflare:workers';
import { dynastyResultsSchema, dynastyValueIndex } from '@/db/schema';

const allowedOrigins = new Set([
  'https://domenicmenta.github.io',
  'https://dynasty-spin.domenictommenta.chatgpt.site',
]);

function cors(request: Request) {
  const origin = request.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': allowedOrigins.has(origin) ? origin : 'https://domenicmenta.github.io',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

async function prepareDatabase() {
  await env.DB.batch([
    env.DB.prepare(dynastyResultsSchema),
    env.DB.prepare(dynastyValueIndex),
  ]);
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: cors(request) });
}

export async function GET(request: Request) {
  await prepareDatabase();
  const [total, leaders] = await Promise.all([
    env.DB.prepare('SELECT COUNT(*) AS count FROM dynasty_results').first<{count:number}>(),
    env.DB.prepare("SELECT draft_name AS name, franchise_value AS franchiseValue, roster_points AS rosterPoints, unspent_dv AS unspentDV, created_at AS createdAt FROM dynasty_results WHERE draft_name IS NOT NULL AND TRIM(draft_name) != '' ORDER BY franchise_value DESC, created_at ASC LIMIT 100").all(),
  ]);
  return Response.json({ total: total?.count || 0, leaderboard: leaders.results.map((row,index)=>({ rank:index+1,...row })) }, { headers: cors(request) });
}

export async function POST(request: Request) {
  const headers = cors(request);
  let body: { id?: unknown; draftName?: unknown; franchiseValue?: unknown; rosterPoints?: unknown; unspentDV?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid result.' }, { status: 400, headers }); }

  const id = typeof body.id === 'string' ? body.id.slice(0, 80) : '';
  const draftName = typeof body.draftName === 'string' ? body.draftName.trim().replace(/\s+/g,' ').slice(0, 24) : '';
  const franchiseValue = Number(body.franchiseValue);
  const rosterPoints = Number(body.rosterPoints);
  const unspentDV = Number(body.unspentDV);
  if (!id || draftName.length < 2 || !Number.isFinite(franchiseValue) || franchiseValue < 500 || franchiseValue > 4000 || !Number.isFinite(rosterPoints) || !Number.isInteger(unspentDV) || unspentDV < 0 || unspentDV > 130) {
    return Response.json({ error: 'Result outside the valid game range.' }, { status: 422, headers });
  }

  await prepareDatabase();
  await env.DB.batch([
    env.DB.prepare('INSERT OR IGNORE INTO dynasty_results (id, franchise_value, roster_points, unspent_dv, draft_name) VALUES (?, ?, ?, ?, ?)').bind(id, franchiseValue, rosterPoints, unspentDV, draftName),
    env.DB.prepare('UPDATE dynasty_results SET draft_name = COALESCE(draft_name, ?) WHERE id = ?').bind(draftName, id),
  ]);
  const saved = await env.DB.prepare('SELECT franchise_value AS value FROM dynasty_results WHERE id = ?').bind(id).first<{value:number}>();
  if (!saved) return Response.json({ error: 'Result could not be ranked.' }, { status: 500, headers });

  const [totalRow, higherRow] = await env.DB.batch([
    env.DB.prepare('SELECT COUNT(*) AS count FROM dynasty_results'),
    env.DB.prepare('SELECT COUNT(*) AS count FROM dynasty_results WHERE franchise_value > ?').bind(saved.value),
  ]);
  const total = Number(totalRow.results[0]?.count || 1);
  const rank = Number(higherRow.results[0]?.count || 0) + 1;
  const percentile = Math.max(1, Math.ceil(((rank - 1) / total) * 100));
  return Response.json({ total, rank, percentile, franchiseValue: saved.value }, { headers });
}

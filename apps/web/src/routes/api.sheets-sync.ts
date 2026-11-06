import { apiError, json, withApi } from '@/lib/api.server';
import { getBackend, sameOrigin } from '@/lib/snbm-submission.server';
import { mirrorSavedRecord, sheetsMirrorConfigured } from '@/lib/snbm-sheets.server';
import { clientIdentifier, createRateLimiter } from '@/lib/rate-limit.server';

const allowSync = createRateLimiter({ maxRequests: 10, windowSeconds: 3600 });

/**
 * POST-only recovery for previously saved Supabase submissions.
 * Only a validated Supabase Auth user listed in snbm_admins may trigger syncing.
 * Each invocation handles up to 6 unsynced records per type (12 total).
 */
export const action = withApi(async ({ request }) => {
  if (request.method !== 'POST') return apiError(405, 'Method not allowed.');
  if (!sameOrigin(request)) return apiError(403, 'Origin tidak diizinkan.');
  const header = request.headers.get('authorization') || '';
  if (!/^Bearer\s+\S+$/i.test(header)) return apiError(401, 'Login admin diperlukan.');
  if (!await allowSync(clientIdentifier(request))) return apiError(429, 'Terlalu banyak permintaan sinkronisasi.');

  const token = header.replace(/^Bearer\s+/i, '');
  const db = getBackend();
  const { data: identity, error: authError } = await db.auth.getUser(token);
  if (authError || !identity.user) return apiError(401, 'Sesi admin kedaluwarsa.');
  const { data: member, error: memberError } = await db.from('snbm_admins')
    .select('user_id').eq('user_id', identity.user.id).maybeSingle();
  if (memberError || !member) return apiError(403, 'Akun ini tidak mempunyai izin admin.');
  if (!sheetsMirrorConfigured()) return apiError(503, 'Token Google Sheets belum dikonfigurasi di Hostinger.');

  const results: Record<string, { synced: number; failed: number; pending: number }> = {};
  for (const [type, table] of [
    ['host', 'snbm_host_applications'],
    ['brand', 'snbm_enquiries'],
  ] as const) {
    const { data: pending, error: listError } = await db.from(table)
      .select('*').is('sheets_synced_at', null)
      .order('created_at', { ascending: true }).limit(6);
    if (listError) return apiError(503, 'Tidak dapat membaca data untuk sinkronisasi.');
    let synced = 0;
    let failed = 0;
    for (const record of pending || []) {
      if (await mirrorSavedRecord(type, record)) synced += 1;
      else failed += 1;
    }
    const { count, error: countError } = await db.from(table)
      .select('id', { count: 'exact', head: true }).is('sheets_synced_at', null);
    if (countError) return apiError(503, 'Gagal memeriksa antrean sinkronisasi.');
    results[type] = { synced, failed, pending: count ?? 0 };
  }
  return json({ ok: results.host.failed === 0 && results.brand.failed === 0,
    host: results.host, brand: results.brand });
});

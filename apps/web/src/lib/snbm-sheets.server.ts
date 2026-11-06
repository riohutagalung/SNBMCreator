import { getAdminSupabase } from '@/lib/supabase-client.server';

/**
 * Trusted server-only Google Apps Script mirror.
 * Supabase is the source of truth: failed deliveries remain unsynced, not lost.
 * The deployed /exec URL is public configuration, NOT an authentication secret.
 * The shared token is provided ONLY through Hostinger environment variables.
 */
const DEFAULT_SHEETS_WEBAPP =
  'https://script.google.com/macros/s/AKfycbyfAs-Ic_P4_FvmA3KlMTsbbd_z5AgBV-LVqQQ7p8nlT6gd7jAOkPFkFruiGhBa7S7acA/exec';

type SheetType = 'host' | 'brand';
type SavedRecord = { id: string; [key: string]: unknown };
const tables: Record<SheetType, string> = {
  host: 'snbm_host_applications',
  brand: 'snbm_enquiries',
};

function endpoint(): string | null {
  const configured = (process.env.SNBM_SHEETS_WEBAPP_URL || DEFAULT_SHEETS_WEBAPP).trim();
  try {
    const url = new URL(configured);
    if (url.protocol !== 'https:' || url.hostname !== 'script.google.com' ||
        !/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname) ||
        url.search || url.hash || url.username || url.password) return null;
    return url.toString();
  } catch { return null; }
}

export function sheetsMirrorConfigured(): boolean {
  return Boolean(endpoint() && process.env.SNBM_SHEETS_API_TOKEN?.length &&
    process.env.SNBM_SHEETS_API_TOKEN.length >= 32);
}

/**
 * The Sheet needs permanent clickable links, but the actual CV/video paths stay
 * private in Supabase. The visitor must authenticate as an SNBM admin and pass
 * RLS before the website can mint a 60-second signed download URL.
 */
function sheetFriendlyRecord(type: SheetType, record: SavedRecord): SavedRecord {
  if (type !== 'host') return record;
  const base = 'https://snbmcreator.com/berkas-host';
  const urlFor = (kind: 'cv' | 'video', path: unknown) =>
    typeof path === 'string' && path.length > 0
      ? base + '?id=' + encodeURIComponent(record.id) + '&jenis=' + kind
      : '';
  return {
    ...record,
    cv_path: urlFor('cv', record.cv_path),
    trial_video_path: urlFor('video', record.trial_video_path),
  };
}

async function deliverToSheet(type: SheetType, record: SavedRecord): Promise<boolean> {
  const token = process.env.SNBM_SHEETS_API_TOKEN;
  const url = endpoint();
  if (!token || token.length < 32 || !url) return false;
  try {
    // Apps Script's ContentService may redirect to googleusercontent.com.
    // Only the initial HTTPS POST carries the token; the redirect is a GET.
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: JSON.stringify({ token, type, record: sheetFriendlyRecord(type, record) }),
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
      cache: 'no-store',
    });
    if (!response.ok) return false;
    const result: unknown = await response.json();
    return Boolean(result && typeof result === 'object' &&
      'ok' in result && result.ok === true &&
      'id' in result && result.id === record.id);
  } catch {
    // Do not log the token or applicants' details.
    return false;
  }
}

/**
 * Upsert into the corresponding sheet by Supabase UUID, then mark delivered.
 * Repeated calls are safe: Apps Script preserves manual Status/Notes columns.
 */
export async function mirrorSavedRecord(type: SheetType, record: SavedRecord): Promise<boolean> {
  if (!record.id || !await deliverToSheet(type, record)) return false;
  try {
    const db = getAdminSupabase();
    if (!db) return false;
    const { error } = await db.from(tables[type])
      .update({ sheets_synced_at: new Date().toISOString() })
      .eq('id', record.id);
    return !error;
  } catch { return false; }
}

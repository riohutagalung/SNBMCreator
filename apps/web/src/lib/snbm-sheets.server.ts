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

function endpoint(type: SheetType = 'host'): string | null {
  // Both Host and Brand use the existing Apps Script deployment by default.
  // A dedicated Host endpoint remains an optional override; no new deployment
  // or environment variable is needed for the supplied existing Apps Script.
  const configured = ((type === 'host' && process.env.SNBM_HOST_DRIVE_WEBAPP_URL)
    || process.env.SNBM_SHEETS_WEBAPP_URL || DEFAULT_SHEETS_WEBAPP).trim();
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
 * Host files remain private in Supabase as a reliable fallback. The receiver
 * archives them to restricted Google Drive and writes durable Drive file links
 * into Sheet columns Q/R; temporary source URLs never appear in Sheet cells.
 */
async function sheetFriendlyRecord(type: SheetType, record: SavedRecord): Promise<SavedRecord> {
  if (type !== 'host') return record;
  const base = 'https://snbmcreator.com/berkas-host';
  const urlFor = (kind: 'cv' | 'video', path: unknown) =>
    typeof path === 'string' && path.length > 0
      ? base + '?id=' + encodeURIComponent(record.id) + '&jenis=' + kind
      : '';
  // Temporary source URLs are sent server-to-server only. The Apps Script
  // downloads the objects into private Google Drive and writes permanent Drive
  // links into the Sheet. Never put signed URLs in Sheet cells or browser JSON.
  const db = getAdminSupabase();
  if (!db) throw new Error('Supabase backend unavailable');
  const files: Record<string, { url: string; name: string } | null> = { cv: null, video: null };
  for (const [kind, path] of [
    ['cv', record.cv_path],
    ['video', record.trial_video_path],
  ] as const) {
    if (typeof path !== 'string' || !path) continue;
    const { data, error } = await db.storage.from('snbm-host-private')
      .createSignedUrl(path, 600);
    if (error || !data?.signedUrl) throw new Error('Cannot prepare private file for Drive');
    const ext = path.split('.').pop()?.replace(/[^a-z0-9]/gi, '') || (kind === 'cv' ? 'pdf' : 'mp4');
    files[kind] = { url: data.signedUrl, name: (kind === 'cv' ? 'CV' : 'Video') + '_' + record.id + '.' + ext };
  }
  return {
    ...record,
    // Legacy stable admin links remain for an old Apps Script deployment.
    // The updated Apps Script replaces these with permanent private Drive URLs.
    cv_path: urlFor('cv', record.cv_path),
    trial_video_path: urlFor('video', record.trial_video_path),
    _drive_files: files,
  };
}

async function deliverToSheet(type: SheetType, record: SavedRecord): Promise<boolean> {
  const token = process.env.SNBM_SHEETS_API_TOKEN;
  const url = endpoint(type);
  if (!token || token.length < 32 || !url) return false;
  try {
    // Apps Script's ContentService may redirect to googleusercontent.com.
    // Only the initial HTTPS POST carries the token; the redirect is a GET.
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: JSON.stringify({ token, type, record: await sheetFriendlyRecord(type, record) }),
      redirect: 'follow',
      signal: AbortSignal.timeout(type === 'host' ? 90000 : 12000),
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

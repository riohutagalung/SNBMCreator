/**
 * Public, low-latency website settings from the existing PocketBase CMS.
 * Falls back safely while PocketBase is offline or before the migration is applied.
 * Never sends privileged PocketBase credentials to visitors.
 */
export async function getPublicSiteSettings(keys: readonly string[]): Promise<Record<string, string>> {
  const endpoint = process.env.POCKETBASE_URL;
  if (!endpoint || !keys.length) return {};
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1400);
  try {
    const query = new URLSearchParams({
      page: '1',
      perPage: '100',
      fields: 'key,value',
      filter: keys.map(key => `key = "${key.replace(/[^a-zA-Z0-9_]/g, '')}"`).join(' || '),
    });
    const response = await fetch(`${endpoint.replace(/\/$/, '')}/api/collections/snbm_content/records?${query}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) return {};
    const result = await response.json() as { items?: Array<{ key: string; value: string }> };
    const allowed = new Set(keys);
    return Object.fromEntries((result.items ?? []).filter(item => allowed.has(item.key))
      .map(item => [item.key, String(item.value ?? '')]));
  } catch {
    return {};
  } finally {
    clearTimeout(timeout);
  }
}

/** Prevent unsafe document URLs being injected through editable CMS fields. */
export function safeBrandAssetUrl(value: string | undefined, fallback: string): string {
  const url = (value ?? '').trim();
  if (url.startsWith('/') && !url.startsWith('//') && !/[<>"'`\\]/.test(url)) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' && !parsed.username && !parsed.password) return parsed.href;
  } catch { /* CMS value is not a URL */ }
  return fallback;
}

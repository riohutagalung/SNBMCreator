import { getPublicSupabase } from '@/lib/supabase-client.server';
import { articles as legacyArticles } from '@/data/content';
import type { Article } from '@/lib/articles';

const fallback: Article[] = legacyArticles.map((article, index) => ({
  id: 'legacy-' + article.slug,
  slug: article.slug, title: article.title, title_en: '',
  tag: article.tag, tag_en: '', excerpt: article.excerpt, excerpt_en: '',
  body: article.paragraphs.join('\n\n'), body_en: '',
  image_url: index === 0 ? '/assets/snbm/regular-hijab.webp' : '/assets/snbm/hero-tas-wanita.webp',
  image_alt: article.title, published: true,
  published_at: '2026-11-05T08:00:00+07:00',
  created_at: '2026-11-05T08:00:00+07:00',
  updated_at: '2026-11-05T08:00:00+07:00'
}));

/** Always respect the published flag; fallback is used only when the DB is unreachable. */
export async function getPublishedArticles(): Promise<Article[]> {
  const db = getPublicSupabase();
  if (!db) return fallback;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);
  try {
    const { data, error } = await db.from('snbm_articles').select('*')
      .eq('published', true).order('published_at', { ascending: false })
      .limit(100).abortSignal(controller.signal);
    if (error) return [];
    return (data ?? []) as Article[];
  } catch { return []; }
  finally { clearTimeout(timer); }
}
export async function getPublishedArticle(slug: string): Promise<Article | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) return null;
  const db = getPublicSupabase();
  if (!db) return fallback.find(a => a.slug === slug) ?? null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);
  try {
    const { data, error } = await db.from('snbm_articles').select('*')
      .eq('slug', slug).eq('published', true)
      .abortSignal(controller.signal).maybeSingle();
    if (error) return null;
    return data as Article | null;
  } catch { return null; }
  finally { clearTimeout(timer); }
}

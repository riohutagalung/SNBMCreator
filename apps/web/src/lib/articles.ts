/** Public article model; private drafts never appear in server/public route responses. */
export interface Article {
  id: string;
  slug: string;
  title: string;
  title_en: string;
  tag: string;
  tag_en: string;
  excerpt: string;
  excerpt_en: string;
  body: string;
  body_en: string;
  image_url: string;
  image_alt: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
export function articleDate(date: string | null | undefined, english = false): string {
  if (!date) return '';
  const parsed = new Date(date);
  if (!Number.isFinite(parsed.getTime())) return '';
  return new Intl.DateTimeFormat(english ? 'en-US' : 'id-ID', {
    timeZone: 'Asia/Jakarta', year: 'numeric', month: 'long', day: 'numeric'
  }).format(parsed);
}
export function articleImage(url: string | null | undefined): string {
  const value = (url || '').trim();
  if (value.startsWith('/') && !value.startsWith('//') && !/[<>"'\x00-\x1F]/.test(value)) return value;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === 'https:' && !parsed.username && !parsed.password) return parsed.href;
  } catch { /* Invalid image URL: omit image. */ }
  return '';
}
export function articleText(article: Article, english = false) {
  return {
    title: english && article.title_en ? article.title_en : article.title,
    excerpt: english && article.excerpt_en ? article.excerpt_en : article.excerpt,
    tag: english && article.tag_en ? article.tag_en : article.tag,
    body: english && article.body_en ? article.body_en : article.body,
    date: articleDate(article.published_at || article.created_at, english)
  };
}

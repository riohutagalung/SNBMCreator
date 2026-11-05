import type { Route } from './+types/sitemap.xml';
import { siteOrigin } from '@/lib/site-origin.server';
import { getProducts } from '@/api/ecommerce-api';
import { articles } from '@/data/content';

type SitemapEntry = {
	path: string;
	lastmod?: string;
};

const STATIC_PATHS = ['/', '/layanan', '/kontak', '/gabung-host', '/blog'];

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function toLoc(origin: string, path: string): string {
	return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

function serializeSitemap(origin: string, entries: SitemapEntry[]): string {
	const urls = entries
		.map(entry => {
			const loc = escapeXml(toLoc(origin, entry.path));
			const lastmod = entry.lastmod
				? `\n\t\t<lastmod>${escapeXml(entry.lastmod)}</lastmod>`
				: '';

			return `\t<url>\n\t\t<loc>${loc}</loc>${lastmod}\n\t</url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * Public dynamic URLs (blog posts, PDPs, articles).
 * Return `{ path, lastmod }` in the same change that adds a collection.
 * Return `[]` only while the site has no public records; clear those URLs
 * again in the same change that removes the collection.
 */
async function getDynamicEntries(): Promise<SitemapEntry[]> {
 const entries = new Map<string, SitemapEntry>();
 let offset = 0;
 try {
  for (;;) {
   const {products,count} = await getProducts({exclude_types:'subscription',limit:2000,offset});
   for(const p of products) if(!p.seo.noindex) entries.set(p.id,{path:`/product/${p.url_handle}`,lastmod:p.updated_at||undefined});
   offset += products.length;
   if(offset >= count || !products.length) break;
  }
 } catch {
  // Do not turn the entire public sitemap into a 5xx when the store API is offline.
  console.warn('SNBM Creator sitemap: external store catalogue unavailable.');
 }
 return [...entries.values(), ...articles.map(a=>({path:`/blog/${a.slug}`,lastmod:'2026-11-05'}))];
}

export async function loader({ request }: Route.LoaderArgs) {
	const origin = siteOrigin(request);
	const entries: SitemapEntry[] = [
		...STATIC_PATHS.map(path => ({ path })),
		...(await getDynamicEntries()),
	];

	return new Response(serializeSitemap(origin, entries), {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
			'Access-Control-Allow-Origin': '*',
		},
	});
}

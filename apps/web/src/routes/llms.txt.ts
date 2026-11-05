import type { Route } from './+types/llms.txt';
import { siteOrigin } from '@/lib/site-origin.server';
import { articles } from '@/data/content';
export function loader({request}:Route.LoaderArgs){const origin=siteOrigin(request);return new Response(`# SNBM Creator\n\n> Agensi host live shopping fashion berbasis di Jakarta Barat.\n\n## Halaman\n- [Layanan](${origin}/layanan): Paket live shopping dan janji temu.\n- [Kontak](${origin}/kontak): Kolaborasi brand dan pendaftaran host.
- [Gabung Host](${origin}/gabung-host): Pendaftaran host full time dan freelance.\n- [Insight](${origin}/blog): Panduan untuk brand dan creator.\n${articles.map(a=>`- [${a.title}](${origin}/blog/${a.slug}): ${a.excerpt}`).join('\n')}\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});}

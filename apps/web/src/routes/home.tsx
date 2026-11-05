import type { CSSProperties } from 'react';
import { data } from 'react-router';
import type { Route } from './+types/home';
import { seo } from '@/lib/seo';
import { heroImage } from '@/data/content';
import { pocketbaseAdmin } from '@/lib/pocketbase-client.server';
import { Hero } from '@/components/home/hero';
import { Agency } from '@/components/home/agency';
import { Hosts } from '@/components/home/hosts';
import { Performance } from '@/components/home/performance';
import { Insights } from '@/components/home/insights';
import { Collaborate } from '@/components/home/collaborate';

export async function loader() {
  const content: Record<string, string> = {};
  // Do not block the public homepage on a local PocketBase port when the
  // external backend has not been configured. Credentials alone do not
  // establish a reachable backend.
  if (process.env.POCKETBASE_URL && process.env.PB_SUPERUSER_EMAIL && process.env.PB_SUPERUSER_PASSWORD) {
    try {
      const result = await pocketbaseAdmin.listRecords<{ key: string; value: string }>('snbm_content', { perPage: 200 });
      for (const record of result.items) content[record.key] = record.value || '';
    } catch {
      // PocketBase unavailable: render safe defaults until backend connectivity is configured.
    }
  }
  // Content changes should not remain hidden behind a cached homepage response.
  return data({ content }, { headers: { 'Cache-Control': 'private, no-store, max-age=0, must-revalidate' } });
}

export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'SNBM Creator — Host yang Tepat, Brand Makin Hebat',
    description: 'Agensi host live shopping di Jakarta Barat. Hubungkan brand fashion Anda dengan host reguler dan big size, hijab maupun nonhijab, bersama SNBM Creator.',
    image: heroImage,
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'SNBM Creator' },
      { '@context': 'https://schema.org', '@type': 'Organization', name: 'SNBM Creator', description: 'Agensi host creator live shopping berbasis di Jakarta Barat.' },
    ],
  });
}

const validHex = (value: string | undefined, fallback: string) =>
  value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const content = loaderData.content;
  const themeStyle = {
    '--blue': validHex(content.theme_primary, '#2456ff'),
    '--navy': validHex(content.theme_navy, '#111a33'),
    '--paper': validHex(content.theme_paper, '#f3f4f7'),
  } as CSSProperties;

  return (
    <main style={themeStyle}>
      <Hero content={content} />
      <Agency content={content} />
      <Hosts content={content} />
      <Performance content={content} />
      <Insights />
      <Collaborate content={content} />
    </main>
  );
}

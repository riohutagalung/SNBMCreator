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
	try {
		const res = await pocketbaseAdmin.listRecords<{ key: string; value: string }>('snbm_content', { perPage: 200 });
		for (const r of res.items) content[r.key] = r.value || '';
	} catch {
		// PocketBase not ready yet; components fall back to defaults.
	}
	return { content };
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

export default function HomePage({ loaderData }: Route.ComponentProps) {
	return <main><Hero content={loaderData.content} /><Agency /><Hosts /><Performance /><Insights /><Collaborate /></main>;
}

import { useEffect, type CSSProperties } from 'react';
import { data, useNavigate } from 'react-router';
import type { Route } from './+types/home';
import { seo } from '@/lib/seo';
import { heroImage } from '@/data/content';
import { getPublicSupabase } from '@/lib/supabase-client.server';
import { Hero } from '@/components/home/hero';
import { HostCampaign } from '@/components/home/host-campaign';
import { Agency } from '@/components/home/agency';
import { Hosts } from '@/components/home/hosts';
import { Performance } from '@/components/home/performance';
import { Insights } from '@/components/home/insights';
import { Collaborate } from '@/components/home/collaborate';

export async function loader() {
  const content: Record<string, string> = {};
  const client = getPublicSupabase();
  if (client) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);
    try {
      const { data: rows } = await client.from('snbm_content').select('key,value').abortSignal(controller.signal);
      for (const row of rows ?? []) content[row.key] = row.value || '';
    } catch { /* Safe fallback when migration is not yet applied. */ }
    finally { clearTimeout(timeout); }
  }
  // Content changes should not remain hidden behind a cached homepage response.
  return data({ content }, { headers: { 'Cache-Control': 'private, no-store, max-age=0, must-revalidate' } });
}

export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'SNBM Creator | Fashion Seller & Live Commerce Agency',
    description: 'SNBM Creator adalah seller produk fashion sekaligus agensi pengembangan host in-house full time dan freelance untuk live shopping.',
    image: heroImage,
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'SNBM Creator', url:'https://snbmcreator.com/', inLanguage:['id-ID','en-US'] },
      { '@context': 'https://schema.org', '@type': 'Organization', '@id':'https://snbmcreator.com/#organization', name:'SNBM Creator', url:'https://snbmcreator.com/', email:'contact@snbmcreator.com',logo:'https://snbmcreator.com/assets/snbm/logo.png',address:{'@type':'PostalAddress',addressLocality:'Jakarta Barat',addressRegion:'DKI Jakarta',addressCountry:'ID'},description:'Seller fashion dan agensi pengembangan host live commerce in-house serta freelance.' },
      { '@context': 'https://schema.org', '@type': 'Service', serviceType:'Live commerce host development', name:'Pengembangan host live shopping',provider:{'@id':'https://snbmcreator.com/#organization'},areaServed:{'@type':'Country',name:'Indonesia'} },
      { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity:[{'@type':'Question',name:'Apa bidang usaha SNBM Creator?',acceptedAnswer:{'@type':'Answer',text:'SNBM Creator adalah seller produk fashion sekaligus agensi pengembangan host live shopping.'}},{'@type':'Question',name:'Apakah menerima host full time dan freelance?',acceptedAnswer:{'@type':'Answer',text:'Pendaftaran tersedia untuk host in-house full time dan freelance part time melalui snbmcreator.com/gabung-host.'}},{'@type':'Question',name:'Bagaimana menghubungi SNBM Creator?',acceptedAnswer:{'@type':'Answer',text:'Email contact@snbmcreator.com atau gunakan formulir kontak di snbmcreator.com/kontak.'}}] },
    ],
  });
}

const validHex = (value: string | undefined, fallback: string) =>
  value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  useEffect(() => {
    // Previously shared /#host links should open the dedicated host page.
    if (window.location.hash === '#host') navigate('/pilihan-host', { replace: true });
  }, [navigate]);
  const content = loaderData.content;
  const themeStyle = {
    '--blue': validHex(content.theme_primary, '#2456ff'),
    '--navy': validHex(content.theme_navy, '#111a33'),
    '--paper': validHex(content.theme_paper, '#f3f4f7'),
  } as CSSProperties;

  return (
    <main style={themeStyle}>
      <Hero content={content} />
      <HostCampaign />
      <Agency content={content} />
      <Hosts content={content} />
      <Performance content={content} />
      <Insights />
      <Collaborate content={content} />
    </main>
  );
}
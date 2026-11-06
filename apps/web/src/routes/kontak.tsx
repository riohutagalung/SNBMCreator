import { data } from 'react-router';
import type { Route } from './+types/kontak';
import { seo } from '@/lib/seo';
import { ContactForm } from '@/components/contact-form';
import { getPublicSiteSettings } from '@/lib/site-settings.server';

export function meta({matches,location}:Route.MetaArgs) {
  return seo({matches,location},{
    title:'Kontak & Kolaborasi Brand | SNBM Creator',
    description:'Informasi kolaborasi brand dan pendaftaran talenta host live shopping SNBM Creator.',
  });
}

/** Always closed unless the owner explicitly opens brand enquiries in PocketBase. */
export async function loader() {
  const brandSettings = await getPublicSiteSettings([
    'brand_form_enabled',
    'brand_coming_soon_title_id', 'brand_coming_soon_title_en',
    'brand_coming_soon_body_id', 'brand_coming_soon_body_en',
  ]);
  return data({ brandSettings }, { headers: { 'Cache-Control': 'private, no-store, max-age=0' } });
}
export default function Contact({loaderData}:Route.ComponentProps) {
  return <ContactForm brandSettings={loaderData.brandSettings}/>;
}

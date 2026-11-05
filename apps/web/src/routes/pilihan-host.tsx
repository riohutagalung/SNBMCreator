import type { Route } from './+types/pilihan-host';
import { Hosts } from '@/components/home/hosts';
import { seo } from '@/lib/seo';
import { useLanguage } from '@/lib/language';
export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'Pilihan Host | SNBM Creator',
    description: 'Kenali empat kategori penampilan host live shopping: reguler dan big size, hijab dan nonhijab. Cari yang sesuai untuk kebutuhan brand.',
  });
}
export default function PilihanHost() {
  const { pick } = useLanguage();
  return <main className="host-directory page-rail">
    <div className="host-directory-intro"><span className="eyebrow">{pick('PILIHAN HOST','HOST PROFILES')}</span>
      <h1>{pick('Temukan gaya yang sesuai.','Find the right fit.')}</h1>
      <p className="page-intro">{pick('Pilih kategori penampilan host untuk membantu menentukan kebutuhan sesi live brand.','Explore different host presentation categories to find a fit for your live-shopping plans.')}</p></div>
    <Hosts/>
  </main>;
}
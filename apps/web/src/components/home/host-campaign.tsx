import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/lib/language';

export function HostCampaign() {
  const { pick } = useLanguage();
  return <section className="host-campaign section-rail snbm-recruitment" aria-labelledby="recruitment-title">
    <div className="campaign-photo">
      <img src="/assets/snbm/host-campaign.webp?v=4k3" alt={pick('Ilustrasi empat gaya host fashion: reguler dan big size, hijab dan nonhijab','Fashion host categories: regular and plus size, hijab and non-hijab')} width="3840" height="2160" loading="lazy"/>
    </div>
    <div className="campaign-copy">
      <span className="eyebrow">OPEN RECRUITMENT</span>
      <h2 id="recruitment-title">{pick('Jadi host live bersama SNBM Creator.','Join the SNBM Creator host team.')}</h2>
      <p>{pick('Kami membuka kesempatan untuk host in-house full time dan freelance part time. Ceritakan pengalamanmu dan kirim contoh video saat live.','We welcome full-time in-house hosts and part-time freelancers. Tell us about your experience and submit a live-hosting sample.')}</p>
      <Link to="/gabung-host" className="button light">{pick('Daftar sekarang','Apply now')} <ArrowUpRight size={19}/></Link>
    </div>
  </section>;
}
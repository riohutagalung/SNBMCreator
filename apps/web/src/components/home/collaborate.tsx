import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/lib/language';
export function Collaborate({ content: _content }: { content?: Record<string, string> }) {
  const { pick } = useLanguage();
  return <section className="collaborate section-rail">
    <span className="eyebrow">{pick('MULAI DARI PERCAKAPAN YANG JELAS','START WITH A CONVERSATION')}</span>
    <h2>{pick('Jualan, live,','Selling, hosting,')}<br/><span>{pick('atau kerja sama?','or working together?')}</span></h2>
    <div><Link className="button light" to="/kontak?jenis=brand">{pick('Saya mewakili brand','I represent a brand')} <ArrowUpRight size={20}/></Link><Link className="button outline-light" to="/kontak?jenis=host">{pick('Saya ingin jadi host','I want to become a host')} <ArrowUpRight size={20}/></Link></div>
    <p className="platform-note">{pick('Pilih formulir yang sesuai. Kami akan meninjau informasi yang kamu kirim.','Choose the relevant form. We will review your enquiry.')}</p>
  </section>;
}
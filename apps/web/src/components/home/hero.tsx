import { Link } from 'react-router';
import { ArrowUpRight, ArrowDown, Radio } from 'lucide-react';
import { useLanguage } from '@/lib/language';

export function Hero({ content: _content }: { content?: Record<string, string> }) {
  const { pick } = useLanguage();
  return <section className="hero" id="beranda">
    <div className="hero-top"><span className="eyebrow"><span className="live-dot"/> {pick('SELLER FASHION & AGENSI LIVE COMMERCE','FASHION SELLER & LIVE COMMERCE AGENCY')}</span><span className="location">JAKARTA BARAT · INDONESIA</span></div>
    <div className="hero-copy">
      <h1>{pick('Kami jual produk.','We sell fashion.')}<br/><span>{pick('Kami bangun host.','We develop hosts.')}</span></h1>
      <div className="hero-intro"><p>{pick('SNBM Creator menjalankan penjualan fashion sekaligus membina host untuk live shopping. Tim in-house kami hadir untuk operasional harian, sementara host freelance bisa bergabung sesuai kebutuhan sesi dan kampanye.','SNBM Creator sells fashion products and develops live-shopping hosts. Our in-house team supports daily operations, while freelance hosts join sessions and campaigns as needed.')}</p>
        <Link className="button" to="/kontak?jenis=brand">{pick('Kerja sama untuk brand','Partner with us')} <ArrowUpRight size={19}/></Link>
        <Link className="text-link" to="/gabung-host">{pick('Ingin jadi host? Lihat pendaftaran','Want to host? Apply here')} <ArrowUpRight size={15}/></Link>
      </div>
    </div>
    <div className="hero-media hero-media-refresh">
      <video autoPlay muted loop playsInline preload="metadata" poster="/assets/snbm/hero-still.webp" aria-label={pick('Animasi AI fashion dan live shopping SNBM Creator','AI-generated fashion and live-shopping motion visual')}><source src="/assets/snbm/hero-fashion.webm" type="video/webm"/></video>
      <img className="reduced-motion-poster" src="/assets/snbm/hero-still.webp" alt={pick('Ilustrasi fashion SNBM Creator','SNBM Creator fashion illustration')} loading="eager"/>
      <div className="image-overlay"/>
      <div className="live-label"><Radio size={16}/> {pick('LIVE SHOPPING FASHION','FASHION LIVE SHOPPING')}</div>
      <div className="media-caption">{pick('Fashion wanita, muslim, tas, anak,','Women’s wear, modest fashion, bags, kidswear,')}<br/><strong>{pick('dan underwear.','and underwear.')}</strong></div>
    </div>
    <div className="hero-bottom"><span>{pick('PRODUK. TALENTA. PENJUALAN.','PRODUCTS. PEOPLE. COMMERCE.')}</span><a href="#kategori">{pick('Lihat kategori','Explore categories')} <ArrowDown size={16}/></a></div>
  </section>;
}
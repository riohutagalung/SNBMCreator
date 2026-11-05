import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, Radio } from 'lucide-react';
import { useLanguage } from '@/lib/language';

const categories = [
  { id: 'wanita', idName: 'Fashion wanita', en: 'Women’s fashion', left: '3.9%', width: '16.8%' },
  { id: 'muslim', idName: 'Fashion muslim', en: 'Modest fashion', left: '21.8%', width: '17.3%' },
  { id: 'tas', idName: 'Tas wanita', en: 'Women’s bags', left: '40.5%', width: '16.8%' },
  { id: 'underwear', idName: 'Underwear', en: 'Underwear', left: '58.5%', width: '18.2%' },
  { id: 'anak', idName: 'Fashion anak', en: 'Kidswear', left: '77.9%', width: '16.6%' },
];

export function Hero({ content: _content }: { content?: Record<string, string> }) {
  const { pick } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [category, setCategory] = useState(0);
  useEffect(() => {
    // Autoplay must be muted and inline to work on mobile and modern browsers.
    // The poster remains available if a browser disables video playback.
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      void video.play().catch(() => { /* Browser may block autoplay; poster stays visible. */ });
    }
    const timer = window.setInterval(() => setCategory((n) => (n + 1) % categories.length), 3000);
    return () => window.clearInterval(timer);
  }, []);
  return <section className="hero snbm-hero" id="beranda">
    <div className="snbm-hero-grid">
      <div className="snbm-hero-copy">
        <span className="eyebrow"><span className="live-dot"/> {pick('SELLER & CREATOR AGENCY', 'SELLER & CREATOR AGENCY')}</span>
        <h1>{pick('Kembangkan brand','Grow your brand')}<br/>{pick('bersama host live','with professional live')}<br/><span>{pick('profesional.','hosts.')}</span></h1>
        <p>{pick('Kami adalah seller fashion sekaligus agensi pengembangan creator dan host live commerce. Mulai dari penjualan produk, pembinaan host, hingga operasional live shopping.','We sell fashion products and develop live-commerce hosts. From selling products and developing talent to managing live-shopping operations.')}</p>
        <div className="snbm-hero-actions">
          <Link className="button" to="/kontak?jenis=brand">{pick('Mulai kolaborasi','Work with us')} <ArrowUpRight size={19}/></Link>
          <Link className="button snbm-button-outline" to="/gabung-host">{pick('Daftar jadi host','Apply as a host')} <ArrowUpRight size={19}/></Link>
        </div>
      </div>
      <div className="snbm-hero-visual" aria-label={pick('Fashion SNBM Creator','SNBM Creator fashion')}>
        <video ref={videoRef} autoPlay muted loop playsInline preload="auto" poster="/assets/snbm/hero-still.webp?v=4k3" aria-label={pick('Video fashion otomatis berlatar kuning','Autoplaying fashion visual on yellow background')}>
          <source src="/assets/snbm/hero-fashion-hd.mp4?v=4k3" type="video/mp4"/>
        </video>
        <img className="snbm-hero-poster" src="/assets/snbm/hero-still.webp?v=4k3" width="3840" height="2160" alt={pick('Fashion SNBM Creator dengan lima kategori produk','SNBM Creator fashion and five product categories')} fetchPriority="high"/>
        <span className="snbm-hero-overline"><Radio size={14}/> {pick('FASHION LIVE COMMERCE','FASHION LIVE COMMERCE')}</span>
        {categories.map((item, index) => <Link
          key={item.id}
          to="/layanan#kategori-fashion"
          className={`snbm-category-hotspot ${category === index ? 'is-featured' : ''}`}
          style={{ left: item.left, width: item.width }}
          aria-label={pick(`Jelajahi ${item.idName}`, `Explore ${item.en}`)}
          title={pick(item.idName,item.en)}
        />)}
      </div>
    </div>
    <div className="snbm-hero-facts" aria-label={pick('Tentang bisnis SNBM Creator','About SNBM Creator')}>
      <strong>{pick('Yang kami kerjakan', 'What we do')}</strong>
      <div><span className="snbm-fact-icon">01</span><p><b>{pick('Seller fashion','Fashion retailer')}</b><small>{pick('Menjual produk langsung','Direct product sales')}</small></p></div>
      <div><span className="snbm-fact-icon">02</span><p><b>{pick('Host in-house','In-house hosts')}</b><small>{pick('Kesempatan kerja full time','Full-time opportunities')}</small></p></div>
      <div><span className="snbm-fact-icon">03</span><p><b>{pick('Host freelance','Freelance hosts')}</b><small>{pick('Kolaborasi part time','Part-time collaborations')}</small></p></div>
    </div>
  </section>;
}
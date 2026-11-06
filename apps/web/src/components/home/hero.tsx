import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, Radio } from 'lucide-react';
import { useLanguage } from '@/lib/language';

const categories = [
  { id: 'wanita', idName: 'Fashion wanita', en: 'Women’s fashion', image: '/assets/snbm/regular-nonhijab.webp', position: 'center 28%' },
  { id: 'muslim', idName: 'Fashion muslim', en: 'Modest fashion', image: '/assets/snbm/regular-hijab.webp', position: 'center 27%' },
  { id: 'tas', idName: 'Tas wanita', en: 'Women’s bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&q=90&fit=contain', position: 'center center' },
  { id: 'underwear', idName: 'Underwear', en: 'Underwear', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1600&q=90&fit=contain', position: 'center center' },
  { id: 'anak', idName: 'Fashion kids', en: 'Kidswear', image: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=1600&q=90&fit=contain', position: 'center center' },
] as const;

export function Hero({ content: _content }: { content?: Record<string, string> }) {
  const { pick } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const resumeAt = useRef(0);
  const [category, setCategory] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const chooseCategory = (index: number) => {
    setCategory(index);
    setShowIntro(false);
    resumeAt.current = Date.now() + 12000;
  };
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      void video.play().catch(() => { /* Static image remains visible on autoplay-blocked browsers. */ });
    }
    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < resumeAt.current) return;
      setShowIntro(false);
      setCategory((previous) => (previous + 1) % categories.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  const active = categories[category];
  return <section className="hero snbm-hero" id="beranda">
    <div className="snbm-hero-grid">
      <div className="snbm-hero-copy">
        <span className="eyebrow"><span className="live-dot"/> {pick('SELLER FASHION & AGENSI TALENTA LIVE', 'FASHION SELLER & LIVE TALENT AGENCY')}</span>
        <h1>{pick('Dari pengalaman jualan,','Built on selling experience,')}<br/>{pick('kami hadirkan host live','we bring you live hosts')}<br/><span>{pick('yang siap berkembang.','ready to grow.')}</span></h1>
        <p>{pick('Kami tahu ritme live shopping karena menjalaninya sendiri sebagai seller fashion, dengan pengalaman penjualan ribuan hingga puluhan ribu pcs produk dalam satu hari. Kini, pengalaman itu kami bawa untuk mencari, membina, dan menghadirkan talenta host live shopping terbaik bagi brand yang ingin terus berkembang.', 'As fashion sellers, we know live shopping firsthand, with experience selling thousands to tens of thousands of pieces in a single day. Today, we use that experience to discover, train, and connect promising live-shopping hosts with growing brands.')}</p>
        <div className="snbm-hero-actions">
          <Link className="button" to="/kontak?jenis=brand">{pick('Mulai kolaborasi','Work with us')} <ArrowUpRight size={19}/></Link>
          <Link className="button snbm-button-outline" to="/gabung-host">{pick('Daftar jadi host','Apply as a host')} <ArrowUpRight size={19}/></Link>
        </div>
      </div>
      <div className="snbm-hero-visual" aria-label={pick('Kategori fashion SNBM Creator yang bisa dipilih','Interactive SNBM Creator fashion categories')}>
        <video ref={videoRef} className={showIntro ? 'is-visible' : 'is-hidden'} autoPlay muted loop playsInline preload="metadata" poster="/assets/snbm/hero-still.webp?v=4k3" aria-hidden="true">
          <source src="/assets/snbm/hero-fashion-hd.mp4?v=4k3" type="video/mp4"/>
        </video>
        <img className="snbm-hero-poster" src="/assets/snbm/hero-still.webp?v=4k3" width="3840" height="2160" alt="" fetchPriority="high"/>
        {!showIntro && <img
          className="snbm-hero-category-image"
          key={active.id}
          src={failedImages.includes(active.id) ? '/assets/snbm/hero-still.webp?v=4k3' : active.image}
          alt={pick('Pilihan kategori: ' + active.idName, 'Selected category: ' + active.en)}
          style={{ objectPosition: active.position }}
          onError={() => setFailedImages((items) => items.includes(active.id) ? items : [...items, active.id])}
        />}
        <span className="snbm-hero-overline"><Radio size={14}/> {pick('FASHION LIVE COMMERCE','FASHION LIVE COMMERCE')}</span>
        <div className="snbm-category-controls" role="group" aria-label={pick('Pilih kategori fashion','Choose a fashion category')}>
          {categories.map((item, index) => <button
            key={item.id}
            type="button"
            onClick={() => chooseCategory(index)}
            className={`snbm-category-hotspot ${category === index ? 'is-featured' : ''}`}
            aria-pressed={category === index && !showIntro}
            title={pick(item.idName,item.en)}
          >{pick(item.idName,item.en)}</button>)}
        </div>
      </div>
    </div>
    <div className="snbm-hero-facts" aria-label={pick('Tentang bisnis SNBM Creator','About SNBM Creator')}>
      <strong>{pick('Yang kami kerjakan', 'What we do')}</strong>
      <div><span className="snbm-fact-icon">01</span><p><b>{pick('Seller fashion','Fashion retailer')}</b><small>{pick('Berpengalaman menjual ribuan pcs per hari','Thousands of pieces sold daily')}</small></p></div>
      <div><span className="snbm-fact-icon">02</span><p><b>{pick('Host in-house','In-house hosts')}</b><small>{pick('Kesempatan kerja full time','Full-time opportunities')}</small></p></div>
      <div><span className="snbm-fact-icon">03</span><p><b>{pick('Host freelance','Freelance hosts')}</b><small>{pick('Kolaborasi part time','Part-time collaborations')}</small></p></div>
    </div>
  </section>;
}

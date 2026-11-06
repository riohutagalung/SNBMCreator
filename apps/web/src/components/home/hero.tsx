import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/lib/language';

const categories = [
  { id: 'wanita', idName: 'Fashion Wanita', en: "Women's Fashion", image: '/assets/snbm/hero-fashion-wanita.webp', thumb: '/assets/snbm/category-wanita.svg' },
  { id: 'muslim', idName: 'Fashion Muslim', en: 'Modest Fashion', image: '/assets/snbm/hero-fashion-muslim.webp', thumb: '/assets/snbm/category-muslim.svg' },
  { id: 'tas', idName: 'Tas Wanita', en: "Women's Bags", image: '/assets/snbm/hero-tas-wanita.webp', thumb: '/assets/snbm/category-tas.svg' },
  { id: 'underwear', idName: 'Underwear', en: 'Underwear', image: '/assets/snbm/hero-underwear.webp', thumb: '/assets/snbm/category-underwear.svg' },
  { id: 'anak', idName: 'Fashion Kids', en: 'Kidswear', image: '/assets/snbm/hero-fashion-kids.webp', thumb: '/assets/snbm/category-kids.svg' },
] as const;
const AUTOPLAY_MS = 4000;
const MANUAL_HOLD_MS = 12000;

export function Hero({ content: _content }: { content?: Record<string, string> }) {
  const { pick } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const resumeAutoplayAt = useRef(0);

  useEffect(() => {
    // Keep the same carousel for desktop and mobile. Never replay the outdated video.
    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < resumeAutoplayAt.current) return;
      setActiveIndex(previous => (previous + 1) % categories.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, []);

  const showCategory = (index: number) => {
    setActiveIndex((index + categories.length) % categories.length);
    // A manual choice remains visible before the automatic carousel resumes.
    resumeAutoplayAt.current = Date.now() + MANUAL_HOLD_MS;
  };

  const active = categories[activeIndex];
  return <section className="hero snbm-hero" id="beranda">
    <div className="snbm-hero-grid">
      <div className="snbm-hero-copy">
        <span className="eyebrow"><span className="live-dot"/>{pick('SELLER & AGENSI TALENTA FASHION', 'FASHION SELLER & TALENT AGENCY')}</span>
        <h1>{pick('Kembangkan brand bersama', 'Grow your brand with')} <span>{pick('host live yang tepat.', 'the right live hosts.')}</span></h1>
        <p>{pick(
          'Berawal dari pengalaman berjualan fashion, termasuk penjualan ribuan hingga puluhan ribu produk dalam sehari, kini kami fokus mencari dan membina talenta untuk menjadi host live shopping andalan berbagai brand.',
          'With experience selling fashion, including days with thousands to tens of thousands of items sold, we now focus on finding and developing live-shopping hosts for brands.'
        )}</p>
        <div className="snbm-hero-actions">
          <Link className="button" to="/kontak?jenis=brand">{pick('Mulai kolaborasi','Work with us')} <ArrowUpRight size={19}/></Link>
          <Link className="button snbm-button-outline" to="/gabung-host">{pick('Daftar jadi host','Apply as a host')} <ArrowUpRight size={19}/></Link>
        </div>
      </div>
      <div className="snbm-hero-visual" role="region" aria-roledescription="carousel" aria-label={pick('Galeri kategori SNBM Creator','SNBM Creator category gallery')}>
        <img
          key={active.id}
          className="snbm-hero-category-image snbm-image-visible"
          src={active.image}
          width="1920" height="1080"
          alt={pick(`Model dan produk kategori ${active.idName}`, `${active.en} fashion and product showcase`)}
          fetchPriority={activeIndex === 0 ? 'high' : undefined}
        />
        <span className="snbm-hero-signature" aria-hidden="true">{pick(active.idName,active.en)}</span>
        <button type="button" className="snbm-hero-arrow snbm-hero-prev" aria-label={pick('Kategori sebelumnya','Previous category')} onClick={() => showCategory(activeIndex - 1)}><ArrowLeft size={19}/></button>
        <button type="button" className="snbm-hero-arrow snbm-hero-next" aria-label={pick('Kategori berikutnya','Next category')} onClick={() => showCategory(activeIndex + 1)}><ArrowRight size={19}/></button>
        <div className="snbm-category-controls" role="group" aria-label={pick('Pilih kategori fashion','Choose a fashion category')}>
          {categories.map((item, index) => <button
            key={item.id}
            type="button"
            onClick={() => showCategory(index)}
            className={index === activeIndex ? 'snbm-category-hotspot is-featured' : 'snbm-category-hotspot'}
            aria-pressed={index === activeIndex}
          >
            <img className="snbm-category-thumb" src={item.thumb} alt="" width="42" height="42" loading="lazy"/>
            <span>{pick(item.idName, item.en)}</span>
          </button>)}
        </div>
      </div>
    </div>
    <div className="snbm-hero-facts" aria-label={pick('Yang kami kerjakan','What we do')}>
      <strong>{pick('Yang kami kerjakan','What we do')}</strong>
      <div><span className="snbm-fact-icon">01</span><p><b>{pick('Seller fashion','Fashion seller')}</b><small>{pick('Menjual produk langsung','Direct product sales')}</small></p></div>
      <div><span className="snbm-fact-icon">02</span><p><b>{pick('Host in-house','In-house hosts')}</b><small>{pick('Kesempatan kerja full time','Full-time opportunities')}</small></p></div>
      <div><span className="snbm-fact-icon">03</span><p><b>{pick('Host freelance','Freelance hosts')}</b><small>{pick('Kolaborasi part time','Part-time collaboration')}</small></p></div>
    </div>
  </section>;
}

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/lib/language';

type Category = {
  id: string;
  idName: string;
  en: string;
  image: string;
  short: string;
  enShort: string;
};

// Local, individually authored images. Never depend on an external image host
// for the homepage. Order matches the 15.5 second looping motion sequence.
const categories: Category[] = [
  { id: 'wanita', idName: 'Fashion wanita', en: 'Women’s fashion', short: 'Koleksi fashion wanita', enShort: 'Women’s fashion', image: '/assets/snbm/hero-fashion-wanita.webp' },
  { id: 'muslim', idName: 'Fashion muslim', en: 'Modest fashion', short: 'Fashion muslim', enShort: 'Modest fashion', image: '/assets/snbm/hero-fashion-muslim.webp' },
  { id: 'tas', idName: 'Tas wanita', en: 'Women’s bags', short: 'Tas wanita', enShort: 'Women’s bags', image: '/assets/snbm/hero-tas-wanita.webp' },
  { id: 'underwear', idName: 'Underwear', en: 'Underwear', short: 'Koleksi underwear', enShort: 'Underwear collection', image: '/assets/snbm/hero-underwear.webp' },
  { id: 'anak', idName: 'Fashion kids', en: 'Kidswear', short: 'Fashion anak', enShort: 'Kidswear', image: '/assets/snbm/hero-fashion-kids.webp' },
];

const SECTION_SECONDS = 3;

export function Hero({ content: _content }: { content?: Record<string, string> }) {
  const { pick } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const resetRef = useRef<number | undefined>(undefined);
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      void video.play().catch(() => setVideoUnavailable(true));
    }
    // The same carousel works even when autoplay/video is unavailable.
    const timer = window.setInterval(() => {
      if (document.hidden || manualIndex !== null) return;
      if (videoUnavailable) setActiveIndex(index => (index + 1) % categories.length);
    }, 3400);
    return () => {
      window.clearInterval(timer);
      if (resetRef.current !== undefined) window.clearTimeout(resetRef.current);
    };
  }, [manualIndex, videoUnavailable]);

  const showCategory = (index: number) => {
    const next = (index + categories.length) % categories.length;
    setActiveIndex(next);
    setManualIndex(next);
    if (resetRef.current !== undefined) window.clearTimeout(resetRef.current);
    // Resume autoplay after someone has finished exploring a category.
    resetRef.current = window.setTimeout(() => {
      setManualIndex(null);
      const video = videoRef.current;
      if (video) {
        video.currentTime = next * SECTION_SECONDS;
        void video.play().catch(() => setVideoUnavailable(true));
      }
    }, 10000);
  };

  const visible = categories[manualIndex ?? activeIndex];
  return <section className="hero snbm-hero" id="beranda">
    <div className="snbm-hero-grid">
      <div className="snbm-hero-copy">
        <span className="eyebrow"><span className="live-dot"/>{pick('SELLER & AGENSI TALENTA FASHION', 'FASHION SELLER & TALENT AGENCY')}</span>
        <h1>{pick('Kembangkan brand bersama', 'Grow your brand with')} <span>{pick('host live yang tepat.', 'the right live hosts.')}</span></h1>
        <p>{pick(
          'Berawal dari pengalaman berjualan fashion, termasuk penjualan ribuan hingga puluhan ribu produk dalam sehari, kini kami fokus mencari dan membina talenta untuk menjadi host live shopping andalan berbagai brand.',
          'With years of experience selling fashion, including days with thousands to tens of thousands of items sold, we now focus on finding and developing live-shopping hosts for brands.'
        )}</p>
        <div className="snbm-hero-actions">
          <Link className="button" to="/kontak?jenis=brand">{pick('Mulai kolaborasi','Work with us')} <ArrowUpRight size={19}/></Link>
          <Link className="button snbm-button-outline" to="/gabung-host">{pick('Daftar jadi host','Apply as a host')} <ArrowUpRight size={19}/></Link>
        </div>
      </div>
      <div className="snbm-hero-visual" role="region" aria-label={pick('Pilihan kategori fashion SNBM Creator','SNBM Creator fashion category gallery')}>
        <video
          ref={videoRef}
          className="snbm-hero-motion"
          autoPlay muted loop playsInline preload="metadata"
          poster="/assets/snbm/hero-fashion-wanita.webp"
          onTimeUpdate={event => {
            if (manualIndex !== null) return;
            const current = Math.min(categories.length - 1, Math.floor(event.currentTarget.currentTime / SECTION_SECONDS));
            setActiveIndex(current);
          }}
          onError={() => setVideoUnavailable(true)}
          aria-hidden="true"
        >
          <source src="/assets/snbm/hero-fashion-categories.mp4" type="video/mp4"/>
        </video>
        <img
          key={visible.id}
          className={manualIndex !== null || videoUnavailable ? 'snbm-hero-category-image snbm-image-visible' : 'snbm-hero-category-image'}
          src={visible.image}
          width="1920" height="1080"
          alt={pick(`Tampilan ${visible.idName}`, `${visible.en} showcase`)}
          fetchPriority={visible.id === 'wanita' ? 'high' : undefined}
        />
        <span className="snbm-hero-overline">{pick(visible.short, visible.enShort)}</span>
        <button type="button" className="snbm-hero-arrow snbm-hero-prev" aria-label={pick('Kategori sebelumnya','Previous category')} onClick={() => showCategory(activeIndex - 1)}><ArrowLeft size={19}/></button>
        <button type="button" className="snbm-hero-arrow snbm-hero-next" aria-label={pick('Kategori berikutnya','Next category')} onClick={() => showCategory(activeIndex + 1)}><ArrowRight size={19}/></button>
        <div className="snbm-category-controls" role="group" aria-label={pick('Pilih kategori fashion','Select fashion category')}>
          {categories.map((item, index) => <button
            key={item.id}
            type="button"
            onClick={() => showCategory(index)}
            className={index === (manualIndex ?? activeIndex) ? 'snbm-category-hotspot is-featured' : 'snbm-category-hotspot'}
            aria-pressed={index === (manualIndex ?? activeIndex)}
          >{pick(item.idName, item.en)}</button>)}
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
import { Link } from 'react-router';
import { ArrowUpRight, ArrowDown, Radio } from 'lucide-react';
import { heroImage as defaultHeroImage } from '@/data/content';

type HeroContent = Partial<Record<'hero_title' | 'hero_title_highlight' | 'hero_intro' | 'hero_image' | 'hero_caption' | 'hero_caption_strong', string>>;

export function Hero({ content }: { content?: Record<string, string> }) {
 const c = content || {};
 const title = c.hero_title || 'Host yang tepat.';
 const highlight = c.hero_title_highlight || 'makin hebat.';
 const intro = c.hero_intro || 'Kami mempertemukan brand fashion dengan host creator yang relevan. Bukan hanya menjual produk—membangun koneksi yang menggerakkan penjualan.';
 const image = c.hero_image || defaultHeroImage;
 const caption = c.hero_caption || 'Beragam gaya.';
 const captionStrong = c.hero_caption_strong || 'Satu dampak nyata.';
 return <section className="hero"><div className="hero-top"><span className="eyebrow"><span className="live-dot"/> LIVE SHOPPING. KONEKSI NYATA.</span><span className="location">JAKARTA BARAT → INDONESIA</span></div><div className="hero-copy"><h1>{title}<br/>Brand <span>{highlight}</span></h1><div className="hero-intro"><p>{intro}</p><Link className="button" to="/layanan">Temukan layanan Anda <ArrowUpRight size={19}/></Link><Link className="text-link" to="/gabung-host">Punya energi di depan kamera? Jadi host →</Link></div></div><div className="hero-media"><img src={image} alt="Visual editorial fashion untuk live shopping SNBM Creator" width="1344" height="768" fetchPriority="high"/><div className="image-overlay"/><div className="live-label"><Radio size={16}/> SIAP TAMPIL LIVE</div><div className="media-caption">{caption}<br/><strong>{captionStrong}</strong></div><div className="floating-note"><span>PADANAN YANG TEPAT</span><strong>Setiap brand.<br/>Ada host-nya.</strong><ArrowUpRight/></div><span className="photo-note">VISUAL ILUSTRASI</span></div><div className="hero-bottom"><span>DIPANDU CREATOR. BERFOKUS FASHION.</span><a href="#kategori">Kenali dunia kami <ArrowDown size={16}/></a></div></section>;
}
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';

type SiteContent = Record<string, string>;

export function Collaborate({ content = {} }: { content?: SiteContent }) {
  return (
    <section className="collaborate section-rail">
      <span className="eyebrow">{content.collaborate_eyebrow || 'LIVE BERIKUTNYA DIMULAI DARI ANDA.'}</span>
      <h2>{content.collaborate_title || 'Siap jadi'}<br/><span>{content.collaborate_title_highlight || 'pusat perhatian?'}</span></h2>
      <div>
        <Link className="button light" to="/layanan">{content.collaborate_brand_cta || 'Saya pemilik brand'} <ArrowUpRight size={20}/></Link>
        <Link className="button outline-light" to="/kontak?jenis=host">{content.collaborate_host_cta || 'Saya ingin jadi host'} <ArrowUpRight size={20}/></Link>
      </div>
      <div className="platforms">
        <span>LAYANAN LIVE UNTUK</span>
        <strong>TikTok Live</strong><strong>Shopee Live</strong><strong>Instagram Live</strong>
      </div>
      <p className="platform-note">{content.collaborate_platform_note || 'Integrasi data otomatis belum aktif. Akses API dan izin akun dari masing-masing platform diperlukan; laporan saat ini dikelola oleh agensi.'}</p>
    </section>
  );
}

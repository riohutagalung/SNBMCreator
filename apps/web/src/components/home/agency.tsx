import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { categories as defaultCategories } from '@/data/content';

type SiteContent = Record<string, string>;

const listFrom = (value: string | undefined, fallback: string[]) =>
  (value || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean).length
    ? (value || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean)
    : fallback;

export function Agency({ content = {} }: { content?: SiteContent }) {
  const c = content;
  const categories = listFrom(c.categories_list, defaultCategories);
  const steps = [
    [c.workflow_step_1_title || 'Kenali brand Anda', c.workflow_step_1_body || 'Kami mendalami kategori, karakter audiens, dan tujuan kampanye.'],
    [c.workflow_step_2_title || 'Kurasi host yang relevan', c.workflow_step_2_body || 'Reguler atau big size, hijab atau nonhijab. Sesuaikan dengan produk Anda.'],
    [c.workflow_step_3_title || 'Live, evaluasi, optimalkan', c.workflow_step_3_body || 'Presentasi produk, interaksi audiens, dan evaluasi performa untuk langkah berikutnya.'],
  ];

  return (
    <>
      <section id="kategori" className="category-section">
        <span className="eyebrow">{c.categories_eyebrow || 'FOKUS KATEGORI KAMI'}</span>
        <div className="category-list">
          {categories.map((category, i) => (
            <Link key={category} to={`/kontak?kategori=${encodeURIComponent(category)}`}>
              <span className="category-number">{String(i + 1).padStart(2, '0')}</span>
              {category}<ArrowUpRight size={19}/>
            </Link>
          ))}
        </div>
      </section>
      <section id="tentang" className="agency-section section-rail">
        <div>
          <span className="eyebrow">{c.about_eyebrow || '01 / TENTANG SNBM'}</span>
          <h2 style={{ whiteSpace: 'pre-line' }}>{c.about_title || 'Koneksi yang pas.\nPotensi tanpa batas.'}</h2>
        </div>
        <div className="agency-story">
          <p className="lead" style={{ whiteSpace: 'pre-line' }}>{c.about_lead || 'Fashion punya banyak wajah.\nBegitu juga host kami.'}</p>
          <p>{c.about_body_1 || 'Berbasis di Jakarta Barat, SNBM Creator adalah agensi host creator untuk live shopping. Kami menghubungkan kebutuhan brand dengan kategori produk, ukuran tubuh, dan gaya host—berhijab maupun nonhijab.'}</p>
          <p>{c.about_body_2 || 'Langkah kami dimulai dari Jakarta Barat, dengan visi membangun jaringan host di berbagai wilayah Indonesia. Karena koneksi yang kuat tidak mengenal batas kota.'}</p>
          <Link className="text-link" to="/kontak">Bangun kolaborasi bersama kami <ArrowUpRight size={18}/></Link>
        </div>
      </section>
      <section className="workflow section-rail">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{c.workflow_eyebrow || '02 / CARA KAMI BEKERJA'}</span>
            <h2 style={{ whiteSpace: 'pre-line' }}>{c.workflow_title || 'Dari briefing\nsampai live.'}</h2>
          </div>
          <p style={{ whiteSpace: 'pre-line' }}>{c.workflow_subtitle || 'Brand Anda, pendekatan yang personal.\nSeluruh proses dalam satu kolaborasi.'}</p>
        </div>
        <div className="workflow-rows">
          {steps.map((step, i) => (
            <div key={i}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{step[0]}</h3>
              <p>{step[1]}</p>
              <ArrowUpRight/>
            </div>
          ))}
        </div>
        <div className="portfolio-note">
          <strong>{c.portfolio_title || 'Portofolio kolaborasi'}</strong>
          <p>{c.portfolio_body || 'Ruang untuk kampanye fashion muslim, fashion wanita, tas, fashion anak, dan underwear. Studi kasus serta logo mitra akan ditampilkan setelah mendapat izin brand—belum ada klaim kerja sama yang dipublikasikan.'}</p>
        </div>
      </section>
    </>
  );
}

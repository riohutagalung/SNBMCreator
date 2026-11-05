import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { hosts as defaultHosts } from '@/data/content';

type SiteContent = Record<string, string>;

export function Hosts({ content = {} }: { content?: SiteContent }) {
  const [filter, setFilter] = useState('Semua');
  const profiles = defaultHosts.map((host, index) => {
    const number = index + 1;
    return {
      ...host,
      name: content[`host_${number}_name`] || host.name,
      size: content[`host_${number}_size`] || host.size,
      category: content[`host_${number}_category`] || host.category,
      image: content[`host_${number}_image`] || host.image,
    };
  }).filter(host => host.name.trim());
  const visible = profiles.filter(host =>
    filter === 'Semua' ||
    (filter === 'Big size' ? /75|100|big/i.test(host.size) : !/75|100|big/i.test(host.size)),
  );

  return (
    <section className="hosts-section section-rail" id="host">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{content.hosts_eyebrow || '03 / TEMUKAN HOST ANDA'}</span>
          <h2 style={{ whiteSpace: 'pre-line' }}>{content.hosts_title || 'Beragam karakter.\nSatu energi.'}</h2>
        </div>
        <Link to="/kontak?jenis=host" className="text-link">{content.hosts_cta || 'Jadi bagian dari tim'} <ArrowUpRight size={18}/></Link>
      </div>
      <div className="filter-row">
        {['Semua', 'Reguler', 'Big size'].map(item => (
          <button className={item === filter ? 'selected' : ''} aria-pressed={item === filter} key={item} onClick={() => setFilter(item)}>{item}</button>
        ))}
        <span>Hijab & nonhijab · Jakarta Barat</span>
      </div>
      <div className="host-grid">
        {visible.map((host, index) => (
          <article key={host.name}>
            <div className="host-photo">
              <img src={host.image} alt={`Ilustrasi ${host.name}`} width="896" height="1216" loading="lazy"/>
              <span className="host-badge">{host.size}</span>
              <Link to="/kontak" className="host-arrow" aria-label={`Tanyakan ketersediaan ${host.name}`}><ArrowUpRight/></Link>
            </div>
            <div className="host-info">
              <span>PROFIL / 0{index + 1}</span>
              <h3>{host.name}</h3>
              <p>{host.category}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="subtle">{content.hosts_note || 'Foto dan profil di atas adalah ilustrasi tipe host, bukan identitas anggota aktual. Ketersediaan host dikonfirmasi saat briefing.'}</p>
    </section>
  );
}

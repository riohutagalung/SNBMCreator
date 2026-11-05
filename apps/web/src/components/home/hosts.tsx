import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { hosts } from '@/data/content';
export function Hosts() {
 const [filter,setFilter]=useState('Semua');
 const visible=hosts.filter(h=>filter==='Semua'||(filter==='Big size'?h.size==='75–100 kg':h.size==='55–65 kg'));
 return <section className="hosts-section section-rail" id="host"><div className="section-heading"><div><span className="eyebrow">03 / TEMUKAN HOST ANDA</span><h2>Beragam karakter.<br/>Satu energi.</h2></div><Link to="/kontak?jenis=host" className="text-link">Jadi bagian dari tim <ArrowUpRight size={18}/></Link></div><div className="filter-row">{['Semua','Reguler','Big size'].map(f=><button className={f===filter?'selected':''} aria-pressed={f===filter} key={f} onClick={()=>setFilter(f)}>{f}</button>)}<span>Hijab & nonhijab · Jakarta Barat</span></div><div className="host-grid">{visible.map((h,i)=><article key={h.name}><div className="host-photo"><img src={h.image} alt={`Ilustrasi ${h.name}`} width="896" height="1216" loading="lazy"/><span className="host-badge">{h.size}</span><Link to="/kontak" className="host-arrow" aria-label={`Tanyakan ketersediaan ${h.name}`}><ArrowUpRight/></Link></div><div className="host-info"><span>PROFIL / 0{i+1}</span><h3>{h.name}</h3><p>{h.category}</p></div></article>)}</div><p className="subtle">Foto dan profil di atas adalah ilustrasi tipe host, bukan identitas anggota aktual. Ketersediaan host dikonfirmasi saat briefing.</p></section>;
}
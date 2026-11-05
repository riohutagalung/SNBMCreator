import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/lib/language';
const hostTypes = [
 {key:'regular-hijab',name:'Reguler · Hijab',english:'Regular · Hijab',size:'Reguler',category:'Fashion muslim',image:'/assets/snbm/regular-hijab.webp'},
 {key:'regular-nonhijab',name:'Reguler · Nonhijab',english:'Regular · Non-hijab',size:'Reguler',category:'Fashion wanita',image:'/assets/snbm/regular-nonhijab.webp'},
 {key:'big-hijab',name:'Big size · Hijab',english:'Plus size · Hijab',size:'Big size',category:'Fashion muslim',image:'/assets/snbm/big-hijab.webp'},
 {key:'big-nonhijab',name:'Big size · Nonhijab',english:'Plus size · Non-hijab',size:'Big size',category:'Fashion wanita',image:'/assets/snbm/big-nonhijab.webp'},
];
export function Hosts({ content: _content }: { content?: Record<string,string> }) {
 const [filter,setFilter]=useState('Semua');
 const {pick}=useLanguage();
 const visible=hostTypes.filter(h=>filter==='Semua'||h.size===filter);
 return <section className="hosts-section section-rail" id="host"><div className="section-heading"><div><span className="eyebrow">03 / {pick('PROFIL HOST','HOST PROFILES')}</span><h2>{pick('Gaya berbeda, kebutuhan berbeda.','Different styles for different audiences.')}</h2></div><Link className="text-link" to="/gabung-host">{pick('Gabung sebagai host','Apply as a host')} <ArrowUpRight size={18}/></Link></div><div className="filter-row">{['Semua','Reguler','Big size'].map(item=><button key={item} className={filter===item?'selected':''} aria-pressed={filter===item} onClick={()=>setFilter(item)}>{item==='Semua'?pick('Semua','All'):item==='Big size'?pick('Big size','Plus size'):pick('Reguler','Regular')}</button>)}<span>{pick('Hijab dan nonhijab','Hijab and non-hijab')}</span></div><div className="host-grid host-grid-four">{visible.map(h=><article key={h.key}><div className="host-photo"><img src={h.image} alt={pick(`Ilustrasi model ${h.name}`,`Illustrative ${h.english} model`)} width="420" height="560" loading="lazy"/><Link to="/kontak?jenis=brand" className="host-arrow" aria-label={pick('Tanyakan kebutuhan host','Enquire about host requirements')}><ArrowUpRight/></Link></div><div className="host-info"><h3>{pick(h.name,h.english)}</h3><p>{pick(h.category,h.category==='Fashion muslim'?'Modest fashion':'Women’s fashion')}</p></div></article>)}</div><p className="subtle">{pick('Seluruh gambar merupakan ilustrasi AI untuk menunjukkan kategori penampilan, bukan foto atau portofolio host yang sedang terdaftar.','These AI-generated images illustrate presentation categories and do not represent our current host roster.')}</p></section>;
}
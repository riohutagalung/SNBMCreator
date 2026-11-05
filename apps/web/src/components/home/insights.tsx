import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { articles } from '@/data/content';
import { useLanguage } from '@/lib/language';
const englishTitles:Record<string,string>={
 'host-yang-tepat':'How to choose the right live-shopping host',
 'memahami-gmv':'Understanding GMV beyond the headline number',
};
export function Insights(){const {pick}=useLanguage();return <section className="insights section-rail"><div className="section-heading"><div><span className="eyebrow">05 / {pick('CATATAN DARI LAPANGAN','FIELD NOTES')}</span><h2>{pick('Hal yang perlu dipahami sebelum live.','What matters before you go live.')}</h2></div><Link className="text-link" to="/blog">{pick('Baca semua artikel','Read all articles')} <ArrowUpRight size={18}/></Link></div><div className="article-list">{articles.map(a=><Link to={`/blog/${a.slug}`} key={a.slug}><span>{a.tag}<small>{a.date}</small></span><h3>{pick(a.title,englishTitles[a.slug]||a.title)}</h3><ArrowUpRight size={28}/></Link>)}</div></section>}
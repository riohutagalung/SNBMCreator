import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { articles } from '@/data/content';
export function Insights() {
 return <section className="insights section-rail"><div className="section-heading"><div><span className="eyebrow">05 / WAWASAN CREATOR</span><h2>Di balik layar live.</h2></div><Link className="text-link" to="/blog">Semua insight <ArrowUpRight size={18}/></Link></div><div className="article-list">{articles.map(a=><Link to={`/blog/${a.slug}`} key={a.slug}><span>{a.tag}<small>{a.date}</small></span><h3>{a.title}</h3><ArrowUpRight size={28}/></Link>)}</div></section>;
}
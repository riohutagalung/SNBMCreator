import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { articleImage, articleText, type Article } from '@/lib/articles';

export function Insights({ articles, limit }: { articles: Article[]; limit?: number }) {
 const { en, pick } = useLanguage();
 const visible = typeof limit === 'number' ? articles.slice(0, limit) : articles;
 return <section className="insights section-rail">
   <div className="section-heading">
     <div><span className="eyebrow">05 / {pick('CATATAN DARI LAPANGAN','FIELD NOTES')}</span>
     <h2>{pick('Hal yang perlu dipahami sebelum live.','What matters before you go live.')}</h2></div>
     <Link className="text-link" to="/blog">{pick('Baca semua artikel','Read all articles')} <ArrowUpRight size={18}/></Link>
   </div>
   <div className="article-list">
     {visible.map(a => {
       const copy = articleText(a, en);
       const cover = articleImage(a.image_url);
       return <Link to={`/blog/${a.slug}`} key={a.slug}>
         <span className="article-list-meta">
           {cover && <img className="article-list-thumb" src={cover} alt={a.image_alt || copy.title} loading="lazy" width={320} height={176}/>}
           <span className="article-list-category">{copy.tag}</span>
           <small>{copy.date}</small>
         </span>
         <h3>{copy.title}</h3>
         <ArrowUpRight size={28}/>
       </Link>;
     })}
   </div>
   {visible.length === 0 && <p className="subtle">{pick('Belum ada artikel yang dipublikasikan.','No published articles yet.')}</p>}
 </section>;
}

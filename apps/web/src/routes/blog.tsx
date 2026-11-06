import { data } from 'react-router';
import type { Route } from './+types/blog';
import { seo } from '@/lib/seo';
import { Insights } from '@/components/home/insights';
import { getPublishedArticles } from '@/lib/articles.server';
import { useLanguage } from '@/lib/language';

export async function loader() {
  const articles = await getPublishedArticles();
  return data({ articles }, { headers: { 'Cache-Control': 'private, no-store, max-age=0, must-revalidate' } });
}
export function meta({matches,location}:Route.MetaArgs){
  return seo({matches,location},{
    title:'Artikel Live Commerce | SNBM Creator',
    description:'Catatan SNBM Creator tentang pemilihan host, produk fashion, dan pemahaman GMV dalam live shopping.',
    jsonLd:{'@context':'https://schema.org','@type':'CollectionPage',name:'Artikel SNBM Creator',url:'https://snbmcreator.com/blog'}
  });
}
export default function Blog({loaderData}:Route.ComponentProps){
  const {pick}=useLanguage();
  return <main>
    <div className="page-rail blog-heading">
      <span className="eyebrow">{pick('ARTIKEL SNBM','SNBM INSIGHTS')}</span>
      <h1>{pick('Cerita dan catatan','Notes from')}<br/><span>{pick('dari dunia live.','the live floor.')}</span></h1>
      <p>{pick('Pembahasan singkat yang bisa dipakai seller, brand, dan host dalam pekerjaan sehari-hari.','Practical reading for sellers, brands, and hosts working in live commerce.')}</p>
    </div>
    <Insights articles={loaderData.articles}/>
  </main>;
}

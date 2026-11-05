import type { Route } from './+types/blog';
import { seo } from '@/lib/seo';
import { heroImage } from '@/data/content';
import { Insights } from '@/components/home/insights';
export function meta({matches,location}:Route.MetaArgs){return seo({matches,location},{title:'Insight Live Shopping & Fashion — SNBM Creator',description:'Baca panduan memilih host yang relevan, memahami GMV, dan menyusun strategi live shopping fashion melalui insight editorial dari SNBM Creator.',image:heroImage,jsonLd:{'@context':'https://schema.org','@type':'CollectionPage',name:'Insight SNBM Creator'}});}
export default function Blog(){return <main><div className="page-rail blog-heading"><span className="eyebrow">JURNAL CREATOR</span><h1>Ide baru.<br/><span>Perspektif baru.</span></h1><p>Panduan praktis untuk brand dan host yang ingin melangkah lebih jauh.</p></div><Insights/></main>;}

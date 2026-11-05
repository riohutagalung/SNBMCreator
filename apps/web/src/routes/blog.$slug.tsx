import type { Route } from './+types/blog.$slug';
import { seo } from '@/lib/seo';
import { articles, heroImage } from '@/data/content';
import { ArticleContent } from '@/components/article-content';
import { useLanguage } from '@/lib/language';
export function loader({params}:Route.LoaderArgs){const article=articles.find(a=>a.slug===params.slug);if(!article)throw new Response('Artikel tidak ditemukan',{status:404});return {article};}
export function meta({matches,location,loaderData}:Route.MetaArgs){return seo({matches,location},{title:loaderData?.article.title||'Insight SNBM Creator',description:loaderData?.article.excerpt||'Panduan live shopping.',image:heroImage,type:'article',jsonLd:{'@context':'https://schema.org','@type':'Article',headline:loaderData?.article.title,datePublished:'2026-11-05',author:{'@type':'Organization',name:'SNBM Creator'}}});}
const articlesEn: Record<string,{title:string;tag:string;excerpt:string;paragraphs:string[]}> = {
  'host-yang-tepat': {title:'How to choose the right live-shopping host',tag:'BRAND STRATEGY',excerpt:'Product fit, sizing, and presentation style all matter before going live.',paragraphs:[
    'The right host helps viewers understand how a product looks and works. For fashion, fit and personal style can make a product demonstration more relevant.',
    'Start with the brand’s core category. Modest fashion needs accurate fabric and cut descriptions; bags need clear capacity and feature demonstrations; kidswear needs honest material and sizing guidance.',
    'Prepare a brief covering actual sizing, stock, pricing, and the limits of product claims. Agree on how questions will be answered, then use each session to learn and improve.'
  ]},
  'memahami-gmv': {title:'Understanding GMV beyond the headline number',tag:'LIVE INSIGHTS',excerpt:'A larger GMV number is not the whole story.',paragraphs:[
    'GMV is the gross value of transactions within a stated period. It is not profit, and it may differ from net revenue after cancellations, returns, and platform fees.',
    'Before comparing hosts, use the same period, data source, and transaction definition. Keep track of live duration, category, and promotions so evaluations remain fair.',
    'Use goals to plan, not as promises of results. Read GMV together with order count, conversion, and cancellations to decide what to improve next.'
  ]}
};
export default function Article({loaderData}:Route.ComponentProps){const {en}=useLanguage();const a=loaderData.article;const article=en && articlesEn[a.slug]?{...a,...articlesEn[a.slug]}:a;return <ArticleContent article={article}/>;}
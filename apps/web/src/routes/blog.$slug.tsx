import type { Route } from './+types/blog.$slug';
import { seo } from '@/lib/seo';
import { articles, heroImage } from '@/data/content';
import { ArticleContent } from '@/components/article-content';
export function loader({params}:Route.LoaderArgs){const article=articles.find(a=>a.slug===params.slug);if(!article)throw new Response('Artikel tidak ditemukan',{status:404});return {article};}
export function meta({matches,location,loaderData}:Route.MetaArgs){return seo({matches,location},{title:loaderData?.article.title||'Insight SNBM Creator',description:loaderData?.article.excerpt||'Panduan live shopping.',image:heroImage,type:'article',jsonLd:{'@context':'https://schema.org','@type':'Article',headline:loaderData?.article.title,datePublished:'2026-11-05',author:{'@type':'Organization',name:'SNBM Creator'}}});}
export default function Article({loaderData}:Route.ComponentProps){return <ArticleContent article={loaderData.article}/>;}

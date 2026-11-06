import { data } from 'react-router';
import type { Route } from './+types/blog.$slug';
import { seo } from '@/lib/seo';
import { heroImage } from '@/data/content';
import { getPublishedArticle } from '@/lib/articles.server';
import { articleImage } from '@/lib/articles';
import { ArticleContent } from '@/components/article-content';

export async function loader({params}:Route.LoaderArgs) {
  const article = await getPublishedArticle(params.slug || '');
  if(!article) throw new Response('Artikel tidak ditemukan', {status:404});
  return data({ article }, { headers: { 'Cache-Control': 'private, no-store, max-age=0, must-revalidate' } });
}
export function meta({matches,location,loaderData}:Route.MetaArgs){
  const a=loaderData?.article;
  return seo({matches,location},{
    title:a?.title || 'Artikel SNBM Creator',
    description:a?.excerpt || 'Panduan live shopping.',
    image:articleImage(a?.image_url) || heroImage,
    type:'article',
    jsonLd:{'@context':'https://schema.org','@type':'Article',
      headline:a?.title,description:a?.excerpt,
      datePublished:a?.published_at || a?.created_at,
      dateModified:a?.updated_at,
      image:a?.image_url || undefined,
      author:{'@type':'Organization',name:'SNBM Creator'}}
  });
}
export default function Article({loaderData}:Route.ComponentProps){
  return <ArticleContent article={loaderData.article}/>;
}

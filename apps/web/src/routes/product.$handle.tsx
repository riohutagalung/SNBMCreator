import type { Route } from './+types/product.$handle';
import { getProductByHandle, EcommerceApiError, toPriceUnits } from '@/api/ecommerce-api';
import { seo } from '@/lib/seo';
import { heroImage } from '@/data/content';
import { ProductDetail } from '@/components/product-detail';
export async function loader({params}:Route.LoaderArgs){try{return {product:await getProductByHandle(params.handle)};}catch(e){if(e instanceof EcommerceApiError&&e.status===404)throw new Response('Layanan tidak ditemukan',{status:404});throw e;}}
export function meta({matches,location,loaderData}:Route.MetaArgs){if(!loaderData)return seo({matches,location},{title:'Layanan tidak ditemukan',description:'Layanan yang Anda cari belum tersedia.',noindex:true});const p=loaderData.product;return seo({matches,location},{...p.seo,image:p.seo.image||heroImage,jsonLd:{'@context':'https://schema.org','@type':'Product',name:p.title,description:p.seo.description,offers:{'@type':'Offer',price:toPriceUnits(p.price_in_cents,p.currency_info),priceCurrency:p.currency.toUpperCase()}}});}
export default function ProductPage({loaderData}:Route.ComponentProps){return <ProductDetail key={loaderData.product.id} product={loaderData.product}/>;}

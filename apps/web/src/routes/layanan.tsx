import type { Route } from './+types/layanan';
import { getProducts } from '@/api/ecommerce-api';
import { ProductGrid } from '@/components/product-grid';
import { seo } from '@/lib/seo';
import { heroImage } from '@/data/content';
export async function loader() {
  try {
    return await getProducts({ exclude_types: 'subscription', limit: 100 });
  } catch {
    // Keep the services page accessible while the external Hostinger store is down.
    // ProductGrid already has an honest empty-catalogue state.
    console.warn('SNBM Creator storefront is currently unavailable.');
    return { products: [], count: 0, offset: 0, limit: 100 };
  }
}
export function meta({matches,location}:Route.MetaArgs){return seo({matches,location},{title:'Layanan & Janji Temu — SNBM Creator',description:'Temukan paket live shopping, produksi konten fashion, pelatihan host, dan konsultasi strategi SNBM Creator untuk kebutuhan brand Anda di Jakarta Barat.',image:heroImage,jsonLd:{'@context':'https://schema.org','@type':'CollectionPage',name:'Layanan SNBM Creator'}});}
export default function Services({loaderData}:Route.ComponentProps){return <main className="page-rail"><span className="eyebrow">MARI CIPTAKAN DAMPAK</span><h1>Layanan untuk<br/><span>langkah berikutnya.</span></h1><p className="page-intro">Pilih paket live shopping atau jadwalkan konsultasi. Kurasi host, kategori, serta kebutuhan kampanye dibahas bersama sebelum pelaksanaan.</p><p className="notice">Katalog dan harga awal berikut adalah contoh paket. Sesuaikan detail serta harga di pengelolaan toko sebelum menerima pesanan.</p><ProductGrid products={loaderData.products}/></main>;}

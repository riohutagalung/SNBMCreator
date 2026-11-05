import { Link } from 'react-router';
import { ArrowUpRight, Radio, Video, Users, CalendarDays } from 'lucide-react';
import type { ProductListItem } from '@/api/ecommerce-api';
export function ProductGrid({products}:{products:ProductListItem[]}) {
 const icons=[Radio,Video,Users,CalendarDays];
 return <section className="products-grid">{!products.length&&<p>Belum ada layanan tersedia. Hubungi kami untuk membahas kebutuhan Anda.</p>}{products.map((p,i)=>{const Icon=icons[i%icons.length];return <Link key={p.id} to={`/product/${p.url_handle}`} className="service-card"><span className="service-index">0{i+1}<Icon size={26}/></span><h2>{p.title}</h2><p>{p.description.replace(/<[^>]*>/g,'')}</p><div><strong>{p.price_formatted}</strong><span>{p.type.value==='booking'?'Pilih jadwal':'Lihat paket'} <ArrowUpRight size={18}/></span></div></Link>;})}</section>;
}
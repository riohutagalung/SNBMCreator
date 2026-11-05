import { Link } from 'react-router';
import type { Route } from './+types/checkout.cancelled';
import { seo } from '@/lib/seo';
export function meta({matches,location}:Route.MetaArgs){return seo({matches,location},{title:'Pemesanan Belum Selesai — SNBM Creator',description:'Pemesanan belum diselesaikan. Keranjang Anda tetap tersimpan dan Anda dapat melanjutkan kapan saja.',noindex:true});}
export default function Cancelled(){return <main className="page-rail"><h1>Tidak perlu terburu-buru.</h1><p>Pemesanan belum selesai dan tidak ada pembayaran yang dibebankan. Layanan pilihan Anda tetap ada di keranjang.</p><Link className="button" to="/cart">Kembali ke keranjang →</Link></main>;}

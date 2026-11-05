import { useEffect } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/checkout.success';
import { seo } from '@/lib/seo';
import { useCart } from '@/hooks/use-ecommerce-cart';
export function meta({matches,location}:Route.MetaArgs){return seo({matches,location},{title:'Pemesanan Selesai — SNBM Creator',description:'Terima kasih telah melanjutkan pemesanan layanan SNBM Creator. Periksa email untuk detail dan status pesanan.',noindex:true});}
export default function Success(){const {clear,isLoading}=useCart();useEffect(()=>{if(!isLoading)clear();},[clear,isLoading]);return <main className="page-rail"><span className="eyebrow">TERIMA KASIH</span><h1>Langkah pertama,<br/>sudah dimulai.</h1><p>Terima kasih! Anda telah kembali dari checkout. Periksa email untuk konfirmasi dan status pembayaran pesanan Anda.</p><Link className="button" to="/kontak">Diskusikan kebutuhan kampanye →</Link></main>;}

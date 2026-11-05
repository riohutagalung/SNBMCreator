import type { Route } from './+types/cart';
import { seo } from '@/lib/seo';
import { CartContent } from '@/components/cart-content';
export function meta({matches,location}:Route.MetaArgs){return seo({matches,location},{title:'Keranjang Layanan — SNBM Creator',description:'Tinjau layanan SNBM Creator yang Anda pilih sebelum melanjutkan pemesanan melalui checkout.',noindex:true});}
export default function CartPage(){return <CartContent/>;}

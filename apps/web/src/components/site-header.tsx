import { Link, NavLink } from 'react-router';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/use-ecommerce-cart';
export function SiteHeader() {
 const cart = useCart();
 return <header className="site-header"><Link className="brand" to="/">SNBM<span>CREATOR®</span></Link><nav aria-label="Navigasi utama"><NavLink to="/" end>Beranda</NavLink><a href="/#tentang">Tentang</a><NavLink to="/layanan">Layanan</NavLink><a href="/#host">Host kami</a><NavLink to="/blog">Insight</NavLink></nav><div className="header-actions"><Link to="/cart" className="cart-link" aria-label="Keranjang layanan"><ShoppingBag size={19}/><span>{cart.isLoading ? '–' : cart.itemCount}</span></Link><Link className="button small" to="/kontak">Mulai kolaborasi <ArrowUpRight size={17}/></Link></div></header>;
}
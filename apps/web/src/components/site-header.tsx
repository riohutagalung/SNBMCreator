import { Link, NavLink } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/lib/language';

export function SiteHeader() {
  const { language, setLanguage, pick } = useLanguage();
  return <header className="site-header refreshed-header">
    <Link className="brand brand-image" to="/" aria-label="SNBM Creator, beranda"><img src="/assets/snbm/logo.png" alt="SNBM Creator" width="165" height="90" /></Link>
    <nav aria-label={pick('Navigasi utama', 'Main navigation')}>
      <NavLink to="/" end>{pick('Beranda','Home')}</NavLink>
      <NavLink to="/tentang">{pick('Tentang kami','About')}</NavLink>
      <NavLink to="/layanan">{pick('Layanan','Services')}</NavLink>
      <a href="/#host">{pick('Pilihan host','Host profiles')}</a>
      <NavLink to="/blog">{pick('Artikel','Insights')}</NavLink>
    </nav>
    <div className="header-actions">
      <div className="language-switch" role="group" aria-label={pick('Pilihan bahasa','Language selector')}>
        <button type="button" aria-pressed={language === 'id'} className={language === 'id' ? 'selected' : ''} onClick={() => setLanguage('id')}>ID</button>
        <span aria-hidden="true">/</span>
        <button type="button" aria-pressed={language === 'en'} className={language === 'en' ? 'selected' : ''} onClick={() => setLanguage('en')}>EN</button>
      </div>
      <Link className="button small" to="/kontak">{pick('Mulai kolaborasi','Work with us')} <ArrowUpRight size={17}/></Link>
    </div>
  </header>;
}
import { Link } from 'react-router';
import { openCookiePreferences } from '@/lib/cookie-consent';
import { useLanguage } from '@/lib/language';
export function SiteFooter() {
  const { pick } = useLanguage();
  return <footer className="site-footer refreshed-footer" id="footer-contact">
    <div><Link className="brand brand-image" to="/"><img src="/assets/snbm/logo.png" alt="SNBM Creator" width="165" height="90" /></Link><p>{pick('Seller fashion sekaligus agensi pengembangan host live commerce. Berbasis di Jakarta Barat, Indonesia.','Fashion seller and live commerce host development agency based in West Jakarta, Indonesia.')}</p></div>
    <div><h3>{pick('Ada yang ingin dibicarakan?','Let’s talk.')}</h3><p>{pick('Untuk kerja sama brand, pertanyaan produk, atau pendaftaran host, hubungi tim kami.','For brand partnerships, product enquiries, or host applications, reach our team.')}</p><a className="footer-email" href="mailto:contact@snbmcreator.com">contact@snbmcreator.com</a><p><Link className="text-link" to="/kontak">{pick('Kirim permintaan kerja sama','Send an enquiry')}</Link></p></div>
    <div className="footer-links"><Link to="/tentang">{pick('Tentang SNBM','About SNBM')}</Link><Link to="/layanan">{pick('Layanan & kategori','Services & categories')}</Link><Link to="/gabung-host">{pick('Daftar menjadi host','Apply as a host')}</Link><Link to="/kontak">{pick('Hubungi kami','Contact')}</Link><Link to="/privasi">{pick('Kebijakan privasi','Privacy policy')}</Link><Link to="/syarat">{pick('Syarat penggunaan','Terms of use')}</Link><button onClick={openCookiePreferences}>{pick('Pengaturan cookie','Cookie preferences')}</button></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} SNBM Creator</span><span>{pick('Seller, host, dan brand dalam satu ekosistem.','Seller, hosts, and brands in one ecosystem.')}</span></div>
  </footer>;
}
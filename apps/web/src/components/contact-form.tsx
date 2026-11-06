import { Link, useSearchParams } from 'react-router';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { useLanguage } from '@/lib/language';
import { HostJoinForm } from '@/components/host-join-form';

export function ContactForm({ brandSettings = {} }: { brandSettings?: Record<string,string> }) {
  const [params, setParams] = useSearchParams();
  const isHost = params.get('jenis') === 'host';
  const isBrandFormOpen = brandSettings.brand_form_enabled === 'true';
  const { pick } = useLanguage();
  const form = useFormSubmission({ submit: async (_values, data) => {
    const response = await fetch('/api/brand-enquiry', { method: 'POST', body: data });
    if (!response.ok) throw new Error('Brand enquiry unavailable');
  } });
  return <main className="page-rail contact-page refreshed-contact">
    <div>
      <span className="eyebrow">{pick('MARI TERHUBUNG. MARI TAMPIL LIVE.','LET’S TALK. LET’S GO LIVE.')}</span>
      <h1>{pick('Koneksi dimulai','A connection starts')}<br/>{pick('dari ', 'with a ')}<span>{pick('sapaan.','conversation.')}</span></h1>
      <p className="page-intro">{!isHost && !isBrandFormOpen
        ? pick('Kami sedang menyiapkan tim host live shopping untuk kerja sama brand. Pendaftaran host tetap dibuka.', 'We are preparing our live-shopping host team for brand partnerships. Host applications remain open.')
        : pick('Punya brand yang ingin berkembang atau tertarik bergabung sebagai host? Pilih tujuanmu lalu isi formulir yang sesuai.','Represent a brand or interested in joining as a host? Choose your enquiry type and complete the relevant form.')}</p>
      <label className="contact-intent-label">{pick('Saya ingin','I would like to')}
        <select value={isHost ? 'host' : 'brand'} onChange={event => setParams({ jenis: event.target.value })}>
          <option value="brand">{pick('Bekerja sama sebagai brand','Discuss a brand partnership')}</option>
          <option value="host">{pick('Mendaftar sebagai host','Apply as a host')}</option>
        </select>
      </label>
      <p>{pick('Basis operasional:', 'Based in:')} <strong>{pick('Jakarta Barat, Indonesia.','West Jakarta, Indonesia.')}</strong><br/>{pick('Detail alamat studio dikonfirmasi sebelum kunjungan.','Studio visit details are confirmed by appointment.')}</p>
      <Link className="text-link" to="/privasi">{pick('Informasi pengelolaan data pribadi','How we handle personal information')}</Link>
    </div>
    {isHost ? <HostJoinForm/> : !isBrandFormOpen ? <section className="contact-form snbm-brand-coming-soon" aria-labelledby="snbm-brand-coming-soon-title">
      <span className="eyebrow">{pick('KOLABORASI BRAND', 'BRAND PARTNERSHIPS')}</span>
      <h2 id="snbm-brand-coming-soon-title">{pick(
        brandSettings.brand_coming_soon_title_id || 'Coming Soon — Kolaborasi Brand',
        brandSettings.brand_coming_soon_title_en || 'Coming Soon — Brand Partnerships'
      )}</h2>
      <p>{pick(
        brandSettings.brand_coming_soon_body_id || 'Kami sedang memilih dan mempersiapkan talenta host live shopping terbaik agar setiap kerja sama berjalan dengan maksimal. Formulir kerja sama brand akan kami buka setelah tim siap. Terima kasih sudah tertarik dengan SNBM Creator!',
        brandSettings.brand_coming_soon_body_en || 'We are carefully building our live-shopping host team. Brand partnership enquiries will open once our talent team is ready. Thank you for your interest in SNBM Creator!'
      )}</p>
      <p className="snbm-brand-coming-soon-note">{pick('Sementara ini, pendaftaran host tetap tersedia.', 'Host applications are still open.')}</p>
      <Link className="button" to="/gabung-host">{pick('Daftar jadi host', 'Apply as a host')}</Link>
    </section> : <form className="contact-form" onSubmit={form.onSubmit}>
      <input {...form.honeypotProps}/><input type="hidden" name="kind" value="Brand"/>
      <label>{pick('Nama lengkap','Full name')}<input name="name" required maxLength={120} placeholder={pick('Nama Anda','Your name')}/></label>
      <div className="form-pair"><label>Email<input name="email" required type="email" placeholder="nama@brand.com"/></label><label>{pick('Nomor WhatsApp','WhatsApp number')}<input name="phone" maxLength={30} type="tel" placeholder="08…"/></label></div>
      <label>{pick('Nama brand atau toko','Brand or shop name')}<input name="brand_name" required maxLength={160} placeholder={pick('Nama brand / toko','Brand or store')}/></label>
      <div className="form-pair"><label>{pick('Kategori produk','Product category')}<select name="product_category" required defaultValue=""><option value="" disabled>{pick('Pilih kategori','Choose a category')}</option>{['Fashion muslim','Fashion wanita','Tas wanita','Fashion anak','Underwear','Lainnya'].map(category=><option key={category} value={category}>{category}</option>)}</select></label><label>{pick('Platform live','Live platform')}<select name="platform" required defaultValue=""><option value="" disabled>{pick('Pilih platform','Choose a platform')}</option><option>TikTok Shop</option><option>Shopee Live</option><option>Instagram Live</option><option>Lainnya</option></select></label></div>
      <label>{pick('Tautan toko atau akun brand (opsional)','Store or brand account URL (optional)')}<input name="store_url" type="url" placeholder="https://"/></label>
      <label>{pick('Ceritakan kebutuhan kerja samanya','Tell us what you need')}<textarea name="message" required rows={5} maxLength={3000} placeholder={pick('Ceritakan produk, rencana live, dan bentuk kerja sama yang kamu cari.','Tell us about your products, live plans and what sort of partnership you have in mind.')}/></label>
      <label className="check-label"><input name="consent" type="checkbox" value="true" required/> {pick('Saya setuju data ini digunakan untuk menanggapi permintaan saya.','I agree to the use of my information to respond to this enquiry.')}</label>
      <button className="button" disabled={form.isSubmitting}>{form.isSubmitting ? pick('Mengirim…','Sending…') : pick('Kirim & mulai koneksi','Send enquiry')}</button>
      {form.isSuccess && <p role="status">{pick('Pesan berhasil tersimpan. Terima kasih!','Your enquiry has been received. Thank you!')}</p>}
      {form.isError && <p role="alert">{pick('Pesan belum terkirim. Coba kembali atau hubungi contact@snbmcreator.com.','Submission failed. Please retry or email contact@snbmcreator.com.')}</p>}
      {Object.entries(form.fieldErrors).map(([field, error])=><p key={field} role="alert">{field}: {error}</p>)}
    </form>}
  </main>;
}
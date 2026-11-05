import { Link, useSearchParams } from 'react-router';
import { pocketbaseClient } from '@/lib/pocketbase-client';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { useLanguage } from '@/lib/language';
import { HostJoinForm } from '@/components/host-join-form';

export function ContactForm() {
  const [params, setParams] = useSearchParams();
  const isHost = params.get('jenis') === 'host';
  const { pick } = useLanguage();
  const form = useFormSubmission({ submit: (_values, data) => pocketbaseClient.collection('snbm_enquiries').create(data) });
  return <main className="page-rail contact-page refreshed-contact">
    <div>
      <span className="eyebrow">{pick('MARI TERHUBUNG. MARI TAMPIL LIVE.','LET’S TALK. LET’S GO LIVE.')}</span>
      <h1>{pick('Koneksi dimulai','A connection starts')}<br/>{pick('dari ', 'with a ')}<span>{pick('sapaan.','conversation.')}</span></h1>
      <p className="page-intro">{pick('Punya brand yang ingin berkembang atau tertarik bergabung sebagai host? Pilih tujuanmu lalu isi formulir yang sesuai.','Represent a brand or interested in joining as a host? Choose your enquiry type and complete the relevant form.')}</p>
      <label className="contact-intent-label">{pick('Saya ingin','I would like to')}
        <select value={isHost ? 'host' : 'brand'} onChange={event => setParams({ jenis: event.target.value })}>
          <option value="brand">{pick('Bekerja sama sebagai brand','Discuss a brand partnership')}</option>
          <option value="host">{pick('Mendaftar sebagai host','Apply as a host')}</option>
        </select>
      </label>
      <p>{pick('Basis operasional:', 'Based in:')} <strong>{pick('Jakarta Barat, Indonesia.','West Jakarta, Indonesia.')}</strong><br/>{pick('Detail alamat studio dikonfirmasi sebelum kunjungan.','Studio visit details are confirmed by appointment.')}</p>
      <Link className="text-link" to="/privasi">{pick('Informasi pengelolaan data pribadi','How we handle personal information')}</Link>
    </div>
    {isHost ? <HostJoinForm/> : <form className="contact-form" onSubmit={form.onSubmit}>
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
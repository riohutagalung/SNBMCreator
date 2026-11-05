import { Link, useSearchParams } from 'react-router';
import { pocketbaseClient } from '@/lib/pocketbase-client';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { useLanguage } from '@/lib/language';
import { HostJoinForm } from '@/components/host-join-form';

export function ContactForm() {
 const [params, setParams] = useSearchParams();
 const isHost = params.get('jenis') === 'host';
 const { pick } = useLanguage();
 const form = useFormSubmission({submit: (_values,data) => pocketbaseClient.collection('snbm_enquiries').create(data)});
 return <main className="page-rail contact-page refreshed-contact"><div>
  <span className="eyebrow">{pick('MULAI KOLABORASI','LET’S WORK TOGETHER')}</span>
  <h1>{pick('Ceritakan kebutuhanmu.','Tell us what you need.')}</h1>
  <p className="page-intro">{pick('Pilih jalur yang sesuai. Brand dan calon host punya formulir yang berbeda agar tim kami bisa meninjau informasi yang tepat.','Choose the right path. Brands and host applicants have different forms so we can review the right information.')}</p>
  <div className="contact-choice" role="group" aria-label={pick('Jenis kolaborasi','Enquiry type')}>
   <button type="button" className={!isHost?'selected':''} onClick={()=>setParams({jenis:'brand'})}>{pick('Kerja sama brand','Brand partnership')}</button>
   <button type="button" className={isHost?'selected':''} onClick={()=>setParams({jenis:'host'})}>{pick('Mendaftar sebagai host','Apply as a host')}</button>
  </div>
  <p>{pick('Untuk pertanyaan umum, kirim email ke','For general enquiries, email')} <a href="mailto:contact@snbmcreator.com">contact@snbmcreator.com</a>.</p>
  <p className="subtle">{pick('Berbasis di Jakarta Barat, Indonesia. Alamat kunjungan dibagikan setelah ada janji.','Based in West Jakarta, Indonesia. Meeting details are confirmed by appointment.')}</p>
  <Link className="text-link" to="/privasi">{pick('Cara kami mengelola data pelamar','How we handle applicants’ information')}</Link>
 </div>
 {isHost ? <HostJoinForm/> : <form className="contact-form" onSubmit={form.onSubmit}>
  <input {...form.honeypotProps}/>
  <input type="hidden" name="kind" value="Brand" />
  <label>{pick('Nama penanggung jawab','Contact name')}<input name="name" required maxLength={120} placeholder={pick('Nama lengkap','Full name')}/></label>
  <div className="form-pair"><label>{pick('Email bisnis','Business email')}<input name="email" type="email" required placeholder="nama@brand.com"/></label><label>{pick('Nomor WhatsApp','WhatsApp number')}<input name="phone" type="tel" maxLength={30} placeholder="+62..."/></label></div>
  <label>{pick('Nama brand / toko','Brand or store name')}<input name="brand_name" required maxLength={160} placeholder={pick('Nama brand atau toko','Brand or shop name')}/></label>
  <div className="form-pair"><label>{pick('Kategori produk','Product category')}<select name="product_category" required defaultValue=""><option value="" disabled>{pick('Pilih kategori','Select category')}</option>{['Fashion muslim','Fashion wanita','Tas wanita','Fashion anak','Underwear','Lainnya'].map(x=><option key={x} value={x}>{x}</option>)}</select></label><label>{pick('Platform live','Live platform')}<select name="platform" required defaultValue=""><option value="" disabled>{pick('Pilih platform','Select platform')}</option><option>TikTok Shop</option><option>Shopee Live</option><option>Instagram Live</option><option>Lainnya</option></select></label></div>
  <label>{pick('Kebutuhan kerja sama','What do you need?')}<select name="service_interest" required defaultValue=""><option value="" disabled>{pick('Pilih kebutuhan','Select service')}</option><option value="Host in-house">{pick('Host in-house','In-house host')}</option><option value="Host freelance">{pick('Host freelance','Freelance host')}</option><option value="Operasional live">{pick('Operasional live shopping','Live-shopping operations')}</option><option value="Kerja sama penjualan">{pick('Kerja sama penjualan produk','Product sales partnership')}</option><option value="Diskusi awal">{pick('Diskusi kebutuhan','Initial consultation')}</option></select></label>
  <label>{pick('Tautan toko atau akun brand','Store or brand profile URL')}<input name="store_url" type="url" placeholder="https://"/></label>
  <label>{pick('Ceritakan produk dan target kerja samanya','Tell us about your products and goals')}<textarea name="message" required rows={5} maxLength={3000} placeholder={pick('Sebutkan produk, frekuensi live, target, dan hal yang perlu kami ketahui.','Tell us about your products, schedule, objectives, and anything else we should know.')}/></label>
  <label className="check-label"><input name="consent" type="checkbox" value="true" required/> {pick('Saya menyetujui penggunaan data ini untuk ditindaklanjuti oleh tim SNBM Creator.','I agree to the use of this data to respond to my enquiry.')}</label>
  <button className="button" disabled={form.isSubmitting}>{form.isSubmitting ? pick('Mengirim...','Sending...') : pick('Kirim permintaan','Send enquiry')}</button>
  {form.isSuccess && <p role="status">{pick('Pesan sudah tersimpan. Terima kasih, kami akan meninjaunya.','Your enquiry has been received. Thank you.')}</p>}
  {form.isError && <p role="alert">{pick('Belum berhasil dikirim. Jika layanan sedang tidak tersedia, silakan email contact@snbmcreator.com.','Submission was not completed. If the service is unavailable, please email contact@snbmcreator.com.')}</p>}
  {Object.entries(form.fieldErrors).map(([key,error])=><p key={key} role="alert">{key}: {error}</p>)}
 </form>}
 </main>;
}
import { useState } from 'react';
import { pocketbaseClient } from '@/lib/pocketbase-client';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { useLanguage } from '@/lib/language';

const MAX_CV = 10 * 1024 * 1024;
const MAX_VIDEO = 50 * 1024 * 1024;
export function HostJoinForm() {
 const { pick } = useLanguage();
 const [uploadError,setUploadError] = useState('');
 const form = useFormSubmission({ submit: async (_values,data) => {
   const cv = data.get('cv_file');
   const video = data.get('trial_video');
   const link = String(data.get('trial_video_url') || '').trim();
   if (!(cv instanceof File) || !cv.size) throw new Error('CV wajib diunggah');
   if (cv.size > MAX_CV) throw new Error('CV maksimal 10 MB');
   if (video instanceof File && video.size > MAX_VIDEO) throw new Error('Video maksimal 50 MB');
   if (!(video instanceof File && video.size) && !link) throw new Error('Unggah video atau sertakan tautan video trial');
   if (video instanceof File && !video.size) data.delete('trial_video');
   if (link && !/^https:\/\//i.test(link)) throw new Error('Tautan video harus menggunakan HTTPS');
   await pocketbaseClient.collection('snbm_host_applications').create(data);
 }});
 return <form className="contact-form" onSubmit={event=>{
   const data = new FormData(event.currentTarget);
   const cv = data.get('cv_file'); const video = data.get('trial_video');
   if(!(cv instanceof File) || !cv.size){event.preventDefault();setUploadError(pick('Mohon unggah CV.','Please upload your CV.'));return;}
   if(cv.size>MAX_CV || (video instanceof File && video.size>MAX_VIDEO)){event.preventDefault();setUploadError(pick('Ukuran file melebihi batas: CV 10 MB, video 50 MB.','File too large: CV limit 10 MB, video limit 50 MB.'));return;}
   if(!(video instanceof File && video.size) && !String(data.get('trial_video_url')||'').trim()){event.preventDefault();setUploadError(pick('Lampirkan video trial atau tautannya.','Upload a trial video or provide a link.'));return;}
   setUploadError('');void form.onSubmit(event);
 }} encType="multipart/form-data">
  <input {...form.honeypotProps}/>
  <label>{pick('Nama lengkap','Full name')}<input name="name" required maxLength={120} placeholder={pick('Nama sesuai CV','Name on your CV')}/></label>
  <div className="form-pair"><label>Email<input name="email" required type="email"/></label><label>{pick('Nomor WhatsApp','WhatsApp number')}<input name="phone" required type="tel" maxLength={30}/></label></div>
  <div className="form-pair"><label>{pick('Pilihan kerja','Preferred role')}<select name="employment_type" defaultValue="Full time"><option value="Full time">{pick('In-house full time','Full-time in-house')}</option><option value="Freelance">{pick('Freelance part time','Part-time freelance')}</option></select></label><label>{pick('Domisili','City')}<input name="city" maxLength={120} placeholder="Jakarta"/></label></div>
  <div className="form-pair"><label>{pick('Kategori ukuran','Fit category')}<select name="size_type" required><option value="Reguler (55-65 kg)">{pick('Reguler','Regular')}</option><option value="Big size (75-100 kg)">{pick('Big size','Plus size')}</option></select></label><label>{pick('Gaya penampilan','Presentation style')}<select name="style" required defaultValue=""><option value="" disabled>{pick('Pilih gaya','Select style')}</option><option value="Hijab">Hijab</option><option value="Nonhijab">{pick('Nonhijab','Non-hijab')}</option><option value="Bisa keduanya">{pick('Bisa keduanya','Both')}</option></select></label></div>
  <div className="form-pair"><label>{pick('Berat badan (kg)','Weight (kg)')}<input name="weight" type="number" min="1" max="200"/></label><label>{pick('Kategori produk yang dikuasai','Product expertise')}<input name="category" maxLength={200} placeholder={pick('Fashion muslim, tas, dll.','Modest fashion, bags, etc.')}/></label></div>
  <label>{pick('Pengalaman sebagai host','Your hosting experience')}<textarea name="experience" required maxLength={2000} rows={4} placeholder={pick('Platform yang pernah dipakai, jenis produk, dan pengalaman yang relevan.','Platforms, product categories, and relevant past work.')}/></label>
  <div className="form-pair"><label>{pick('Rata-rata live per hari (jam)','Average live hours per day')}<input name="daily_live_hours" type="number" step="0.5" min="0" max="24" required placeholder="4"/></label><label>{pick('GMV tertinggi dalam satu hari (Rp)','Highest single-day GMV (IDR)')}<input name="best_daily_gmv" type="number" min="0" step="1" required placeholder="1000000"/></label></div>
  <label>{pick('Akun media sosial dan akun live','Social media and live account links')}<textarea name="social_accounts" required maxLength={1200} rows={3} placeholder="https://www.tiktok.com/@..."/></label>
  <label>{pick('Portofolio tambahan (opsional)','Additional portfolio URL (optional)')}<input name="portfolio_url" type="url" placeholder="https://"/></label>
  <label>{pick('Unggah CV (PDF, DOC, DOCX; maks. 10 MB)','Upload CV (PDF, DOC, DOCX; max. 10 MB)')}<input name="cv_file" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required/></label>
  <label>{pick('Unggah video saat live (MP4, MOV, WEBM; maks. 50 MB)','Upload sample live video (MP4, MOV, WEBM; max. 50 MB)')}<input name="trial_video" type="file" accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"/></label>
  <label>{pick('Atau tautan video trial (Google Drive, YouTube, dll.)','Or trial video link (Google Drive, YouTube, etc.)')}<input name="trial_video_url" type="url" placeholder="https://"/></label>
  <p className="subtle">{pick('Wajib melampirkan salah satu: file video atau tautan video yang bisa dibuka tim rekrutmen. Pastikan izin akses tautannya sudah sesuai.','Submit either a video file or a link accessible to the recruitment team. Please check link permissions.')}</p>
  <label className="check-label"><input name="consent" type="checkbox" value="true" required/> {pick('Saya setuju data dan lampiran digunakan untuk proses seleksi host SNBM Creator.','I consent to the use of my information and attachments for recruitment.')}</label>
  <button className="button" disabled={form.isSubmitting}>{form.isSubmitting?pick('Mengunggah dan mengirim...','Uploading and submitting...'):pick('Kirim pendaftaran host','Submit host application')}</button>
  {uploadError && <p role="alert">{uploadError}</p>}
  {form.isSuccess && <p role="status">{pick('Pendaftaran terkirim. Terima kasih, tim kami akan meninjau dokumenmu.','Application received. Thank you, our team will review your documents.')}</p>}
  {form.isError && <p role="alert">{pick('Pendaftaran belum tersimpan. Layanan formulir mungkin belum aktif. Silakan hubungi contact@snbmcreator.com.','Application could not be saved. The form service may not be active yet. Contact contact@snbmcreator.com.')}</p>}
  {Object.entries(form.fieldErrors).map(([key,error])=><p role="alert" key={key}>{key}: {error}</p>)}
 </form>;
}
import { pocketbaseClient } from '@/lib/pocketbase-client';
import { useFormSubmission } from '@/hooks/use-form-submission';

export function HostJoinForm() {
	const form = useFormSubmission({
		submit: (_values, data) => pocketbaseClient.collection('snbm_host_applications').create(data),
	});

	return (
		<form className="contact-form" onSubmit={form.onSubmit}>
			<input {...form.honeypotProps} />
			<label>Nama lengkap<input name="name" required maxLength={120} placeholder="Nama Anda" /></label>
			<div className="form-pair">
				<label>Email<input name="email" required type="email" placeholder="nama@email.com" /></label>
				<label>Nomor WhatsApp<input name="phone" required type="tel" maxLength={30} placeholder="08…" /></label>
			</div>
			<label>Status keanggotaan
				<select name="employment_type" defaultValue="Full time">
					<option value="Full time">Host Full time</option>
					<option value="Freelance">Host Freelance</option>
				</select>
			</label>
			<div className="form-pair">
				<label>Tipe ukuran tubuh
					<select name="size_type" defaultValue="Reguler (55-65 kg)">
						<option value="Reguler (55-65 kg)">Reguler (55–65 kg)</option>
						<option value="Big size (75-100 kg)">Big size (75–100 kg)</option>
					</select>
				</label>
				<label>Gaya
					<select name="style" defaultValue="">
						<option value="">Pilih gaya</option>
						<option value="Hijab">Hijab</option>
						<option value="Nonhijab">Nonhijab</option>
						<option value="Bisa keduanya">Bisa keduanya</option>
					</select>
				</label>
			</div>
			<div className="form-pair">
				<label>Berat badan (kg)<input name="weight" type="number" min={1} max={200} placeholder="kg" /></label>
				<label>Kota domisili<input name="city" maxLength={120} placeholder="Jakarta Barat" /></label>
			</div>
			<label>Kategori fashion yang dikuasai<input name="category" maxLength={200} placeholder="Fashion muslim, tas wanita, dll." /></label>
			<label>Link portofolio / akun live (opsional)<input name="portfolio_url" type="url" placeholder="https://" /></label>
			<label>Pengalaman live shopping Anda<textarea name="experience" maxLength={2000} rows={4} placeholder="Ceritakan pengalaman, platform yang pernah dipakai, dll." /></label>
			<label className="check-label"><input type="checkbox" name="consent" value="true" required /> Saya setuju data ini digunakan SNBM Creator untuk meninjau pendaftaran saya.</label>
			<button className="button" disabled={form.isSubmitting}>{form.isSubmitting ? 'Mengirim…' : 'Kirim pendaftaran ↗'}</button>
			{form.isSuccess && <p role="status">Terima kasih! Pendaftaran host Anda tersimpan dan akan ditinjau tim SNBM Creator.</p>}
			{form.isError && <p role="alert">Pendaftaran belum terkirim. Periksa isian dan coba kembali.</p>}
			{Object.keys(form.fieldErrors).length > 0 && <p role="alert">Pastikan nama, email, WhatsApp, dan persetujuan terisi dengan benar.</p>}
		</form>
	);
}

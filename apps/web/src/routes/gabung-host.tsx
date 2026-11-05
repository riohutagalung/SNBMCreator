import type { Route } from './+types/gabung-host';
import { seo } from '@/lib/seo';
import { heroImage } from '@/data/content';
import { HostJoinForm } from '@/components/host-join-form';

export function meta({ matches, location }: Route.MetaArgs) {
	return seo({ matches, location }, {
		title: 'Gabung Jadi Host — SNBM Creator',
		description: 'Daftar sebagai host full time atau freelance untuk live shopping fashion. Reguler 55–65 kg dan big size 75–100 kg, hijab maupun nonhijab, bersama SNBM Creator.',
		image: heroImage,
	});
}

export default function GabungHost() {
	return (
		<main className="page-rail contact-page">
			<div>
				<span className="eyebrow">GABUNG TIM HOST SNBM</span>
				<h1>Jadi host.<br/>Tampil <span>full time</span> atau freelance.</h1>
				<p className="page-intro">Punya energi di depan kamera? Bergabunglah sebagai host creator untuk live shopping fashion. Pilih status full time atau freelance, sesuaikan dengan kategori dan gaya Anda.</p>
				<p>Kategori kami: <strong>fashion muslim, fashion wanita, tas wanita, fashion anak, underwear.</strong></p>
				<p className="subtle">Pendaftaran ditinjau tim SNBM Creator. Data Anda tidak ditampilkan ke publik.</p>
			</div>
			<HostJoinForm />
		</main>
	);
}

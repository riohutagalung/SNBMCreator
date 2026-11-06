import { useState } from 'react';
import { ClientResponseError } from 'pocketbase';
import type { Route } from './+types/login';
import { useNavigate } from 'react-router';
import { seo } from '@/lib/seo';
import { useAuth } from '@/hooks/use-auth';

export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'Masuk Admin — SNBM Creator',
    description: 'Halaman masuk untuk admin SNBM Creator.',
    noindex: true,
  });
}

export default function Login() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const auth = await login(email.trim(), password);
      if (auth.record?.role !== 'admin') {
        logout();
        setError('Akun berhasil dikenali, tetapi belum memiliki akses admin. Periksa role akun di PocketBase.');
        return;
      }
      navigate('/admin');
    } catch (error) {
      const status = error instanceof ClientResponseError ? error.status : 0;
      if (status === 400 || status === 401) {
        setError('Login tidak berhasil. Pastikan akun admin sudah dibuat di PocketBase dan email serta kata sandinya sesuai.');
      } else if (status === 404) {
        setError('Layanan login PocketBase tidak ditemukan. Periksa alamat API PocketBase di konfigurasi website.');
      } else {
        setError('Tidak dapat menghubungi layanan login. Periksa koneksi dan konfigurasi PocketBase, lalu coba lagi.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page-rail" style={{ maxWidth: 460, margin: '0 auto' }}>
      <span className="eyebrow">PANEL ADMIN SNBM</span>
      <h1>Masuk ke<br/><span>dashboard.</span></h1>
      <form className="contact-form" onSubmit={onSubmit} style={{ marginTop: 28 }}>
        <label>Email<input name="email" type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="Email admin yang disetel saat deployment"/></label>
        <label>Kata sandi<input name="password" type="password" required value={password} onChange={event => setPassword(event.target.value)} placeholder="Kata sandi admin"/></label>
        <button className="button" disabled={busy}>{busy ? 'Memeriksa…' : 'Masuk →'}</button>
        {error && <p role="alert">{error}</p>}
      </form>
    </main>
  );
}

import { useState } from 'react';
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
  const { login } = useAuth();
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
      await login(email, password);
      navigate('/admin');
    } catch {
      setError('Email atau kata sandi salah. Coba kembali.');
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

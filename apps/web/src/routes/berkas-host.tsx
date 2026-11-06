import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { Route } from './+types/berkas-host';
import { requireAuth } from '@/lib/require-auth';
import { supabase } from '@/lib/supabase-client';
import { seo } from '@/lib/seo';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'Berkas Pendaftar — SNBM Creator',
    description: 'Akses privat CV dan video pendaftar host untuk tim admin SNBM Creator.',
    noindex: true,
  });
}

// This is a browser-side route; the actual protection is Supabase RLS on both
// the application row and the private Storage bucket.
export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const backToFile = url.pathname + url.search;
  await requireAuth('/login?next=' + encodeURIComponent(backToFile));
  return null;
}
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <main className="page-rail"><p role="status">Memverifikasi akses admin…</p></main>;
}

export default function BerkasHost() {
  const [params] = useSearchParams();
  const id = params.get('id') || '';
  const jenis = params.get('jenis') || '';
  const [error, setError] = useState('');
  const [fileLink, setFileLink] = useState('');

  useEffect(() => {
    let alive = true;
    async function openPrivateFile() {
      if (!supabase || !UUID.test(id) || (jenis !== 'cv' && jenis !== 'video')) {
        if (alive) setError('Tautan berkas tidak valid.');
        return;
      }
      try {
        // Only select a DB-owned object path; never trust a path from URL.
        const { data: application, error: lookupError } = await supabase
          .from('snbm_host_applications')
          .select('cv_path,trial_video_path')
          .eq('id', id)
          .single();
        if (lookupError || !application) throw new Error('Data pendaftar tidak ditemukan atau akses ditolak.');
        const path = jenis === 'cv' ? application.cv_path : application.trial_video_path;
        if (!path) throw new Error('Berkas ini tidak tersedia untuk pendaftar tersebut.');
        const { data: signed, error: signError } = await supabase.storage
          .from('snbm-host-private').createSignedUrl(path, 60);
        if (signError || !signed?.signedUrl) throw new Error('Tidak bisa membuat tautan berkas. Coba lagi.');
        if (!alive) return;
        setFileLink(signed.signedUrl);
        window.location.replace(signed.signedUrl);
      } catch (cause) {
        if (alive) setError(cause instanceof Error ? cause.message : 'Berkas tidak dapat dibuka.');
      }
    }
    void openPrivateFile();
    return () => { alive = false; };
  }, [id, jenis]);

  return <main className="page-rail" style={{ maxWidth: 560, margin: '0 auto' }}>
    <span className="eyebrow">BERKAS HOST — AKSES ADMIN</span>
    <h1>{jenis === 'cv' ? 'CV pendaftar.' : 'Video pendaftar.'}</h1>
    {!error && <p role="status">Memeriksa izin dan menyiapkan berkas privat…</p>}
    {error && <p role="alert">{error}</p>}
    {fileLink && <p><a href={fileLink}>Klik untuk membuka berkas</a></p>}
    <p><Link className="text-link" to="/admin">← Kembali ke Dashboard Admin</Link></p>
  </main>;
}

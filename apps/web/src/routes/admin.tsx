import { useState } from 'react';
import type { Route } from './+types/admin';
import { Link } from 'react-router';
import { seo } from '@/lib/seo';
import { requireAuth } from '@/lib/require-auth';
import { useAuth } from '@/hooks/use-auth';
import { useSupabaseRecords } from '@/hooks/use-supabase-records';
import { supabase } from '@/lib/supabase-client';

export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'Dashboard Admin — SNBM Creator',
    description: 'Panel admin SNBM Creator.',
    noindex: true,
  });
}

export async function clientLoader() {
  const user = await requireAuth();
  return { user };
}
clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <div />;
}

interface BaseRow { id: string; created_at?: string; }
interface Enquiry extends BaseRow {
  name: string; email: string; phone: string; kind: string; message: string;
  city: string; weight: number; style: string; created_at: string;
}
interface HostApp extends BaseRow {
  cv_path?: string; trial_video_path?: string;
  name: string; email: string; phone: string; city: string;
  employment_type: string; size_type: string; style: string; weight: number;
  category: string; experience: string; portfolio_url: string; status: string; created_at: string;
}
interface Contact extends BaseRow { email: string; created_at: string; }
interface ContentRow extends BaseRow { key: string; label: string; type: string; value: string; }

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' });
  } catch { return iso; }
};

export default function Admin() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<'ringkas' | 'host' | 'kontak' | 'konten'>('ringkas');

  const enquiries = useSupabaseRecords<Enquiry>('snbm_enquiries', { sort: '-created_at', realtime: true });
  const hosts = useSupabaseRecords<HostApp>('snbm_host_applications', { sort: '-created_at', realtime: true });
  const contacts = useSupabaseRecords<Contact>('snbm_contacts', { sort: '-created_at', realtime: true });
  const content = useSupabaseRecords<ContentRow>('snbm_content', { sort: 'label', realtime: true });

  const tabs: { id: typeof tab; label: string; count: number }[] = [
    { id: 'ringkas', label: 'Ringkasan', count: 0 },
    { id: 'host', label: 'Pendaftar host', count: hosts.records.length },
    { id: 'kontak', label: 'Kontak masuk', count: enquiries.records.length },
    { id: 'konten', label: 'Konten & tampilan', count: content.records.length },
  ];

  return (
    <main className="page-rail admin-page">
      <div className="admin-top">
        <div>
          <span className="eyebrow">PANEL ADMIN SNBM</span>
          <h1>Dashboard.</h1>
          <p className="page-intro">Masuk sebagai <strong>{user?.email}</strong>. Kelola pendaftar host, kontak masuk, dan konten situs.</p>
        </div>
        <button className="button small" onClick={() => { void logout().then(() => { window.location.assign('/login'); }); }}>Keluar</button>
      </div>

      <nav className="filter-row admin-tabs">
        {tabs.map(t => (
          <button key={t.id} className={t.id === tab ? 'selected' : ''} aria-pressed={t.id === tab} onClick={() => setTab(t.id)}>
            {t.label}{t.count > 0 ? ` (${t.count})` : ''}
          </button>
        ))}
      </nav>

      {tab === 'ringkas' && (
        <div className="admin-grid">
          <div className="gmv-panel">
            <div className="gmv-header"><strong>Pendaftar host</strong><span>{hosts.records.length}</span></div>
            <p className="subtle">Full time & freelance. {hosts.records.filter(h => (h.status || 'baru') === 'baru').length} baru perlu ditinjau.</p>
            <button className="button small" onClick={() => setTab('host')}>Lihat pendaftar →</button>
          </div>
          <div className="gmv-panel">
            <div className="gmv-header"><strong>Kontak masuk</strong><span>{enquiries.records.length}</span></div>
            <p className="subtle">Brand, calon host, dan pertanyaan.</p>
            <button className="button small" onClick={() => setTab('kontak')}>Lihat kontak →</button>
          </div>
          <div className="gmv-panel">
            <div className="gmv-header"><strong>Pendaftar newsletter</strong><span>{contacts.records.length}</span></div>
            <p className="subtle">Email yang mendaftar dari footer.</p>
          </div>
          <div className="gmv-panel">
            <div className="gmv-header"><strong>Konten & tampilan</strong><span>{content.records.length}</span></div>
            <p className="subtle">Ubah teks, tautan gambar, kategori, profil host, dan bagian utama tanpa mengubah kode.</p>
            <button className="button small" onClick={() => setTab('konten')}>Kelola situs →</button>
          </div>
        </div>
      )}

      {tab === 'host' && (
        <section>
          {hosts.isLoading ? <p role="status">Memuat pendaftar…</p> :
            hosts.error ? <p role="alert">Gagal memuat. <button onClick={() => void hosts.reload()}>Coba lagi</button></p> :
            hosts.records.length === 0 ? <p className="subtle">Belum ada pendaftar host.</p> :
            <div className="admin-list">
              {hosts.records.map(h => (
                <HostCard key={h.id} host={h} onUpdate={(status) => hosts.update(h.id, { status })} />
              ))}
            </div>}
        </section>
      )}

      {tab === 'kontak' && (
        <section>
          {enquiries.isLoading ? <p role="status">Memuat kontak…</p> :
            enquiries.error ? <p role="alert">Gagal memuat. <button onClick={() => void enquiries.reload()}>Coba lagi</button></p> :
            enquiries.records.length === 0 ? <p className="subtle">Belum ada kontak masuk.</p> :
            <div className="admin-list">
              {enquiries.records.map(e => (
                <article key={e.id} className="admin-card">
                  <div className="admin-card-head">
                    <strong>{e.name}</strong>
                    <span className="admin-tag">{e.kind}</span>
                  </div>
                  <p><a href={`mailto:${e.email}`}>{e.email}</a>{e.phone ? ` · ${e.phone}` : ''}{e.city ? ` · ${e.city}` : ''}</p>
                  {e.weight ? <small>Berat: {e.weight} kg</small> : null}{e.style ? <small> · {e.style}</small> : null}
                  <p className="admin-msg">{e.message}</p>
                  <small className="admin-date">{fmtDate(e.created_at)}</small>
                </article>
              ))}
            </div>}
        </section>
      )}

      {tab === 'konten' && (
        <section>
          <p className="subtle">Edit konten situs di sini. Gunakan URL gambar publik untuk kolom gambar. Untuk kolom bertipe area teks, baris baru dipertahankan di halaman. Perubahan disimpan ke Supabase dan langsung dibaca pada kunjungan halaman berikutnya.</p>
          {content.isLoading ? <p role="status">Memuat konten…</p> :
            content.error ? <p role="alert">Gagal memuat. <button onClick={() => void content.reload()}>Coba lagi</button></p> :
            <div className="admin-list">
              {content.records.map(c => <ContentEditor key={c.id} row={c} onSave={(value) => content.update(c.id, { value })} />)}
            </div>}
        </section>
      )}

      <p className="subtle" style={{ marginTop: 30 }}><Link to="/">← Kembali ke situs</Link></p>
    </main>
  );
}

function HostCard({ host, onUpdate }: { host: HostApp; onUpdate: (status: string) => void }) {
  const statuses = ['baru', 'ditinjau', 'diterima', 'ditolak'];
  const current = host.status || 'baru';
  const [files, setFiles] = useState<Record<string,string>>({});
  const [fileError, setFileError] = useState('');
  const showFile = async (path: string, kind: string) => {
    if (!supabase) { setFileError('Supabase belum tersedia.'); return; }
    const { data, error } = await supabase.storage.from('snbm-host-private').createSignedUrl(path, 60);
    if (error || !data?.signedUrl) { setFileError('Tidak bisa membuka berkas. Periksa akses admin.'); return; }
    setFiles(current => ({ ...current, [kind]: data.signedUrl }));
    setFileError('');
  };
  return (
    <article className="admin-card">
      <div className="admin-card-head">
        <strong>{host.name}</strong>
        <span className="admin-tag">{host.employment_type}</span>
      </div>
      <p><a href={`mailto:${host.email}`}>{host.email}</a>{host.phone ? ` · ${host.phone}` : ''}{host.city ? ` · ${host.city}` : ''}</p>
      <p><small>{host.size_type}{host.style ? ` · ${host.style}` : ''}{host.weight ? ` · ${host.weight} kg` : ''}</small></p>
      {host.category && <p><small>Kategori: {host.category}</small></p>}
      {host.experience && <p className="admin-msg">{host.experience}</p>}
      {host.portfolio_url && <p><a href={host.portfolio_url} target="_blank" rel="noreferrer">Lihat portofolio ↗</a></p>}
      {host.cv_path && <p><button type="button" onClick={() => { void showFile(host.cv_path!, 'cv'); }}>Siapkan tautan CV (60 detik)</button> {files.cv && <a href={files.cv} target="_blank" rel="noreferrer">Buka CV ↗</a>}</p>}
      {host.trial_video_path && <p><button type="button" onClick={() => { void showFile(host.trial_video_path!, 'video'); }}>Siapkan tautan video (60 detik)</button> {files.video && <a href={files.video} target="_blank" rel="noreferrer">Buka video ↗</a>}</p>}
      {fileError && <p role="alert">{fileError}</p>}
      <div className="admin-status">
        {statuses.map(s => (
          <button key={s} className={`admin-chip ${s === current ? 'selected' : ''}`} onClick={() => onUpdate(s)}>{s}</button>
        ))}
      </div>
      <small className="admin-date">{fmtDate(host.created_at)}</small>
    </article>
  );
}

function ContentEditor({ row, onSave }: { row: ContentRow; onSave: (value: string) => Promise<unknown> }) {
  const [value, setValue] = useState(row.value || '');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      await onSave(value);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Gagal menyimpan. Periksa koneksi dan hak akses admin, lalu coba lagi.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="admin-card">
      <div className="admin-card-head"><strong>{row.label || row.key}</strong><span className="admin-tag">{row.type}</span></div>
      {row.key === 'brand_form_enabled' ? (
        <select aria-label="Status formulir kerja sama brand" value={value === 'true' ? 'true' : 'false'} onChange={e => setValue(e.target.value)}>
          <option value="false">Coming Soon — formulir brand ditutup</option>
          <option value="true">Aktif — formulir brand menerima permintaan</option>
        </select>
      ) : row.key === 'brand_logo_font' ? (
        <select aria-label="Font logo SNBM Creator" value={value === 'Plus Jakarta Sans' ? 'Plus Jakarta Sans' : 'Space Grotesk'} onChange={e => setValue(e.target.value)}>
          <option value="Space Grotesk">Space Grotesk (model pertama)</option>
          <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
        </select>
      ) : row.type === 'textarea' ? (
        <textarea value={value} onChange={e => setValue(e.target.value)} rows={4} />
      ) : row.type === 'color' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input aria-label={row.label} type="color" value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#2456ff'} onChange={e => setValue(e.target.value)} style={{ width: 64, height: 42, padding: 3 }} />
          <code>{value}</code>
        </div>
      ) : (
        <input value={value} onChange={e => setValue(e.target.value)} />
      )}
      {row.type === 'image' && value && <img src={value} alt="" className="admin-thumb" />}
      <div className="admin-status">
        <button className="button small" disabled={busy || value === (row.value || '')} onClick={save}>{busy ? 'Menyimpan…' : 'Simpan'}</button>
        {saved && <small className="admin-date">Tersimpan ✓</small>}
        {error && <small className="admin-date" role="alert">{error}</small>}
      </div>
    </article>
  );
}

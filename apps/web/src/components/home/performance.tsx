import type { RecordModel } from 'pocketbase';
import { usePocketbaseRecords } from '@/hooks/use-pocketbase-records';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';

interface Gmv extends RecordModel { host_name: string; period: string; target: number; achieved: number; source: string; }
type SiteContent = Record<string, string>;

const money = (n: number) => n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export function Performance({ content = {} }: { content?: SiteContent }) {
  const gmv = usePocketbaseRecords<Gmv>('snbm_gmv', { sort: '-created' });
  return (
    <section className="performance section-rail" id="gmv">
      <div>
        <span className="eyebrow">{content.performance_eyebrow || '04 / PERFORMA YANG BERARTI'}</span>
        <h2 style={{ whiteSpace: 'pre-line' }}>{content.performance_title || 'Bukan sekadar live.\nAda arah. Ada target.'}</h2>
        <p>{content.performance_intro || 'Target dan capaian GMV per host, dengan periode dan sumber yang jelas. Karena angka yang berarti dimulai dari transparansi.'}</p>
        <Link className="text-link" to="/kontak">{content.performance_cta || 'Diskusikan target brand Anda'} <ArrowUpRight size={18}/></Link>
      </div>
      <div className="gmv-panel">
        <div className="gmv-header"><TrendingUp/><strong>Target & capaian host</strong><span>GMV</span></div>
        {gmv.isLoading ? <p role="status">Memuat laporan…</p> :
          gmv.error ? <><p role="alert">Laporan belum dapat dimuat.</p><button onClick={() => void gmv.reload()}>Coba lagi</button></> :
          gmv.records.length === 0 ? (
            <div className="gmv-empty">
              <span>DATA YANG BISA DIPERCAYA.</span>
              <h3>Angka nyata,<br/>bukan angka rekaan.</h3>
              <p>Belum ada laporan GMV yang dipublikasikan. Target, capaian, dan periode masing-masing host akan tampil setelah data terverifikasi tersedia.</p>
            </div>
          ) : gmv.records.map(record => (
            <div className="gmv-row" key={record.id}>
              <strong>{record.host_name}</strong>
              <small>{record.period} · {record.source || 'Laporan agensi'}</small>
              <p>{money(record.achieved)} / target {money(record.target)}</p>
              <progress value={record.achieved} max={Math.max(record.target, record.achieved, 1)}/>
            </div>
          ))}
        <small>GMV adalah nilai bruto transaksi, bukan laba. Hasil kampanye tidak dijamin.</small>
      </div>
    </section>
  );
}

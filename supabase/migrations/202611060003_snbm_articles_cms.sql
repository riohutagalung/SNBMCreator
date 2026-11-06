
-- SNBM Creator editable article CMS. Public visitors can only read published rows.
create table if not exists public.snbm_articles (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) <= 120),
 title text not null check (char_length(title) between 5 and 180),
 title_en text not null default '',
 tag text not null default 'ARTIKEL' check (char_length(tag) <= 70),
 tag_en text not null default '',
 excerpt text not null default '' check (char_length(excerpt) <= 500),
 excerpt_en text not null default '',
 body text not null check (char_length(body) between 20 and 30000),
 body_en text not null default '' check (char_length(body_en) <= 30000),
 image_url text not null default '' check (char_length(image_url) <= 1200),
 image_alt text not null default '' check (char_length(image_alt) <= 200),
 published boolean not null default false,
 published_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists snbm_articles_published_idx
 on public.snbm_articles (published_at desc, id) where published;
alter table public.snbm_articles enable row level security;
revoke all on table public.snbm_articles from anon, authenticated;
grant select on table public.snbm_articles to anon, authenticated;
grant insert, update, delete on table public.snbm_articles to authenticated;
drop policy if exists snbm_articles_public_read on public.snbm_articles;
create policy snbm_articles_public_read on public.snbm_articles for select
 to anon, authenticated using (published = true);
drop policy if exists snbm_articles_admin_read on public.snbm_articles;
create policy snbm_articles_admin_read on public.snbm_articles for select
 to authenticated using (exists (
   select 1 from public.snbm_admins where user_id = (select auth.uid())
 ));
drop policy if exists snbm_articles_admin_insert on public.snbm_articles;
create policy snbm_articles_admin_insert on public.snbm_articles for insert
 to authenticated with check (exists (
   select 1 from public.snbm_admins where user_id = (select auth.uid())
 ));
drop policy if exists snbm_articles_admin_update on public.snbm_articles;
create policy snbm_articles_admin_update on public.snbm_articles for update
 to authenticated using (exists (
   select 1 from public.snbm_admins where user_id = (select auth.uid())
 )) with check (exists (
   select 1 from public.snbm_admins where user_id = (select auth.uid())
 ));
drop policy if exists snbm_articles_admin_delete on public.snbm_articles;
create policy snbm_articles_admin_delete on public.snbm_articles for delete
 to authenticated using (exists (
   select 1 from public.snbm_admins where user_id = (select auth.uid())
 ));
create or replace function public.snbm_articles_touch_updated()
returns trigger language plpgsql security invoker set search_path = ''
as $fn$ begin new.updated_at = now(); return new; end $fn$;
drop trigger if exists snbm_articles_touch_updated on public.snbm_articles;
create trigger snbm_articles_touch_updated before update on public.snbm_articles
for each row execute function public.snbm_articles_touch_updated();
-- Public article artwork only; never put applicant photos or private documents here.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('snbm-article-images','snbm-article-images',true,5242880,
 array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true, file_size_limit=excluded.file_size_limit,
 allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists snbm_article_images_admin_insert on storage.objects;
create policy snbm_article_images_admin_insert on storage.objects for insert
to authenticated with check (bucket_id='snbm-article-images' and exists (
 select 1 from public.snbm_admins where user_id=(select auth.uid())
));
drop policy if exists snbm_article_images_admin_delete on storage.objects;
create policy snbm_article_images_admin_delete on storage.objects for delete
to authenticated using (bucket_id='snbm-article-images' and exists (
 select 1 from public.snbm_admins where user_id=(select auth.uid())
));
-- Seed the 2 existing editorials and 3 new evergreen editorial guides, once.
insert into public.snbm_articles
(slug,title,title_en,tag,tag_en,excerpt,excerpt_en,body,body_en,image_url,image_alt,published_at,published)
values
('host-yang-tepat', 'Bukan sekadar tampil. Pilih host yang tepat untuk brand Anda.', 'How to choose the right live-shopping host', 'STRATEGI BRAND', 'BRAND STRATEGY', 'Kategori, ukuran tubuh, dan gaya presentasi: tiga hal penting sebelum memulai live shopping.', 'Product fit, sizing, and presentation style all matter before going live.', 'Host yang tepat membantu penonton memahami bagaimana produk digunakan. Untuk fashion, kesesuaian ukuran tubuh dan gaya berpakaian membuat demonstrasi produk lebih relevan.

Mulailah dengan kategori utama brand. Fashion muslim membutuhkan pemahaman material, tingkat ketebalan, dan potongan modest. Tas membutuhkan demonstrasi kapasitas serta detail fungsi. Fashion anak membutuhkan penjelasan bahan dan panduan ukuran yang jelas.

Siapkan briefing yang memuat ukuran aktual, stok, harga, serta batas klaim produk. Tentukan bersama host bagaimana pertanyaan penonton ditangani, lalu evaluasi hasil sesi untuk menyempurnakan sesi berikutnya.', 'The right host helps viewers understand how a product looks and works. For fashion, fit and personal style can make a product demonstration more relevant.

Start with the brand’s core category. Modest fashion needs accurate fabric and cut descriptions; bags need clear capacity and feature demonstrations; kidswear needs honest material and sizing guidance.

Prepare a brief covering actual sizing, stock, pricing, and the limits of product claims. Agree on how questions will be answered, then use each session to learn and improve.', '/assets/snbm/regular-hijab.webp', 'Host fashion hijab untuk live shopping', '2026-11-05T08:00:00+07:00', true),
('memahami-gmv', 'Kenali GMV: angka besar perlu konteks yang tepat.', 'Understanding GMV beyond the headline number', 'LIVE INSIGHT', 'LIVE INSIGHTS', 'Cara membaca target dan hasil live tanpa melupakan kualitas transaksi.', 'A larger GMV number is not the whole story.', 'GMV adalah nilai bruto transaksi pada periode yang ditentukan. Angka ini bukan laba dan dapat berbeda dari pendapatan bersih setelah pembatalan, retur, serta biaya platform.

Tetapkan periode pelaporan, sumber data, dan definisi transaksi yang sama sebelum membandingkan host. Catat durasi live, kategori produk, dan promosi yang berjalan agar evaluasi lebih adil.

Gunakan target sebagai alat perencanaan, bukan jaminan penjualan. GMV sebaiknya dibaca bersama jumlah pesanan, konversi, serta pembatalan untuk menentukan langkah kampanye berikutnya.', 'GMV is the gross value of transactions within a stated period. It is not profit, and it may differ from net revenue after cancellations, returns, and platform fees.

Before comparing hosts, use the same period, data source, and transaction definition. Keep track of live duration, category, and promotions so evaluations are fair.

Use goals to plan, not as promises of results. Read GMV together with order count, conversion, and cancellations to decide what to improve next.', '/assets/snbm/hero-tas-wanita.webp', 'Fashion wanita dan tas untuk siaran live', '2026-11-05T09:00:00+07:00', true),
('checklist-persiapan-live-fashion', 'Checklist sebelum live fashion: tujuh hal yang wajib siap', 'Seven essentials to prepare before a fashion livestream', 'PANDUAN HOST', 'HOST GUIDE', 'Mulai dari stok dan ukuran hingga alur demonstrasi produk, siapkan live yang lebih rapi dan terukur.', 'From stock and sizing to demonstrations, prepare a smoother, more measurable live session.', 'Siaran live yang terlihat spontan tetap membutuhkan persiapan. Host yang memahami produk dan tujuan sesi bisa menjawab pertanyaan tanpa memberikan janji berlebihan.

## Tujuh hal yang perlu diperiksa

- Daftar produk utama dan urutan demonstrasi.
- Ukuran aktual, bahan, warna, serta variasi yang tersedia.
- Harga, promo, dan batas waktu penawaran yang sudah disetujui.
- Stok terkini serta alternatif jika ukuran habis.
- Pencahayaan, suara, koneksi internet, dan kamera.
- Pembagian peran host, moderator, dan admin pesanan.
- Target sesi, metrik pemantauan, dan waktu evaluasi.

## Saat sesi berjalan

Gunakan bahasa yang jelas ketika menyebut ukuran, bahan, dan ketersediaan stok. Demonstrasikan fitur produk di depan kamera dan beri waktu penonton untuk bertanya. Jika informasi belum pasti, konfirmasikan ke tim daripada menebak.

## Sesudah live

Catat produk yang menarik pertanyaan terbanyak, jam penonton aktif, jumlah pesanan, dan kendala operasional. Jadikan catatan tersebut sebagai bahan perbaikan sesi berikutnya.', 'A livestream that looks spontaneous still needs preparation. Hosts who understand their products and session goals can answer questions without overpromising.

## Seven checks before going live

- Main product lineup and demonstration order.
- Actual sizes, fabrics, colors, and available variants.
- Prices, promotions, and approved offer deadlines.
- Current stock and alternatives for sold-out sizes.
- Lighting, sound, internet connection, and camera.
- Clear roles for host, moderator, and order support.
- Session targets, tracking metrics, and review time.

## During the session

Explain sizing, materials, and stock accurately. Demonstrate product features on camera and allow viewers to ask questions. When uncertain, verify information instead of guessing.

## After the session

Record frequently asked questions, viewer activity, orders, and operational issues. Use the notes to improve the next session.', '/assets/snbm/hero-fashion-wanita.webp', 'Konsep presentasi fashion wanita dalam sesi live', '2026-11-06T08:00:00+07:00', true),
('brief-brand-untuk-host-live', 'Membuat brief brand yang mudah dipahami host live', 'How to write a practical brand brief for live hosts', 'STRATEGI BRAND', 'BRAND STRATEGY', 'Brief yang jelas membantu host menyampaikan keunggulan produk dengan konsisten tanpa klaim yang keliru.', 'A clear brief helps hosts communicate product strengths consistently without misleading claims.', 'Brief bukan sekadar daftar produk yang harus dipromosikan. Brief yang baik menyamakan pemahaman antara brand, host, moderator, dan tim operasional sebelum sesi dimulai.

## Mulai dari tujuan yang spesifik

Tulis apa yang ingin dicapai pada satu sesi: memperkenalkan koleksi baru, mendorong penjualan varian tertentu, atau menjawab pertanyaan berulang tentang produk. Tentukan metrik yang relevan dan periode pengukurannya.

## Isi produk yang wajib ada

Catat nama produk, SKU, varian, harga, stok, bahan, panduan ukuran, keunggulan yang dapat dibuktikan, serta informasi yang tidak boleh diklaim. Sertakan contoh demonstrasi yang disetujui dan pertanyaan pelanggan yang sering muncul.

## Buat alur, bukan naskah kaku

Rancang pembukaan, urutan produk, titik pengingat promo, sesi tanya jawab, dan penutup. Berikan ruang kepada host untuk berbicara alami sambil tetap menjaga ketepatan informasi.

## Evaluasi bersama

Setelah live, cocokkan performa dengan tujuan awal. Kumpulkan feedback host mengenai produk atau keberatan pelanggan agar brief berikutnya semakin kuat.', 'A brand brief is more than a product list. A good brief aligns the brand, host, moderator, and operations team before a session starts.

## Start with a clear objective

Define what a single session should achieve: introducing a collection, moving selected variants, or answering common product questions. Choose relevant metrics and measurement periods.

## Essential product information

List product names, SKUs, variants, prices, stock, fabric, size guidance, verifiable benefits, and claims that must not be made. Include approved demonstrations and common customer questions.

## Build a flow, not a rigid script

Outline the opening, product sequence, promotion reminders, Q&A, and closing. Allow the host to speak naturally while keeping details accurate.

## Review together

After the session, compare results with the original objective and ask hosts what viewers needed clarified. Use the lessons to improve the next brief.', '/assets/snbm/hero-fashion-muslim.webp', 'Konsep fashion muslim untuk presentasi produk live', '2026-11-06T09:00:00+07:00', true),
('melatih-host-live-yang-konsisten', 'Melatih host live yang konsisten, bukan hanya percaya diri', 'Training live hosts for consistent performance, not just confidence', 'PENGEMBANGAN TALENTA', 'TALENT DEVELOPMENT', 'Cara memberi latihan dan evaluasi sederhana agar kemampuan host berkembang dari satu sesi ke sesi berikutnya.', 'Simple practice and review routines help hosts improve from one live session to the next.', 'Host yang nyaman di depan kamera belum tentu langsung mampu menjelaskan produk secara akurat atau menjaga ritme penjualan. Kemampuan itu perlu dibangun melalui latihan dan evaluasi yang terstruktur.

## Mulai dari keterampilan dasar

Fokuskan latihan pada penguasaan bahan dan ukuran, pembukaan yang jelas, demonstrasi produk, respons terhadap komentar, dan cara menyampaikan ajakan membeli tanpa menekan penonton.

## Pakai simulasi yang realistis

Beri host sebuah produk, batas waktu demonstrasi, dan pertanyaan pelanggan yang umum. Rekam latihan singkat, lalu pilih satu atau dua hal terpenting untuk ditingkatkan pada sesi berikutnya.

## Ukur kualitas, bukan hanya penjualan

Tinjau konsistensi informasi produk, kecepatan menjawab pertanyaan, kemampuan menjelaskan ukuran, kepatuhan terhadap brief, serta koordinasi dengan moderator. Baca metrik penjualan bersama konteks harga, stok, dan promosi.

## Bangun rutinitas feedback

Sampaikan apresiasi yang spesifik, tunjukkan contoh perbaikan, dan sepakati satu target latihan. Progres kecil yang tercatat lebih mudah diulang daripada kritik umum yang sulit ditindaklanjuti.', 'Feeling comfortable on camera does not automatically mean a host can explain products accurately or maintain a productive sales rhythm. Those skills grow through practice and structured feedback.

## Start with fundamentals

Train product knowledge, sizing, a clear opening, demonstrations, responses to comments, and purchase calls-to-action that do not pressure viewers.

## Simulate real sessions

Give the host a product, a time limit, and common customer questions. Record a short rehearsal and choose one or two priorities for the next practice.

## Measure quality as well as sales

Review product accuracy, response time, size explanations, adherence to the brief, and moderator coordination. Interpret sales metrics alongside price, stock, and promotions.

## Build a feedback habit

Recognize specific strengths, show an example of a better approach, and agree on one measurable practice goal. Documented improvements are easier to repeat.', '/assets/snbm/host-campaign.webp', 'Empat kategori host fashion SNBM Creator', '2026-11-06T10:00:00+07:00', true)
on conflict (slug) do nothing;

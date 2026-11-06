-- SNBM Creator: additive PocketBase -> Supabase migration (no existing data dropped).
-- Apply in Supabase SQL Editor only after a project backup/snapshot.
-- Admin identity must be granted separately by an authenticated Supabase project owner.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.snbm_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.snbm_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null default '',
  type text not null default 'text' check (type in ('text','textarea','image','color')),
  value text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.snbm_host_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null,
  phone text not null,
  city text not null default '',
  employment_type text not null default 'Full time',
  size_type text not null default '',
  style text not null default '',
  weight numeric,
  category text not null default '',
  experience text not null default '',
  daily_live_hours numeric,
  best_daily_gmv numeric,
  social_accounts text not null default '',
  portfolio_url text not null default '',
  trial_video_url text not null default '',
  cv_path text not null,
  trial_video_path text,
  consent_at timestamptz not null,
  status text not null default 'baru' check (status in ('baru','ditinjau','diterima','ditolak')),
  created_at timestamptz not null default now()
);
create index if not exists snbm_host_applications_created_idx on public.snbm_host_applications(created_at desc);
create table if not exists public.snbm_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  kind text not null default 'Brand',
  brand_name text not null default '',
  product_category text not null default '',
  platform text not null default '',
  store_url text not null default '',
  message text not null,
  consent_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists snbm_enquiries_created_idx on public.snbm_enquiries(created_at desc);
create table if not exists public.snbm_contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);

-- RLS is essential: submissions, private files, and admin membership must never be public.
alter table public.snbm_admins enable row level security;
alter table public.snbm_content enable row level security;
alter table public.snbm_host_applications enable row level security;
alter table public.snbm_enquiries enable row level security;
alter table public.snbm_contacts enable row level security;

-- Use the authenticated user's own RLS-visible membership row.
-- No SECURITY DEFINER function is needed or exposed to the public API.
revoke all on table public.snbm_admins, public.snbm_content,
 public.snbm_host_applications, public.snbm_enquiries, public.snbm_contacts
 from anon, authenticated;
grant select on table public.snbm_content to anon, authenticated;
grant insert, update, delete on table public.snbm_content to authenticated;
grant select on table public.snbm_admins to authenticated;
grant select, update on table public.snbm_host_applications, public.snbm_enquiries to authenticated;
grant select on table public.snbm_contacts to authenticated;

drop policy if exists snbm_admin_self_read on public.snbm_admins;
create policy snbm_admin_self_read on public.snbm_admins
for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists snbm_content_public_read on public.snbm_content;
create policy snbm_content_public_read on public.snbm_content for select
to anon, authenticated using (true);
drop policy if exists snbm_content_admin_insert on public.snbm_content;
create policy snbm_content_admin_insert on public.snbm_content for insert
to authenticated with check ((select exists(
  select 1 from public.snbm_admins
  where user_id = (select auth.uid())
)));
drop policy if exists snbm_content_admin_update on public.snbm_content;
create policy snbm_content_admin_update on public.snbm_content for update
to authenticated using ((select exists(
  select 1 from public.snbm_admins
  where user_id = (select auth.uid())
)))
with check ((select exists(
  select 1 from public.snbm_admins
  where user_id = (select auth.uid())
)));
drop policy if exists snbm_content_admin_delete on public.snbm_content;
create policy snbm_content_admin_delete on public.snbm_content for delete
to authenticated using ((select exists(
  select 1 from public.snbm_admins
  where user_id = (select auth.uid())
)));

drop policy if exists snbm_hosts_admin_read on public.snbm_host_applications;
create policy snbm_hosts_admin_read on public.snbm_host_applications for select
to authenticated using ((select exists(
  select 1 from public.snbm_admins
  where user_id = (select auth.uid())
)));
drop policy if exists snbm_hosts_admin_update on public.snbm_host_applications;
create policy snbm_hosts_admin_update on public.snbm_host_applications for update
to authenticated using ((select exists(
  select 1 from public.snbm_admins
  where user_id = (select auth.uid())
)))
with check ((select exists(
  select 1 from public.snbm_admins
  where user_id = (select auth.uid())
)));

drop policy if exists snbm_enquiries_admin_read on public.snbm_enquiries;
create policy snbm_enquiries_admin_read on public.snbm_enquiries for select
to authenticated using ((select exists(
  select 1 from public.snbm_admins
  where user_id = (select auth.uid())
)));
drop policy if exists snbm_enquiries_admin_update on public.snbm_enquiries;
create policy snbm_enquiries_admin_update on public.snbm_enquiries for update
to authenticated using ((select exists(
  select 1 from public.snbm_admins
  where user_id = (select auth.uid())
)))
with check ((select exists(
  select 1 from public.snbm_admins
  where user_id = (select auth.uid())
)));

drop policy if exists snbm_contacts_admin_read on public.snbm_contacts;
create policy snbm_contacts_admin_read on public.snbm_contacts for select
to authenticated using ((select exists(
  select 1 from public.snbm_admins
  where user_id = (select auth.uid())
)));

-- CVs and live videos belong in PRIVATE storage; the public browser has no upload grant.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('snbm-host-private', 'snbm-host-private', false, 52428800,
  array['application/pdf','application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'video/mp4','video/quicktime','video/webm'])
on conflict (id) do update
set public = false, file_size_limit = excluded.file_size_limit,
allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists snbm_host_private_admin_read on storage.objects;
create policy snbm_host_private_admin_read on storage.objects for select
to authenticated using (
  bucket_id = 'snbm-host-private' and (select exists(
  select 1 from public.snbm_admins
  where user_id = (select auth.uid())
))
);

-- Start brand enquiries CLOSED until explicitly enabled in the admin CMS.
insert into public.snbm_content (key,label,type,value) values
 ('brand_form_enabled','Status formulir kerja sama brand','text','false'),
 ('brand_coming_soon_title_id','Coming Soon — judul ID','text','Coming Soon — Kolaborasi Brand'),
 ('brand_coming_soon_title_en','Coming Soon — title EN','text','Coming Soon — Brand Partnerships'),
 ('brand_coming_soon_body_id','Coming Soon — deskripsi ID','textarea','Kami sedang memilih dan mempersiapkan talenta host live shopping terbaik. Formulir brand akan kami buka setelah tim siap.'),
 ('brand_coming_soon_body_en','Coming Soon — description EN','textarea','We are preparing our host team. Brand partnership enquiries will open when the team is ready.'),
 ('brand_logo_icon_url','Logo S — URL','image','/assets/snbm/snbm-icon-hd.png?v=sn-20261106'),
 ('brand_favicon_url','Favicon — URL','image','/assets/snbm/favicon-32.png?v=sn-20261106'),
 ('brand_touch_icon_url','Touch icon — URL','image','/assets/snbm/favicon-180.png?v=sn-20261106'),
 ('brand_logo_font','Font logo SNBM','text','Space Grotesk'),
 ('theme_primary','Warna utama','color','#2456ff'),
 ('theme_navy','Warna teks','color','#111a33'),
 ('theme_paper','Warna latar','color','#f3f4f7'),
 ('hero_title','Judul utama','text','Kembangkan brand bersama'),
 ('hero_title_highlight','Judul utama — highlight','text','host live yang tepat.'),
 ('hero_intro','Pengantar hero','textarea','Berawal dari pengalaman berjualan fashion, kami fokus mencari dan membina talenta untuk menjadi host live shopping andalan berbagai brand.'),
 ('hero_image','Hero gambar — URL','image','/assets/snbm/hero-fashion-wanita.webp'),
 ('hero_wanita_image','Hero kategori — Fashion Wanita (URL)','image','/assets/snbm/hero-fashion-wanita.webp?v=hd20261106'),
 ('hero_muslim_image','Hero kategori — Fashion Muslim (URL)','image','/assets/snbm/hero-fashion-muslim.webp?v=hd20261106'),
 ('hero_tas_image','Hero kategori — Tas Wanita (URL)','image','/assets/snbm/hero-tas-wanita.webp?v=hd20261106'),
 ('hero_underwear_image','Hero kategori — Underwear (URL)','image','/assets/snbm/hero-underwear.webp?v=hd20261106'),
 ('hero_anak_image','Hero kategori — Fashion Kids (URL)','image','/assets/snbm/hero-fashion-kids.webp?v=hd20261106')
on conflict (key) do nothing;

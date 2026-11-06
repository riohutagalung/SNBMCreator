-- Incremental sync tracking for Google Sheets; applied to SNBM Creator Supabase project.
alter table public.snbm_host_applications add column if not exists sheets_synced_at timestamptz;
alter table public.snbm_enquiries add column if not exists sheets_synced_at timestamptz;
create index if not exists snbm_host_sheets_unsynced_idx on public.snbm_host_applications (created_at, id) where sheets_synced_at is null;
create index if not exists snbm_enquiries_sheets_unsynced_idx on public.snbm_enquiries (created_at, id) where sheets_synced_at is null;

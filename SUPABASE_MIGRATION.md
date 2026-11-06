# SNBM Creator → Supabase backend

This is an **additive** migration. It does not delete existing PocketBase data or Supabase tables. Do **not** enable production submissions before applying SQL, checking RLS, and testing end-to-end.

## Secure go-live checklist

1. **Rotate the exposed Supabase secret key** in Supabase Dashboard → Project Settings → API Keys. Also rotate any previously shared login credentials. Do not put secrets in Git, browser \`VITE_*\`, email, or screenshots.
2. Create a Supabase project backup. In Supabase **SQL Editor**, review and run \`supabase/migrations/202611060001_snbm_backend.sql\` against the correct project.
3. In Supabase Dashboard → **Authentication → Users**, invite or create your own admin user. Give it a **new** strong password via the secure Auth flow, not a committed SQL literal. If email confirmation is enabled, complete it.
4. In SQL Editor (authenticated as the project owner), replace the placeholder email and run:

   \`\`\`sql
   insert into public.snbm_admins (user_id)
   select id from auth.users
   where lower(email) = lower('YOUR-ADMIN-EMAIL@example.com')
   on conflict (user_id) do nothing;
   \`\`\`

   Confirm exactly one matching user exists. **Never** grant admin access just because a visitor entered this email.
5. In Supabase → **Settings → API Keys**, copy the **Project URL**, **publishable key**, and *newly rotated secret key* into **Hostinger hPanel → Websites → snbmcreator.com → Node.js App → Environment Variables** (never into Git):

   | Name | Location | Notes |
   | --- | --- | --- |
   | \`VITE_SUPABASE_URL\` | Hostinger build env | Public project URL, https only |
   | \`VITE_SUPABASE_PUBLISHABLE_KEY\` | Hostinger build env | \`sb_publishable_...\` (public, safe in browser) |
   | \`SUPABASE_URL\` | Hostinger server env | Same project URL for server requests |
   | \`SUPABASE_PUBLISHABLE_KEY\` | Hostinger server env | Same publishable key, for public SSR CMS |
   | \`SUPABASE_SECRET_KEY\` | Hostinger server env **only** | \`sb_secret_...\`; never \`VITE_\` |
   
   Remove old, unused \`POCKETBASE_URL\`, \`VITE_POCKETBASE_URL\`, \`PB_SUPERUSER_*\`, \`SNBM_ADMIN_PASSWORD\` from Hostinger **after** the Supabase migration is proven to work. \`SUPABASE_API_KEY\` from the old screenshot is deprecated; remove it once replaced and rotate it in Supabase.
6. In Supabase → **Authentication → URL Configuration**, set Site URL to \`https://snbmcreator.com\` and permitted redirect URLs to your domain. Disable public sign-ups for this admin-only Auth use case.
7. Verify the private bucket \`snbm-host-private\` exists and is **not public**, and RLS is enabled. Test unauthenticated \`SELECT\` and object downloads return 401/403. Test as admin, then nonadmin.
8. Redeploy the Hostinger Node app from \`main\` after the merge. Test \`/login\`, \`/admin\`, host form with a *test CV and video link*, file access (signed URLs), CMS edits and brand Coming Soon. Only then accept real applicants.
9. Configure scheduled Supabase backups, a retention/deletion policy for applicants, and monitor Storage use. A Hostinger website backup does not cover Supabase.

## Security notes

- The browser uses only the public publishable key. A secret key is used **only** on the Hostinger Node process for validated, rate-limited public form submissions and private file uploads.
- Private CVs and videos are accessible to an authenticated administrator only. Signed download links expire quickly.
- Admin membership is stored in \`public.snbm_admins\` under RLS; no self-registration creates an admin.
- Brand form is disabled by default; an admin can flip \`brand_form_enabled\` to \`true\` in **Admin → Konten & tampilan**.
- Video uploads of up to 50 MB rely on the Hostinger upload/proxy limit; if Hostinger rejects large multipart requests, ask applicants for a trial-video HTTPS link instead. CV remains capped at 10 MB.
- Without \`SUPABASE_SECRET_KEY\`, public form submissions must fail safely rather than appear to succeed.
- Migration is additive: no implicit import of PocketBase data. The PocketBase service never existed in the previously described Hostinger-only deployment; if legacy real data exists elsewhere, export and verify it before cutover.

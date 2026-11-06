# SNBM Creator — Artikel CMS

The article module is available at **https://snbmcreator.com/admin → Kelola Artikel** once the latest `main` commit is deployed to Hostinger.

## What is already configured

- Supabase project: SNBM Creator (existing connected project)
- Table: `public.snbm_articles`
- Public image bucket: `snbm-article-images`
- Admin access: confirmed Supabase Auth user with row in `public.snbm_admins`; enforced by PostgreSQL RLS
- Five initially published articles: two prior editorials plus three new practical guides
- Reading pages: `/blog`, `/blog/:slug`, and the homepage article list
- The CMS has Indonesian fields plus optional English translations

## How to edit an existing article

1. Log in at `/login` and open **Dashboard → Kelola Artikel**.
2. Select an article in the left panel.
3. Change the title, URL slug, category, summary, main body and/or cover image.
4. Choose **Publikasikan di website** to show it publicly, or uncheck to save as **Draft**.
5. Click **Simpan Artikel**. The website reads changes from Supabase on subsequent requests (no Git commit is required for edits).

The public article URL is `https://snbmcreator.com/blog/<slug>`. Changing an existing slug breaks old inbound links; only change it deliberately.

## How to create and publish an article

1. Click **+ Tulis artikel baru**.
2. Enter a title. The slug is generated automatically and remains editable.
3. Set category, summary and body.
4. Optionally provide a cover image, either by uploading a JPG/PNG/WebP (max 5 MB) or pasting a public HTTPS image URL. Add alt text for accessibility.
5. Add optional English translations inside **Versi bahasa Inggris**.
6. Choose **Publikasikan di website**, then click **Simpan Artikel**.

Plain text is displayed in paragraphs. Separate paragraphs with a blank line, use `## Judul bagian` for headings, `### Subbagian` for smaller headings and `- Item` for lists. Raw HTML/JavaScript in article bodies is **not rendered**.

## Drafts, privacy, and uploads

- Drafts are visible to authorized admins only. Public readers cannot fetch unpublished article rows through Supabase RLS.
- Article cover images are **public** and must not contain confidential applicant details.
- Applicant CV/video attachments remain in the separate **private** `snbm-host-private` bucket.
- Only admins can upload new images to the article bucket; public readers can view the images after an article is published. An image previously uploaded may remain publicly accessible even if you later unpublish the article, so do not use private images.
- Images uploaded but never saved to an article can remain as orphaned files; clean these through Supabase Storage if needed.
- The dashboard supports deleting an article after explicit confirmation. Published routes then return 404.

## Technical deployment

- Source migration: `supabase/migrations/202611060003_snbm_articles_cms.sql` (already applied through the connected Supabase project).
- Website files: `apps/web/src/lib/articles*.ts`, `components/admin/articles-admin.tsx`, article routes, `components/article-content.tsx` and `components/home/insights.tsx`.
- Keep Hostinger `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` and private `SUPABASE_SECRET_KEY` set as before.
- After initial code deployment, publishing and editing articles requires **no redeploy**.
- **Never** put a Supabase secret key into a `VITE_*` environment variable or into this repo.

If Supabase is configured but temporarily unavailable, article reading fails closed rather than serving potentially outdated or unpublished static content. When no backend environment is configured at all (e.g. local development), the two original built-in blog entries are shown as offline demo fallbacks.

## Useful verification

Check Supabase Table Editor → `snbm_articles`, and Storage → `snbm-article-images`. Confirm both public article list and article details load after Hostinger redeploy. Test saving a draft and publishing it, then test again in a private/incognito window to ensure drafts remain hidden.

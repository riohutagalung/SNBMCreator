> **Supabase migration in progress (November 2026).** For the new backend, use [SUPABASE_MIGRATION.md](SUPABASE_MIGRATION.md). The PocketBase instructions below are legacy reference only; do not use them for new SNBM Creator deployments.

# SNBM Creator — Hostinger Unlimited + PocketBase backend

## Recommended architecture

- Public website: Hostinger **Unlimited Web Hosting**, using its managed Node.js Web App feature. The website is the React Router SSR application in `apps/web`.
- Database and API: PocketBase on a separate VPS or another host that supports a continuously running Go server, custom ports, and persistent disk storage.
- Public hosts: `https://snbmcreator.com` for the website and `https://api.snbmcreator.com` for PocketBase.

Hostinger's Unlimited plan supports managed Node.js Web Apps. Its shared Node.js environment does not support extra services/custom listening ports or always-running background workers, so do not try to run PocketBase as a second process inside the shared web hosting plan.

## Deploy the website to Hostinger Unlimited

In hPanel:

1. Open **Websites → Add Website → Deploy Web App**.
2. Choose **Import Git Repository** and authorize GitHub.
3. Select `riohutagalung/SNBMCreator`, branch `main`.
4. Use the repository root as the project root (the root `package.json` is a workspace monorepo).
5. Select a supported Node.js runtime, preferably Node.js 22.x or 24.x.
6. Use npm, not Bun. The root scripts are prepared for Hostinger:
   - Install: `npm install`
   - Build: `npm run build`
   - Start: `npm start` (uses the repository's `server.js` entry point to launch React Router SSR)
7. Under the **Other** framework preset, set **Entry file** to `server.js` (not blank). For this SSR custom entry, leave **Output directory** blank (`none`) so Hostinger keeps the repository-level `server.js` alongside the built `dist/apps/web/` assets. The Node.js server itself serves static assets from `dist/apps/web/client`.
8. Attach `snbmcreator.com` to this Node.js website and activate HTTPS in hPanel.

The root production `start` command launches only the web app. It intentionally does not start PocketBase. For local development, `npm run dev` still starts both services; `npm run start:stack` is for a self-managed server where both processes are allowed.

## Deploy PocketBase separately

Use a VPS or equivalent server that permits a long-running PocketBase process and persistent storage. A static hosting slot or shared Node.js web app slot is not enough.

1. Provision a persistent disk and mount it at `/data`.
2. Deploy the repository's `apps/pocketbase` directory and its `pb_hooks` and `pb_migrations`.
3. Set the PocketBase secrets below before the first start. The existing superuser migration and SNBM admin bootstrap migration read these environment variables.
4. Start PocketBase with its package start command. Keep port 8090 reachable only through the reverse proxy/firewall.
5. Point DNS record `api` (A record) for `api.snbmcreator.com` to the VPS public IP.
6. Configure HTTPS reverse proxy from `api.snbmcreator.com` to PocketBase on port 8090.
7. Configure PocketBase allowed origins/CORS to include `https://snbmcreator.com` and `https://www.snbmcreator.com` if the www host is used.

## Environment variables

### Hostinger Node.js website

Set these in the Node.js app's Environment Variables section, not in source code:

- `VITE_POCKETBASE_URL=https://api.snbmcreator.com` — public PocketBase URL. This is a build-time variable; redeploy/rebuild after changing it.
- `POCKETBASE_URL=https://api.snbmcreator.com` — server-side connection from the website to PocketBase.
- `PB_SUPERUSER_EMAIL` and `PB_SUPERUSER_PASSWORD` — server-only PocketBase superuser login used by the website's secure server loaders. Keep these private.

Hostinger normally supplies the web process `PORT`; the start command respects it and falls back to 3000 for local use.

### PocketBase VPS

Set these in the PocketBase service environment:

- `PB_SUPERUSER_EMAIL` and `PB_SUPERUSER_PASSWORD` — used by the existing PocketBase superuser migration. Use a unique, strong password.
- `SNBM_ADMIN_EMAIL` and `SNBM_ADMIN_PASSWORD` — website admin account provisioned in the `users` collection by the secure SNBM admin migration. Use a different password from the superuser and at least 14 characters.
- `PB_ENCRYPTION_KEY` — long random encryption key. Keep it persistent; do not rotate casually.

The website admin signs in at `/login`; the dashboard is at `/admin`. The admin email/password are not the PocketBase superuser credentials.

## What the admin can edit

The `Konten & tampilan` tab stores content in PocketBase collection `snbm_content`: hero copy, category list, about copy, workflow steps, host-card text and image URLs, performance/CTA copy, and three theme colors. Host applications and enquiries are also managed in the dashboard.

Image fields currently accept public image URLs. Direct image upload/storage UI is not implemented yet.

## Backups and production safety

- Hostinger's daily backup covers the website within that hosting plan. It does **not** automatically back up the separate PocketBase VPS. Configure independent scheduled PocketBase backups of `/data` to off-server storage and test restore.
- Do not expose `PB_SUPERUSER_EMAIL`, `PB_SUPERUSER_PASSWORD`, `SNBM_ADMIN_PASSWORD`, or `PB_ENCRYPTION_KEY` in browser variables or Git.
- The repository is currently public. A previous commit contained a demo admin credential in a migration. The current migration code removes that demo account when the new security migration runs, but the old value still exists in Git history. Do not reuse that password; consider making the repository private or cleaning the old history before production.
- Before accepting real submissions, test login, admin authorization, content updates, host applications, email delivery, CORS, backups, and restore.

## 2026 SNBM website update

- The public frontend uses in-house and freelance host categories. Four fashion images are AI-generated illustrative portraits, not real employees or client photographs.
- Brand and host application forms are separate, and the host form supports CV and live trial video uploads (or a trial video link).
- `apps/pocketbase/pb_migrations/1793869602_applications_brand_fields.js` adds required application fields and protected file attachments. **Deploy this migration before allowing real form submissions.**
- `VITE_POCKETBASE_URL` is public browser configuration, not a credential. Hostinger web only: do not store `SNBM_ADMIN_PASSWORD` or `PB_ENCRYPTION_KEY` there.
- The site publishes truthful, read-only MCP discovery and a basic MCP endpoint at `/mcp`. The proposed server-card format is experimental; only public information is exposed, no authenticated mutation.
- Do not add fictional phone numbers or social profile URLs to schema. Add verified `telephone`/`sameAs` when the owner supplies them.
- Production test: `npm run typecheck`, `npm run build`, and `NODE_ENV=production PORT=3000 node -e "require('./server.js')"` then verify `/api/health`.
- React Router SSR must keep the root `server.js` and the complete built `dist/apps/web/client` and `dist/apps/web/server` directories. Hostinger's Node loader calls `require()`, so no top-level await is permitted in `server.js`.
- Do not reuse credentials previously exposed in screenshots or archived deployment files. Rotate them before attaching production data.
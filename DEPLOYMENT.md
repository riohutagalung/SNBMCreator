# SNBM Creator — deployment

## Architecture

- Website: React Router SSR / Node.js, in apps/web.
- API and database: PocketBase, in apps/pocketbase.
- PocketBase requires persistent disk storage. Its production data directory is /data; an ephemeral container filesystem is not suitable.
- Recommended public hosts: snbmcreator.com for the website and api.snbmcreator.com for PocketBase.

## Environment variables

Configure these in the hosting provider's secret/environment settings. Do not commit real values or send credentials in chat.

- PORT: public Node.js web process port, typically supplied by the hosting platform.
- VITE_POCKETBASE_URL: browser-accessible PocketBase HTTPS URL, for example https://api.snbmcreator.com.
- POCKETBASE_URL: server-to-server PocketBase address, normally http://127.0.0.1:8090 when both services share one VPS.
- PB_SUPERUSER_EMAIL and PB_SUPERUSER_PASSWORD: private PocketBase superuser credentials used by server-side website loaders/actions.
- SNBM_ADMIN_EMAIL and SNBM_ADMIN_PASSWORD: website admin account provisioned in the users collection by a PocketBase migration. Use a different password from the superuser.
- PB_ENCRYPTION_KEY: stable secret used by PocketBase encryption. Store it securely and keep the same value across restarts/restores.

Copy .env.example as a reference only. Put actual values in the hosting provider's environment configuration.

## First deployment

1. Choose a persistent Node.js/VPS environment that can run both a Node.js SSR process and PocketBase continuously. A static-only hosting plan cannot run this backend.
2. Create persistent storage for PocketBase and mount it at /data.
3. Set all required environment variables before starting PocketBase. Existing PocketBase migrations and the new SNBM admin bootstrap migration read those variables.
4. Start PocketBase using the apps/pocketbase start script with its data directory mapped to /data.
5. Build and start the website using apps/web build and apps/web start scripts.
6. Put a reverse proxy in front: snbmcreator.com to the Node.js web process; api.snbmcreator.com to PocketBase port 8090. Enable HTTPS on both hosts.
7. Set VITE_POCKETBASE_URL to https://api.snbmcreator.com and rebuild the frontend after changing that build-time variable.

## Admin and content

- Sign in at /login. The /admin page requires a signed-in user whose PocketBase users.role is admin.
- The Konten & tampilan tab stores landing-page content in snbm_content.
- Text, paragraphs, category lists, host profile names/details/image URLs, section copy, CTA labels, and three theme colors are editable.
- Public landing-page sections use defaults if the PocketBase content has not loaded.
- Host applicant statuses are managed in the same dashboard.

## Security notes

- A legacy starter migration contained a publicly-known demo credential. The secure-admin migration removes the legacy demo account and provisions the account specified by SNBM_ADMIN_EMAIL and SNBM_ADMIN_PASSWORD. This migration must run before public launch.
- Rotate the legacy demo password anywhere it may have been reused.
- Never expose PB_SUPERUSER_EMAIL or PB_SUPERUSER_PASSWORD via VITE_ variables or browser code.
- Keep PocketBase data and backups persistent. Configure scheduled off-site backups, SMTP, reverse-proxy headers, and firewall rules before accepting real submissions.

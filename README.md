# SNBM Creator

SNBM Creator is a live-shopping host agency website for fashion brands and creator hosts.

## Project structure

- apps/web — React Router SSR website, public pages, login, and admin dashboard.
- apps/pocketbase — PocketBase hooks and schema migrations.
- DEPLOYMENT.md — production architecture, environment variables, and deployment checklist.
- .env.example — names of the required environment variables (replace values in your hosting provider; never commit real secrets).

## Local development

Install Bun, then run:

    bun install
    bun run dev

The website is served on port 3000 and PocketBase on port 8090. Set the required environment variables before running the backend migrations. See DEPLOYMENT.md.

## Admin

- Login: /login
- Dashboard: /admin
- The CMS stores editable homepage content in the PocketBase collection snbm_content.
- Admin access requires the users.role field to be admin.
- The dashboard supports content text, image URLs, categories, host profile cards, workflow content, CTA copy, and theme colors.

## Production

The website requires a Node.js runtime. PocketBase requires a continuously running process and persistent storage. A static-only hosting plan is not sufficient for the full application. Read DEPLOYMENT.md before deployment.

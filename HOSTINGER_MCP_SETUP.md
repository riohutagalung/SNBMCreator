# SNBM Creator — Connect Hostinger to your editor

The Hostinger MCP endpoint is configured for **Codex** and **VS Code** without storing credentials in the GitHub repository.

## Authenticate Hostinger (required on your device)

1. Pull the latest `main` branch and open the repository as a **trusted project** in Codex.
2. From your local Codex terminal, run:
   ```bash
   codex mcp list
   codex mcp login hostinger
   ```
3. A Hostinger OAuth authorization page opens. Sign in **yourself** and approve access. Do not paste passwords or token values into ChatGPT, issues, GitHub files, or source code.
4. Run `codex mcp list` again and check Hostinger tools in Codex (`/mcp` in the Codex terminal).
5. In VS Code, the same remote endpoint is in `.vscode/mcp.json`. Open the MCP server tools from your editor, start it, and approve the Hostinger sign-in when prompted.

Alternative: open **Hostinger hPanel → Dev tools → API → Connect your tools**, choose Codex or your editor, and follow the guided Hostinger Connector OAuth steps.

**Do not place Hostinger API tokens or OAuth credentials in these tracked files.** They must remain in the local editor authentication store or the provider's secure settings.

## Verify hosting configuration in hPanel

Under **Websites → snbmcreator.com → Node.js Web App → Settings / Deployments** (wording varies), verify:

- GitHub repository: `riohutagalung/SNBMCreator`
- Branch: `main` with automatic deployment enabled
- Project root: repository root (npm workspaces)
- Node runtime: `22.x` or `24.x`
- Install: `npm install`
- Build: `npm run build`
- Start: `npm start`
- Entry file: `server.js`
- Framework: `Other`; output directory: leave blank for the SSR root entry

Under **Environment Variables** in hPanel set appropriate values **yourself**:

- `VITE_POCKETBASE_URL`: public HTTPS URL for your *running* PocketBase API, e.g. `https://api.snbmcreator.com` once it is provisioned
- `POCKETBASE_URL`: server-side PocketBase URL
- `PB_SUPERUSER_EMAIL`: PocketBase **superuser** email
- `PB_SUPERUSER_PASSWORD`: PocketBase **superuser** password (secret)

`VITE_POCKETBASE_URL` is a **browser-public** build-time URL; never assign a password or API token to a `VITE_` variable. Rebuild/redeploy after changing build-time environment variables.

### Separate PocketBase backend is required

A Hostinger web-app frontend does **not** automatically install PocketBase. Deploy the `apps/pocketbase` service on a VPS or other persistent server with HTTPS and a persistent disk. On the PocketBase server, set:

- `SNBM_ADMIN_EMAIL`: email for the website admin account
- `SNBM_ADMIN_PASSWORD`: unique **new** strong password, at least 14 characters
- `PB_SUPERUSER_EMAIL`, `PB_SUPERUSER_PASSWORD`: backend superuser credentials
- `PB_ENCRYPTION_KEY`: long, persistent private encryption key

These values belong in private VPS/server settings, not Git. Initial admin migration seeds an admin user on **first migration run**; subsequent password changes must be applied through proper PocketBase account administration or an explicit migration.

Verify `https://api.snbmcreator.com/api/health` responds successfully before troubleshooting the dashboard login. Test `/login` and `/admin` only after the backend is reachable.

The Hostinger MCP OAuth login authorizes the **editor**, not an SNBM Creator application user. It does not automatically provision PocketBase or change your website admin password.

## Official guides

- https://www.hostinger.com/support/how-to-set-up-web-hosting-mcp-on-local-ides/
- https://www.hostinger.com/support/11079316-hostinger-api-mcp-server/
- https://www.hostinger.com/support/how-to-add-environment-variables-during-node-js-application-deployment/

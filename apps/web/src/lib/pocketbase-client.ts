import PocketBase from 'pocketbase';

// Use a public HTTPS API subdomain in production. The same-origin path remains
// the fallback for Hostinger Horizons or a reverse proxy configured at /hcgi/platform.
const POCKETBASE_API_URL = import.meta.env.VITE_POCKETBASE_URL || '/hcgi/platform';

const pocketbaseClient = new PocketBase(POCKETBASE_API_URL);

export default pocketbaseClient;

export { pocketbaseClient, POCKETBASE_API_URL };

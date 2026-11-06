import { createClient } from '@supabase/supabase-js';
/** Server-side clients do not persist privileged auth sessions. */
const projectUrl = () => process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
export function getPublicSupabase() {
 const url = projectUrl(), key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
 if (!url || !key) return null;
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
export function getAdminSupabase() {
 const url = projectUrl(), key = process.env.SUPABASE_SECRET_KEY;
 if (!url || !key) return null;
 // Import only in trusted server actions. Never expose this client to the browser.
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}

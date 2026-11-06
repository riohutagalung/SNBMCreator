import { getPublicSupabase } from '@/lib/supabase-client.server';
/** Public, RLS-restricted Supabase CMS read; never contains private credentials. */
export async function getPublicSiteSettings(keys:readonly string[]):Promise<Record<string,string>> {
  const supabase=getPublicSupabase();
  if (!supabase || !keys.length) return {};
  const timeoutController=new AbortController();
  const timeout=setTimeout(()=>timeoutController.abort(),1400);
  try {
    const {data,error}=await supabase.from('snbm_content').select('key,value').in('key',keys)
      .abortSignal(timeoutController.signal);
    if(error) return {};
    const allowed=new Set(keys);
    return Object.fromEntries((data??[]).filter(row=>allowed.has(row.key))
      .map(row=>[row.key,String(row.value??'')]));
  } catch {return {};}
  finally{clearTimeout(timeout);}
}
export function safeBrandAssetUrl(value:string|undefined,fallback:string):string {
 const url=(value??'').trim();
 if(url.startsWith('/')&&!url.startsWith('//')&&!/[<>"'`\\]/.test(url))return url;
 try {
   const parsed=new URL(url);
   if(parsed.protocol==='https:'&&!parsed.username&&!parsed.password)return parsed.href;
 }catch{/* ignore */}
 return fallback;
}

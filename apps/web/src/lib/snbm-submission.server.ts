import { apiError } from '@/lib/api.server';
import { getAdminSupabase } from '@/lib/supabase-client.server';
export const CV_LIMIT=10*1024*1024;
export const VIDEO_LIMIT=50*1024*1024;
const BODY_LIMIT=64*1024*1024;
/**
 * The browser sends the PUBLIC site origin, but behind Hostinger's proxy the
 * server Request.url can be an internal HTTP address. Never compare the two.
 * Keep a small, explicit HTTPS allowlist instead of trusting Host/X-Forwarded-*.
 */
const OFFICIAL_ORIGINS = new Set([
 'https://snbmcreator.com',
 'https://www.snbmcreator.com',
]);
export function sameOrigin(request:Request):boolean {
 const origin=request.headers.get('origin');
 // Non-browser clients may omit Origin. This public endpoint is rate-limited
 // and never authorizes a user based on cookies.
 if (!origin) return true;
 let parsed:URL;
 try { parsed=new URL(origin); } catch { return false; }
 if (parsed.origin!==origin) return false;
 if (OFFICIAL_ORIGINS.has(origin)) return true;
 const configured=process.env.SITE_URL;
 if (configured) {
   try {
     const site=new URL(configured);
     if (site.protocol==='https:' && !site.username && !site.password &&
         origin===site.origin) return true;
   } catch { /* Ignore an invalid site URL; never widen the allowlist. */ }
 }
 // Allow the exact local origin only while developing, not on production.
 return process.env.NODE_ENV!=='production' && origin===new URL(request.url).origin;
}
export function text(form:FormData,key:string,max=3000){
 const value=form.get(key);
 return typeof value==='string'?value.trim().slice(0,max):'';
}
export function validEmail(email:string){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)&&email.length<=254;}
export function validHttps(url:string){try {return new URL(url).protocol==='https:';}catch{return false;}}
export function getBackend() {
 const client=getAdminSupabase();
 if(!client)throw apiError(503,'Layanan pendaftaran sedang disiapkan.');
 return client;
}
const cvTypes:Record<string,string> = {
 pdf:'application/pdf',doc:'application/msword',
 docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};
const videoTypes:Record<string,string>={mp4:'video/mp4',mov:'video/quicktime',webm:'video/webm'};
function extension(file:File){return file.name.split('.').at(-1)?.toLowerCase()||'';}
export function checkedFile(file:FormDataEntryValue|null,kind:'cv'|'video'): {file:File;mime:string;ext:string}|null {
 if(!(file instanceof File)||!file.size)return null;
 const ext=extension(file),types=kind==='cv'?cvTypes:videoTypes;
 if(!types[ext] || file.size>(kind==='cv'?CV_LIMIT:VIDEO_LIMIT))return null;
 // File content types are hints, not trusted; Storage is private and non-executable.
 const mime=types[ext];
 if(file.type && file.type!=='application/octet-stream'&&file.type!==mime)return null;
 return {file,mime,ext};
}
/** Stream cap before parsing multipart (can include a 50MB trial video). */
export async function multipartWithinLimit(request:Request):Promise<FormData> {
 const claimed=Number(request.headers.get('content-length'));
 if(Number.isFinite(claimed)&&claimed>BODY_LIMIT)throw apiError(413,'Berkas terlalu besar.');
 const type=request.headers.get('content-type');
 if(!type?.startsWith('multipart/form-data;'))throw apiError(415,'Form data diperlukan.');
 if(!request.body)throw apiError(400,'Form kosong.');
 const reader=request.body.getReader();
 const chunks:Uint8Array[]=[];let received=0;
 try {
   for(;;){
     const {done,value}=await reader.read();
     if(done)break;
     if(!value)continue;
     received+=value.byteLength;
     if(received>BODY_LIMIT){await reader.cancel();throw apiError(413,'Berkas terlalu besar.');}
     chunks.push(value);
   }
 }finally{reader.releaseLock();}
 const buffer=new Uint8Array(received);let position=0;
 for(const part of chunks){buffer.set(part,position);position+=part.byteLength;}
 return new Response(buffer,{headers:{'content-type':type}}).formData();
}

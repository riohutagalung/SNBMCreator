import { apiError, json, readFormData, withApi } from '@/lib/api.server';
import { clientIdentifier, createRateLimiter } from '@/lib/rate-limit.server';
import { getBackend, sameOrigin, text, validEmail, validHttps } from '@/lib/snbm-submission.server';
import { mirrorSavedRecord } from '@/lib/snbm-sheets.server';

const allowBrand=createRateLimiter({maxRequests:5,windowSeconds:3600});
export const action=withApi(async({request})=>{
 if(request.method!=='POST')return apiError(405,'Method not allowed');
 if(!sameOrigin(request))return apiError(403,'Origin tidak diizinkan.');
 if(!await allowBrand(clientIdentifier(request)))return apiError(429,'Terlalu banyak percobaan.');
 const db=getBackend();
 const {data:setting,error:settingError}=await db.from('snbm_content').select('value')
   .eq('key','brand_form_enabled').maybeSingle();
 // Fail closed. Never accept enquiries just because a browser displayed a cached form.
 if(settingError||setting?.value!=='true')return apiError(403,'Formulir kerja sama brand masih Coming Soon.');
 const form=await readFormData(request);
 if(text(form,'company_website',200))return json({ok:true});
 const name=text(form,'name',121),email=text(form,'email',255);
 const message=text(form,'message',3001),phone=text(form,'phone',31);
 const url=text(form,'store_url',1000);
 if(text(form,'consent')!=='true'||name.length<2||name.length>120
   ||!validEmail(email)||message.length<5||message.length>3000
   ||phone.length>30||(url&&!validHttps(url)))return apiError(400,'Formulir belum lengkap.');
 const {data:saved,error}=await db.from('snbm_enquiries').insert({
  name,email,phone,kind:'Brand',brand_name:text(form,'brand_name',160),
  product_category:text(form,'product_category',60),platform:text(form,'platform',60),
  store_url:url,message,consent_at:new Date().toISOString()
 }).select('*').single();
 if(error || !saved)return apiError(503,'Data belum berhasil disimpan.');
 const sheetsSynced=await mirrorSavedRecord('brand',saved).catch(()=>false);
 return json({ok:true,sheetsSynced},{status:201});
});

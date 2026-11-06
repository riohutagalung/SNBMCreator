import { apiError, json, withApi } from '@/lib/api.server';
import { clientIdentifier, createRateLimiter } from '@/lib/rate-limit.server';
import { checkedFile, getBackend, multipartWithinLimit, sameOrigin, text, validEmail, validHttps } from '@/lib/snbm-submission.server';

const allowHost=createRateLimiter({maxRequests:4,windowSeconds:3600});
export const action=withApi(async({request})=>{
 if(request.method!=='POST')return apiError(405,'Method not allowed');
 if(!sameOrigin(request))return apiError(403,'Origin tidak diizinkan.');
 if(!await allowHost(clientIdentifier(request)))return apiError(429,'Terlalu banyak percobaan. Coba lagi nanti.');
 const form=await multipartWithinLimit(request);
 if(text(form,'company_website',200))return json({ok:true});
 if(text(form,'consent')!=='true')return apiError(400,'Persetujuan pengelolaan data wajib.');
 const name=text(form,'name',121),email=text(form,'email',255),phone=text(form,'phone',31);
 const experience=text(form,'experience',2001),social_accounts=text(form,'social_accounts',1201);
 const cv=checkedFile(form.get('cv_file'),'cv');
 const trial=checkedFile(form.get('trial_video'),'video');
 const trialUrl=text(form,'trial_video_url',1000);
 const portfolio=text(form,'portfolio_url',1000);
 if(name.length<2||name.length>120||!validEmail(email)||phone.length<6||phone.length>30)
  return apiError(400,'Nama, email, atau nomor WhatsApp tidak valid.');
 if(!cv)return apiError(400,'CV harus berupa PDF/DOC/DOCX maksimal 10 MB.');
 if(!trial&&!trialUrl)return apiError(400,'Harap lampirkan video trial atau tautan HTTPS.');
 if((trialUrl&&!validHttps(trialUrl))||(portfolio&&!validHttps(portfolio)))
  return apiError(400,'Tautan harus menggunakan HTTPS.');
 if(!experience||experience.length>2000||!social_accounts||social_accounts.length>1200)
  return apiError(400,'Pengalaman dan akun live wajib dilengkapi.');
 const hours=Number(text(form,'daily_live_hours')),gmv=Number(text(form,'best_daily_gmv'));
 const weightText=text(form,'weight'),weight=weightText?Number(weightText):null;
 if(!Number.isFinite(hours)||hours<0||hours>24||!Number.isFinite(gmv)||gmv<0
   ||(weight!==null&&(!Number.isFinite(weight)||weight<1||weight>200)))
  return apiError(400,'Nilai pengalaman atau data ukuran tidak valid.');
 const db=getBackend();
 const id=crypto.randomUUID();
 const cvPath=`cv/${id}/cv.${cv.ext}`;
 const videoPath=trial?`video/${id}/trial.${trial.ext}`:null;
 const bucket=db.storage.from('snbm-host-private');
 const uploaded:string[]=[];
 try {
   const cvUpload=await bucket.upload(cvPath,new Uint8Array(await cv.file.arrayBuffer()),
     {contentType:cv.mime,upsert:false});
   if(cvUpload.error)throw cvUpload.error;
   uploaded.push(cvPath);
   if(trial&&videoPath){
     const videoUpload=await bucket.upload(videoPath,new Uint8Array(await trial.file.arrayBuffer()),
       {contentType:trial.mime,upsert:false});
     if(videoUpload.error)throw videoUpload.error;
     uploaded.push(videoPath);
   }
   const {error:dbError}=await db.from('snbm_host_applications').insert({
     id,name,email,phone,city:text(form,'city',120),
     employment_type:text(form,'employment_type',40)||'Full time',
     size_type:text(form,'size_type',80),style:text(form,'style',40),weight,
     category:text(form,'category',200),experience,daily_live_hours:hours,
     best_daily_gmv:gmv,social_accounts,portfolio_url:portfolio,trial_video_url:trialUrl,
     cv_path:cvPath,trial_video_path:videoPath,consent_at:new Date().toISOString(),status:'baru'
   });
   if(dbError)throw dbError;
   return json({ok:true},{status:201});
 }catch{
   if(uploaded.length)await bucket.remove(uploaded).catch(()=>{});
   return apiError(503,'Data belum berhasil disimpan. Silakan coba lagi.');
 }
});

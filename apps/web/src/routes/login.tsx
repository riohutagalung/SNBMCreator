import { useState } from 'react';
import type { Route } from './+types/login';
import { useNavigate, useSearchParams } from 'react-router';
import { seo } from '@/lib/seo';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase-client';
export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, { title:'Masuk Admin — SNBM Creator',description:'Halaman masuk untuk admin SNBM Creator.',noindex:true });
}
export default function Login() {
 const {login,logout}=useAuth();
 const navigate=useNavigate();
 const [params]=useSearchParams();
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [error,setError]=useState('');
 const [busy,setBusy]=useState(false);
 const onSubmit=async(event:React.FormEvent)=>{
   event.preventDefault();setError('');setBusy(true);
   try{
     const data=await login(email.trim(),password);
     if(!data.user||!supabase)throw new Error('Akun tidak ditemukan.');
     const {data:member,error:membershipError}=await supabase.from('snbm_admins')
       .select('user_id').eq('user_id',data.user.id).maybeSingle();
     if(membershipError)throw membershipError;
     if(!member){
       await logout();
       setError('Akun Supabase terdaftar tetapi belum memiliki izin admin. Periksa daftar snbm_admins.');
       return;
     }
     const next = params.get('next');
     navigate(next?.startsWith('/berkas-host?') && next.length < 500 ? next : '/admin');
   }catch(cause){
     setError(!supabase?'Supabase belum dikonfigurasi di Hostinger.'
       :cause instanceof Error&&/Invalid login credentials/i.test(cause.message)
       ?'Email atau kata sandi tidak cocok dengan akun Supabase Auth.'
       :'Login belum berhasil. Periksa koneksi Supabase, konfirmasi email, dan hak admin.');
   }finally{setBusy(false);}
 };
 return <main className="page-rail" style={{maxWidth:460,margin:'0 auto'}}>
 <span className="eyebrow">PANEL ADMIN SNBM</span>
 <h1>Masuk ke<br/><span>dashboard.</span></h1>
 <form className="contact-form" onSubmit={onSubmit} style={{marginTop:28}}>
  <label>Email<input name="email" type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email admin Supabase Auth"/></label>
  <label>Kata sandi<input name="password" type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Kata sandi admin"/></label>
  <button className="button" disabled={busy}>{busy?'Memeriksa…':'Masuk →'}</button>
  {params.get('error')==='access'&&<p role="alert">Akun ini tidak memiliki izin admin di Supabase.</p>}
  {params.get('error')==='config'&&<p role="alert">Konfigurasi Supabase belum tersedia.</p>}
  {error&&<p role="alert">{error}</p>}
 </form></main>;
}

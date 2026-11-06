import { useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';
export function useAuth() {
 const [user,setUser] = useState<User | null>(null);
 const [isLoading,setIsLoading] = useState(true);
 useEffect(() => {
   let active=true;
   if(!supabase){setIsLoading(false);return;}
   const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
     if(active){setUser(session?.user??null);setIsLoading(false);}
   });
   void supabase.auth.getUser().then(({data})=>{if(active){setUser(data.user);setIsLoading(false);}})
     .catch(()=>{if(active)setIsLoading(false);});
   return ()=>{active=false;subscription.unsubscribe();};
 },[]);
 return useMemo(()=>({
   user,isAuthed:Boolean(user),isLoading,
   login:async(email:string,password:string)=>{
     if(!supabase)throw new Error('Supabase belum dikonfigurasi di Hostinger.');
     const result=await supabase.auth.signInWithPassword({email,password});
     if(result.error)throw result.error;
     return result.data;
   },
   logout:async()=>{if(supabase)await supabase.auth.signOut();},
 }),[user,isLoading]);
}
export default useAuth;

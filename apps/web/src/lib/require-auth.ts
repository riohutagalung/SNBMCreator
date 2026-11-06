import { redirect } from 'react-router';
import { supabase } from '@/lib/supabase-client';
/** Client-only guard, backed by database membership and RLS. */
export async function requireAuth(redirectTo='/login') {
 if(!supabase)throw redirect(redirectTo+'?error=config');
 const {data:{user},error}=await supabase.auth.getUser();
 if(error||!user)throw redirect(redirectTo);
 const {data:membership,error:permissionError}=await supabase.from('snbm_admins')
   .select('user_id').eq('user_id',user.id).maybeSingle();
 if(permissionError||!membership)throw redirect(redirectTo+'?error=access');
 return user;
}
export default requireAuth;

import { useCallback,useEffect,useRef,useState } from 'react';
import { supabase } from '@/lib/supabase-client';
type Options={sort?:string;perPage?:number;realtime?:boolean;enabled?:boolean};
type Row={id:string};
const TABLES=new Set(['snbm_host_applications','snbm_enquiries','snbm_contacts','snbm_content']);
export function useSupabaseRecords<T extends Row>(table:string,options:Options={}) {
 const {sort='-created_at',perPage,realtime=false,enabled=true}=options;
 const [records,setRecords]=useState<T[]>([]);
 const [isLoading,setIsLoading]=useState(enabled);
 const [error,setError]=useState<unknown>(null);
 const [page,setPage]=useState(1);
 const [totalPages,setTotalPages]=useState(1);
 const [totalItems,setTotalItems]=useState(0);
 const requestNumber=useRef(0);
 const reload=useCallback(async()=>{
   if(!enabled){setRecords([]);setIsLoading(false);return;}
   const seq=++requestNumber.current;setIsLoading(true);setError(null);
   try {
     if(!supabase||!TABLES.has(table))throw new Error('Supabase belum siap.');
     const column=sort.replace(/^-/, '');
     let query=supabase.from(table).select('*',{count:'exact'})
       .order(column,{ascending:!sort.startsWith('-')});
     if(perPage)query=query.range((page-1)*perPage,page*perPage-1);
     const {data,error:queryError,count}=await query;
     if(queryError)throw queryError;
     if(seq===requestNumber.current){
       const rows=(data??[]) as T[];setRecords(rows);
       setTotalItems(count??rows.length);
       setTotalPages(perPage?Math.max(1,Math.ceil((count??rows.length)/perPage)):1);
     }
   } catch(e){if(seq===requestNumber.current)setError(e);}
   finally{if(seq===requestNumber.current)setIsLoading(false);}
 },[enabled,page,perPage,sort,table]);
 useEffect(()=>{void reload();},[reload]);
 useEffect(()=>{
   if(!realtime||!enabled||!supabase||!TABLES.has(table))return;
   const channel=supabase.channel('admin-'+table).on('postgres_changes',
     {event:'*',schema:'public',table},()=>{void reload();}).subscribe();
   return()=>{void supabase?.removeChannel(channel);};
 },[realtime,enabled,table,reload]);
 const update=useCallback(async(id:string,patch:Record<string,unknown>)=>{
   if(!supabase||!TABLES.has(table))throw new Error('Supabase not configured');
   const {data,error:changeError}=await supabase.from(table).update(patch).eq('id',id).select().single();
   if(changeError)throw changeError;
   setRecords(curr=>curr.map(row=>row.id===id?data as T:row));
   return data as T;
 },[table]);
 return {records,isLoading,error,reload,update,page,setPage,totalPages,totalItems};
}

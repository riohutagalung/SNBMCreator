import { useState } from 'react';
import { Link } from 'react-router';
import { supabase } from '@/lib/supabase-client';
import { articleDate, articleImage, type Article } from '@/lib/articles';

type Editable = Pick<Article,
 'slug' | 'title' | 'title_en' | 'tag' | 'tag_en' | 'excerpt' | 'excerpt_en' |
 'body' | 'body_en' | 'image_url' | 'image_alt' | 'published'>;

const emptyArticle = (): Editable => ({
 slug:'', title:'', title_en:'', tag:'ARTIKEL', tag_en:'',
 excerpt:'', excerpt_en:'', body:'', body_en:'', image_url:'', image_alt:'',
 published:false
});
const slugify = (title:string) => title.toLowerCase().normalize('NFKD')
 .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,120);
const imageTypes:Record<string,string> = {
 'image/jpeg':'jpg','image/png':'png','image/webp':'webp'
};

export function ArticlesAdmin({
 records,reload,isLoading,error
}:{
 records:Article[];
 reload:()=>Promise<void>;
 isLoading:boolean;
 error:unknown;
}) {
 const [currentId,setCurrentId]=useState<string | null>(null);
 const [draft,setDraft]=useState<Editable>(emptyArticle);
 const [busy,setBusy]=useState(false);
 const [uploading,setUploading]=useState(false);
 const [notice,setNotice]=useState('');
 const [problem,setProblem]=useState('');
 const [showEnglish,setShowEnglish]=useState(false);
 const current = records.find(a=>a.id===currentId);
 const change = (patch:Partial<Editable>) => {setDraft(old=>({...old,...patch}));setNotice('');setProblem('');};
 const openNew=()=>{
   setCurrentId(null);setDraft(emptyArticle());
   setNotice('');setProblem('');setShowEnglish(false);
 };
 const openEdit=(article:Article)=>{
   setCurrentId(article.id);
   setDraft({
     slug:article.slug,title:article.title,title_en:article.title_en||'',
     tag:article.tag,tag_en:article.tag_en||'',excerpt:article.excerpt,
     excerpt_en:article.excerpt_en||'',body:article.body,body_en:article.body_en||'',
     image_url:article.image_url||'',image_alt:article.image_alt||'',
     published:article.published
   });
   setShowEnglish(false);setNotice('');setProblem('');
 };
 const uploadImage=async(file:File | undefined)=>{
   if(!file)return;
   if(!supabase){setProblem('Supabase belum tersedia.');return;}
   const ext=imageTypes[file.type];
   if(!ext||file.size>5*1024*1024){
     setProblem('Gunakan gambar JPG, PNG atau WebP berukuran maksimal 5 MB.');
     return;
   }
   setUploading(true);setProblem('');setNotice('');
   try{
     const path='articles/'+crypto.randomUUID()+'.'+ext;
     const {error}=await supabase.storage.from('snbm-article-images')
       .upload(path,file,{contentType:file.type,upsert:false,cacheControl:'3600'});
     if(error)throw error;
     const {data}=supabase.storage.from('snbm-article-images').getPublicUrl(path);
     if(!data.publicUrl)throw new Error('Tidak bisa mengambil URL gambar.');
     change({image_url:data.publicUrl,image_alt:draft.image_alt||draft.title});
     setNotice('Gambar berhasil diunggah. Klik Simpan Artikel untuk menerbitkan perubahan.');
   }catch(e){
     setProblem(e instanceof Error?e.message:'Unggah gambar gagal.');
   }finally{setUploading(false);}
 };
 const save=async()=>{
   if(!supabase){setProblem('Supabase belum tersedia.');return;}
   const payload={...draft,slug:draft.slug.trim().toLowerCase(),
     title:draft.title.trim(),tag:draft.tag.trim()||'ARTIKEL',
     excerpt:draft.excerpt.trim(),body:draft.body.trim(),
     image_url:draft.image_url.trim(),image_alt:draft.image_alt.trim()};
   if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug)||payload.slug.length>120){
     setProblem('Slug hanya boleh huruf kecil, angka, dan tanda hubung (maksimal 120 karakter).');return;
   }
   if(payload.title.length<5||payload.title.length>180||payload.body.length<20){
     setProblem('Judul minimal 5 karakter dan isi artikel minimal 20 karakter.');return;
   }
   if(payload.excerpt.length>500||payload.tag.length>70||payload.body.length>30000){
     setProblem('Ringkasan, kategori, atau isi artikel terlalu panjang.');return;
   }
   if(payload.image_url && !articleImage(payload.image_url)){
     setProblem('URL gambar harus relatif (/assets/...) atau menggunakan HTTPS.');return;
   }
   setBusy(true);setProblem('');setNotice('');
   try{
     const prior=current?.published_at||null;
     const item={...payload,published_at:payload.published ? prior||new Date().toISOString() : prior};
     if(currentId){
       const {error}=await supabase.from('snbm_articles').update(item).eq('id',currentId);
       if(error)throw error;
     }else{
       const {data,error}=await supabase.from('snbm_articles').insert(item).select('id').single();
       if(error)throw error;
       if(!data)throw new Error('Artikel tidak berhasil disimpan.');
       setCurrentId(data.id);
     }
     await reload();
     setDraft(payload);
     setNotice(payload.published?'Artikel tersimpan dan dipublikasikan.':'Draft tersimpan, belum terlihat di website.');
   }catch(e){
     setProblem(e instanceof Error?e.message:'Gagal menyimpan artikel.');
   }finally{setBusy(false);}
 };
 const remove=async()=>{
   if(!supabase||!currentId)return;
   if(!window.confirm('Hapus artikel ini secara permanen? Tindakan ini tidak dapat dibatalkan.'))return;
   setBusy(true);setProblem('');setNotice('');
   try{
     const {error}=await supabase.from('snbm_articles').delete().eq('id',currentId);
     if(error)throw error;
     openNew();
     await reload();
     setNotice('Artikel berhasil dihapus.');
   }catch(e){setProblem(e instanceof Error?e.message:'Artikel gagal dihapus.');}
   finally{setBusy(false);}
 };
 return <div className="article-admin">
   <p className="subtle">Tambah, edit, unggah gambar, dan publikasikan artikel di sini. Semua perubahan tersimpan di Supabase tanpa mengubah kode atau deploy ulang.</p>
   <div className="article-admin-toolbar">
     <button type="button" className="button small" onClick={openNew}>+ Tulis artikel baru</button>
     <Link className="text-link" to="/blog" target="_blank" rel="noreferrer">Lihat halaman artikel ↗</Link>
   </div>
   <div className="article-admin-layout">
     <div className="article-admin-list">
       <strong>Daftar Artikel ({records.length})</strong>
       {isLoading && <p role="status">Memuat artikel…</p>}
       {Boolean(error) && <p role="alert">Tidak dapat membaca artikel. <button type="button" onClick={()=>void reload()}>Coba lagi</button></p>}
       {records.map(a=><button type="button" key={a.id} onClick={()=>openEdit(a)}
         className={'article-admin-list-item'+(currentId===a.id?' active':'')}>
         {articleImage(a.image_url) && <img src={articleImage(a.image_url)} alt="" loading="lazy" width="70" height="70"/>}
         <span><strong>{a.title}</strong><small>{a.published?'● Publik':'○ Draft'} · {articleDate(a.published_at||a.created_at)}</small></span>
       </button>)}
     </div>
     <div className="article-admin-editor">
       <h2>{current?'Edit artikel':'Artikel baru'}</h2>
       <p className="subtle">Judul, ringkasan, kategori, gambar utama, dan isi. Gunakan baris kosong untuk paragraf; awali subjudul dengan <code>## </code> dan daftar dengan <code>- </code>.</p>
       <label>Judul artikel *
         <input value={draft.title} maxLength={180} onChange={e=>{
           const title=e.target.value;
           change({title,...(!currentId?{slug:slugify(title)}:{})});
         }}/>
       </label>
       <label>Slug URL * <small className="subtle">(Mengubah slug artikel lama akan mengubah link-nya)</small>
         <input value={draft.slug} maxLength={120} placeholder="contoh-judul-artikel" onChange={e=>change({slug:e.target.value})}/>
       </label>
       <label>Kategori / label
         <input value={draft.tag} maxLength={70} placeholder="PANDUAN HOST" onChange={e=>change({tag:e.target.value})}/>
       </label>
       <label>Ringkasan untuk daftar & SEO
         <textarea value={draft.excerpt} rows={3} maxLength={500} onChange={e=>change({excerpt:e.target.value})}/>
       </label>
       <label>Isi artikel *
         <textarea value={draft.body} rows={14} maxLength={30000} placeholder="Tuliskan artikel lengkap di sini…" onChange={e=>change({body:e.target.value})}/>
       </label>
       <label>Gambar utama (JPG, PNG atau WebP, maks. 5 MB)
         <input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy||uploading}
           onChange={e=>{void uploadImage(e.target.files?.[0]);e.target.value='';}}/>
       </label>
       <label>Atau URL gambar
         <input value={draft.image_url} maxLength={1200} placeholder="https://... atau /assets/..." onChange={e=>change({image_url:e.target.value})}/>
       </label>
       <label>Deskripsi gambar (alt text)
         <input value={draft.image_alt} maxLength={200} onChange={e=>change({image_alt:e.target.value})}/>
       </label>
       {articleImage(draft.image_url) && <img className="article-admin-preview" src={articleImage(draft.image_url)} alt={draft.image_alt||draft.title||'Pratinjau gambar artikel'}/>}
       <details open={showEnglish} onToggle={e=>setShowEnglish(e.currentTarget.open)}>
         <summary>Versi bahasa Inggris (opsional)</summary>
         <label>English title <input value={draft.title_en} onChange={e=>change({title_en:e.target.value})}/></label>
         <label>English category <input value={draft.tag_en} onChange={e=>change({tag_en:e.target.value})}/></label>
         <label>English excerpt <textarea value={draft.excerpt_en} rows={3} onChange={e=>change({excerpt_en:e.target.value})}/></label>
         <label>English body <textarea value={draft.body_en} rows={10} onChange={e=>change({body_en:e.target.value})}/></label>
       </details>
       <label className="article-admin-publish"><input type="checkbox" checked={draft.published}
         onChange={e=>change({published:e.target.checked})}/>
         <span><strong>Publikasikan di website</strong><small>Matikan untuk menyimpan sebagai draft atau menyembunyikan artikel.</small></span>
       </label>
       <div className="article-admin-actions">
         <button type="button" className="button small" disabled={busy||uploading}
           onClick={()=>void save()}>{busy?'Menyimpan…':uploading?'Mengunggah…':'Simpan Artikel'}</button>
         {current?.published && <Link className="text-link" to={'/blog/'+current.slug} target="_blank" rel="noreferrer">Lihat artikel ↗</Link>}
         {currentId && <button type="button" className="article-admin-delete" disabled={busy||uploading}
           onClick={()=>void remove()}>Hapus Artikel</button>}
       </div>
       {problem && <p role="alert" className="article-admin-error">{problem}</p>}
       {notice && <p role="status" className="article-admin-notice">{notice}</p>}
     </div>
   </div>
 </div>;
}

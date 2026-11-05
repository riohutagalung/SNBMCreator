import { useEffect } from 'react';
// WebMCP is an optional experimental Chromium API. No form submissions or
// privileged actions are exposed to the browser agent.
type WebTool={name:string;description:string;inputSchema:object;execute:(args:Record<string,unknown>)=>unknown};
type WebModelContext={registerTool:(tool:WebTool)=>Promise<unknown>|unknown};
export function WebMcpTools(){useEffect(()=>{
  const doc=document as Document & {modelContext?:WebModelContext};
  if(!doc.modelContext?.registerTool)return;
  const tools:WebTool[]=[
    {name:'read_snbm_contact',description:'Return SNBM Creator public contact email and page URLs without sending a message.',inputSchema:{type:'object',properties:{},additionalProperties:false},execute:()=>({email:'contact@snbmcreator.com',contactUrl:'https://snbmcreator.com/kontak',hostApplicationUrl:'https://snbmcreator.com/gabung-host'})},
    {name:'open_snbm_section',description:'Navigate the visitor to a requested public SNBM Creator page. Does not submit any form.',inputSchema:{type:'object',properties:{page:{type:'string',enum:['about','services','brand','host','privacy','terms']}},required:['page'],additionalProperties:false},execute:(args)=>{const map:Record<string,string>={about:'/tentang',services:'/layanan',brand:'/kontak?jenis=brand',host:'/gabung-host',privacy:'/privasi',terms:'/syarat'};const href=map[String(args.page||'')];if(!href)return {error:'Unknown page'};window.location.assign(href);return {navigatingTo:href}}},
  ];
  for(const tool of tools){try{void Promise.resolve(doc.modelContext.registerTool(tool)).catch(()=>{})}catch{/* unsupported browser/permission */}}
},[]);return null;}
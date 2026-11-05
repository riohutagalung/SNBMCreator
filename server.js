import express from 'express';
import { createRequestHandler } from '@react-router/express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Hostinger lsnode.js calls require() on this ESM file. Do not use top-level await.
const root = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(root, 'dist', 'apps', 'web', 'client');
const serverFile = path.join(root, 'dist', 'apps', 'web', 'server', 'index.js');
if (!existsSync(serverFile)) throw new Error(`SNBM SSR build missing: ${serverFile}. Run npm run build.`);
const app = express();
app.disable('x-powered-by');
app.use(express.static(clientDir,{maxAge:'1h',index:false}));

const base = 'https://snbmcreator.com';
const contact = 'contact@snbmcreator.com';
const serviceList = [
  'Fashion retail: modest fashion, women’s fashion, bags, kidswear, underwear',
  'Full-time in-house live-commerce host development',
  'Part-time freelance live-commerce hosting',
  'Brand collaboration planning and live-selling operations',
];
const markdown = `# SNBM Creator\n\nFashion seller and live-commerce host development agency based in West Jakarta, Indonesia.\n\nWe sell fashion products and develop in-house full-time and freelance part-time hosts for live shopping.\n\n## Categories\nModest fashion, women’s wear, women’s bags, kidswear, underwear.\n\n## Services\n${serviceList.map(x=>`- ${x}`).join('\n')}\n\n## Pages\n- [About](${base}/tentang)\n- [Services](${base}/layanan)\n- [Brand enquiry](${base}/kontak?jenis=brand)\n- [Host application](${base}/gabung-host)\n- [Privacy policy](${base}/privasi)\n- [Terms](${base}/syarat)\n\nContact: [${contact}](mailto:${contact})\n\nNo telephone number, street address or official social handles are published without verification.\n`;

// Human visitors receive React Router SSR; agents explicitly asking for Markdown
// get a succinct, truthful text representation instead of the HTML shell.
app.get('/', (req,res,next) => {
  if (req.accepts(['text/markdown','text/html']) === 'text/markdown' && req.headers.accept?.includes('text/markdown')) {
    return res.set('Vary','Accept').type('text/markdown; charset=utf-8').send(markdown);
  }
  return next();
});

// Read-only informational MCP endpoint; never exposes backend credentials or
// writes applicant data. Minimal stateless Streamable HTTP JSON-RPC messages.
const mcpTools=[
  {name:'get_snbm_business_info',description:'Get public business description and contact links for SNBM Creator.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
  {name:'list_snbm_services',description:'List publicly described seller and live-commerce agency services.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
];
app.get('/.well-known/mcp/server-card.json', (_req,res)=>res.set('Access-Control-Allow-Origin','*').json({
  $schema:'https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json',
  version:'1.0',protocolVersion:'2025-06-18',
  serverInfo:{name:'id.snbmcreator.public-info',title:'SNBM Creator Public Information',version:'1.0.0'},
  description:'Read-only public information about SNBM Creator.',
  transport:{type:'streamable-http',endpoint:`${base}/mcp`},capabilities:{tools:{}},authentication:{required:false},tools:mcpTools,
}));
app.use('/mcp',express.json({limit:'16kb'}));
app.post('/mcp',(req,res)=>{
  const p=req.body;
  if(!p || p.jsonrpc!=='2.0' || typeof p.method!=='string') return res.status(400).json({jsonrpc:'2.0',id:p?.id??null,error:{code:-32600,message:'Invalid JSON-RPC request'}});
  if(p.method==='notifications/initialized') return res.status(202).end();
  const reply=(result)=>res.json({jsonrpc:'2.0',id:p.id??null,result});
  if(p.method==='initialize') return reply({protocolVersion:'2025-06-18',capabilities:{tools:{}},serverInfo:{name:'id.snbmcreator.public-info',version:'1.0.0',title:'SNBM Creator Public Information'}});
  if(p.method==='ping') return reply({});
  if(p.method==='tools/list') return reply({tools:mcpTools});
  if(p.method==='tools/call') {
    const name=p.params?.name;
    if(name==='get_snbm_business_info') return reply({content:[{type:'text',text:JSON.stringify({name:'SNBM Creator',url:base,email:contact,location:'Jakarta Barat, Indonesia',description:'Fashion seller and live-commerce host development agency',about:`${base}/tentang`,privacy:`${base}/privasi`})}]});
    if(name==='list_snbm_services') return reply({content:[{type:'text',text:serviceList.join('\n')}]});
    return res.json({jsonrpc:'2.0',id:p.id??null,error:{code:-32602,message:'Unknown tool'}});
  }
  return res.json({jsonrpc:'2.0',id:p.id??null,error:{code:-32601,message:'Method not found'}});
});
app.get('/mcp', (_req,res)=>res.status(405).set('Allow','POST').end());

async function start() {
  const serverBuild=await import(pathToFileURL(serverFile).href);
  app.use(createRequestHandler({build:serverBuild,mode:process.env.NODE_ENV||'production'}));
  const port=Number(process.env.PORT)||3000;
  const server=app.listen(port,'0.0.0.0',()=>console.log(`SNBM Creator SSR listening on 0.0.0.0:${port}`));
  server.on('error',error=>{console.error('SNBM SSR startup failed:',error);process.exitCode=1});
}
void start().catch(error=>{console.error('SNBM could not initialize SSR:',error);process.exit(1)});
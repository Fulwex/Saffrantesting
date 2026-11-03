import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const output=path.join(root,'public');
const pages=(await fs.readdir(output)).filter(name=>name.endsWith('.html'));
const stems=new Set(pages.map(name=>name.slice(0,-5)));
for(const name of [...pages,'cart.js']){
  const file=path.join(output,name);
  let source=await fs.readFile(file,'utf8');
  source=source.replaceAll('/wp-admin/admin-post.php','/preview-disabled');
  source=source.replaceAll('PDF, SVG','PDF').replaceAll(',.pdf,.svg',',.pdf');
  source=source.replace(/https:\/\/saffran\.ua\/([a-z-]+)\.html/g,(_,stem)=>`https://saffran.ua/${stem==='index'?'':stem}`);
  source=source.replace(/(?<=["'(])([a-z][a-z-]*)\.html/g,(whole,stem)=>stems.has(stem)?(stem==='index'?'/':'/'+stem):whole);
  if(name.endsWith('.html')){
    source=source.replace(/(<meta\s+name=["']robots["']\s+content=["'])[^"']*/i,'$1noindex,nofollow,noarchive');
    if(!/<meta\s+name=["']robots["']/i.test(source))source=source.replace('</head>','<meta name="robots" content="noindex,nofollow,noarchive"></head>');
    if(source.includes('id="proposal-form"')||source.includes('id="quote-form"')){
      source=source.replace('</head>','<script src="/demo-forms.js" defer></script></head>');
    }
  }
  await fs.writeFile(file,source);
}
await fs.copyFile(path.join(root,'demo-forms.js'),path.join(output,'demo-forms.js'));
await fs.writeFile(path.join(output,'robots.txt'),'User-agent: *\nDisallow: /\n');
const inventory=JSON.parse(await fs.readFile(path.join(root,'seo-inventory-source.json'),'utf8'));
const decisions=JSON.parse(await fs.readFile(path.join(root,'seo-decisions-source.json'),'utf8'));
const manifest=inventory.filter(row=>row.status==='publish').map(row=>({
  id:row.id,type:row.type,title:row.title,source:new URL(row.url).pathname,
  ...(decisions[row.type]?.[row.id]||{action:'review'})
}));
await fs.writeFile(path.join(root,'seo-migration.json'),JSON.stringify(manifest,null,2));
const configFile=path.join(root,'vercel.json');
const config=JSON.parse(await fs.readFile(configFile,'utf8'));
config.redirects=manifest.filter(row=>row.action==='redirect'&&row.target).map(row=>({
  source:row.source,destination:row.target.replace(/\/$/,'')||'/',statusCode:301
}));
await fs.writeFile(configFile,JSON.stringify(config,null,2)+'\n');
console.log('Vercel copy transformed:',pages.length,'pages; clean internal URLs; demo forms; noindex.');

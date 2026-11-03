import fs from 'node:fs';
import path from 'node:path';
const files=fs.readdirSync('.').filter(f=>f.endsWith('.html'));
let errors=[];
for(const file of files){
  const html=fs.readFileSync(file,'utf8');
  const h1=(html.match(/<h1\b/g)||[]).length;
  if(h1!==1) errors.push(`${file}: expected 1 h1, found ${h1}`);
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(x=>x[1]);
  for(const id of new Set(ids)) if(ids.filter(x=>x===id).length>1) errors.push(`${file}: duplicate id ${id}`);
  for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    const ref=m[1].split('#')[0].split('?')[0];
    if(!ref||/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
    if(!fs.existsSync(path.resolve(path.dirname(file),ref))) errors.push(`${file}: missing ${ref}`);
  }
  for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
    try{JSON.parse(m[1])}catch(e){errors.push(`${file}: invalid JSON-LD ${e.message}`)}
  }
}
for(const css of ['inner.css','inner-v2.css','proposal.css','products.css','v2-home.css','partners.css','brand-home.css','brand-system.css']){
  const text=fs.readFileSync(css,'utf8');
  let n=0;for(const c of text){if(c==='{')n++;if(c==='}')n--;}if(n!==0)errors.push(`${css}: brace balance ${n}`);
}
console.log(`Checked ${files.length} HTML files.`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('All structural checks passed.');

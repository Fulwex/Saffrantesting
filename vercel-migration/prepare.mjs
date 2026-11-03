import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const source=path.join(root,'source-v3'),output=path.join(root,'public');
await fs.mkdir(output,{recursive:true});
const entries=await fs.readdir(source,{withFileTypes:true});
const textFiles=entries.filter(entry=>entry.isFile()&&['.html','.css','.js'].includes(path.extname(entry.name))).map(entry=>entry.name);
const references=new Set();
for(const name of textFiles){
  const content=await fs.readFile(path.join(source,name),'utf8');
  await fs.copyFile(path.join(source,name),path.join(output,name));
  for(const match of content.matchAll(/assets\/[A-Za-z0-9_./-]+/g)){
    const relative=match[0].replace(/[.,;']+$/,'');
    const file=path.resolve(source,relative);
    if(file.startsWith(path.join(source,'assets')+path.sep)){
      try{if((await fs.stat(file)).isFile())references.add(relative)}catch{}
    }
  }
}
for(const relative of references){
  const destination=path.join(output,relative);
  await fs.mkdir(path.dirname(destination),{recursive:true});
  await fs.copyFile(path.join(source,relative),destination);
}
console.log(`Copied ${textFiles.length} static files and ${references.size} assets`);

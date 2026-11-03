// Bulk mechanical font-name cleanup and shared stylesheet wiring; no content rewrite.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
for(const entry of await fs.readdir(root,{withFileTypes:true})){
  if(!entry.isFile() || !/\.(html|css)$/.test(entry.name))continue;
  const file=path.join(root,entry.name);
  let source=await fs.readFile(file,'utf8');
  source=source.replace(/@font-face\{[^}]*assets\/(?:cg-|manrope-)[^}]*\}\s*/g,'');
  source=source.replaceAll('"Cormorant Garamond"','Cormorant').replaceAll('Manrope','Montserrat');
  if(entry.name.endsWith('.html') && !source.includes('href="brand-system.css"')){
    source=source.replace('</head>','<link rel="stylesheet" href="brand-system.css">\n</head>');
  }
  await fs.writeFile(file,source);
}
const generatorPath=path.join(root,'generate-products.mjs');
let generator=await fs.readFile(generatorPath,'utf8');
if(!generator.includes('href="brand-system.css"')) generator=generator.replace('<link rel="stylesheet" href="cart.css"></head>','<link rel="stylesheet" href="cart.css"><link rel="stylesheet" href="brand-system.css"></head>');
await fs.writeFile(generatorPath,generator);
console.log('Brand typography wired into all v3 pages and product generator. Older versions unchanged.');

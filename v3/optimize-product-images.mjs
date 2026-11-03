import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('sharp');
const directory='assets/products';
for(const file of fs.readdirSync(directory).filter(name=>/\.(jpe?g|png)$/i.test(name))){
  const input=path.join(directory,file);
  const output=path.join(directory,file.replace(/\.(jpe?g|png)$/i,'.webp'));
  if(fs.existsSync(output))continue;
  await sharp(input).rotate().resize({width:1000,withoutEnlargement:true}).webp({quality:82,effort:5}).toFile(output);
  console.log(`${file} → ${path.basename(output)}`);
}

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/gemuk/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=process.cwd(),publicDir=path.join(root,'public');
const server=http.createServer(async(req,res)=>{const raw=new URL(req.url,'http://localhost').pathname;const relative=raw==='/'?'index.html':raw.slice(1)+(path.extname(raw)?'':'.html');const file=path.resolve(publicDir,relative);if(!file.startsWith(publicDir+path.sep)){res.statusCode=403;return res.end()}try{const bytes=await fs.readFile(file);res.setHeader('Content-Type',file.endsWith('.html')?'text/html':file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'application/octet-stream');res.end(bytes)}catch{res.statusCode=404;res.end()}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 for(const width of [390,1280]){
  const page=await browser.newPage({viewport:{width,height:800},deviceScaleFactor:1});
  for(const route of ['/','/about','/hotel-textile','/spa-textile','/products']){
   await page.goto(`http://127.0.0.1:${server.address().port}${route}`);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   const slug=route==='/'?'home':route.slice(1);
   const selector=route==='/'?'.direction-hotel':route==='/about'?'.ab-hero':route==='/products'?'.catalog':'.intro';
   await page.locator(selector).scrollIntoViewIfNeeded();
   await page.waitForTimeout(900);
   await page.locator(selector).screenshot({path:path.join(root,`qa-editorial-${slug}-${width}.png`)});
   if(route==='/'){
    for(const extra of ['.hero','.partners-portfolio']){
     await page.locator(extra).scrollIntoViewIfNeeded();await page.waitForTimeout(500);
     await page.locator(extra).screenshot({path:path.join(root,`qa-editorial-home-${extra.slice(1)}-${width}.png`)});
    }
   }
   if(route==='/hotel-textile'||route==='/spa-textile'){
    for(const extra of ['.inner-hero','.expertise','.knowledge']){
     await page.locator(extra).scrollIntoViewIfNeeded();await page.waitForTimeout(900);
     await page.locator(extra).screenshot({path:path.join(root,`qa-editorial-${slug}-${extra.slice(1)}-${width}.png`)});
    }
   }
   console.log(JSON.stringify({width,route,overflow,section:selector}));
   if(overflow>2)process.exitCode=1;
  }
  await page.close();
 }
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}

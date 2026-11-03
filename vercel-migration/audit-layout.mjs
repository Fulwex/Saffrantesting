import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/gemuk/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.dirname(fileURLToPath(import.meta.url));
const publicDir=path.join(root,'public');
const server=http.createServer(async(req,res)=>{const raw=new URL(req.url,'http://localhost').pathname;const relative=raw==='/'?'index.html':raw.slice(1)+(path.extname(raw)?'':'.html');const file=path.resolve(publicDir,relative);if(!file.startsWith(publicDir+path.sep)){res.statusCode=403;return res.end()}try{const bytes=await fs.readFile(file);res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'application/octet-stream');res.end(bytes)}catch{res.statusCode=404;res.end()}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();
 const routes=['/','/about','/hotel-textile','/spa-textile','/products','/product-towels','/product-bed-linen','/product-robes','/cart','/proposal'];
 for(const width of [1440,1280,1024,768,430,390,375,320]){
   await page.setViewportSize({width,height:900});
   for(const route of routes){
     await page.goto(base+route);
     const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,h1:Math.round(parseFloat(getComputedStyle(document.querySelector('h1')).fontSize)),height:document.documentElement.scrollHeight,sections:[...document.querySelectorAll('main > section')].map(el=>({name:el.className.split(' ')[0],height:Math.round(el.getBoundingClientRect().height)})).sort((a,b)=>b.height-a.height).slice(0,3)}));
     if(width===1280&&route==='/about'){
       const bounds=await page.evaluate(()=>({hero:document.querySelector('.about-hero').getBoundingClientRect().height,viewport:innerHeight,grid:document.querySelector('.about-hero-grid').getBoundingClientRect().height}));
       console.log(JSON.stringify({aboutBounds:bounds}));
       await page.screenshot({path:path.join(root,'qa-layout-about-1280.png')});
     }
     if([1280,390].includes(width)&&route==='/'){
       for(const [name,selector] of [['hero','.hero'],['about','.about'],['partners','.partners-portfolio'],['hotel','.direction-hotel'],['spa','.direction-spa'],['catalog','.products']]){
         await page.locator(selector).scrollIntoViewIfNeeded();
         await page.waitForTimeout(750);
         await page.locator(selector).screenshot({path:path.join(root,`qa-refined-${name}-${width}.png`)});
       }
     }
     if([1280,390].includes(width)&&route==='/hotel-textile'){
       await page.waitForTimeout(800);
       await page.locator('.inner-hero').screenshot({path:path.join(root,`qa-refined-hotel-hero-${width}.png`)});
     }
     if(data.overflow>2||[1280,390].includes(width))console.log(JSON.stringify({width,route,...data}));
   }
 }
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/gemuk/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.dirname(fileURLToPath(import.meta.url));
const publicDir=path.join(root,'public');
const pages=(await fs.readdir(publicDir)).filter(name=>name.endsWith('.html')).map(name=>name.slice(0,-5));
const outbound=[];
const server=http.createServer(async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname.startsWith('/api/')||pathname.includes('admin-post')||pathname==='/preview-disabled')outbound.push(pathname);
  const relative=pathname==='/'?'index.html':pathname.slice(1)+(path.extname(pathname)?'':'.html');
  const file=path.resolve(publicDir,relative);
  if(!file.startsWith(publicDir+path.sep)){res.statusCode=403;return res.end();}
  try{
    const bytes=await fs.readFile(file);
    res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.mp4')?'video/mp4':file.endsWith('.webp')?'image/webp':'application/octet-stream');
    res.end(bytes);
  }catch{res.statusCode=404;res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
  const loopPage=await browser.newPage({viewport:{width:390,height:844}});
  await loopPage.clock.install();
  await loopPage.goto(base+'/product-towels');
  for(let cycle=0;cycle<4;cycle++){
    await loopPage.clock.runFor(16000);
    const bounds=await loopPage.locator('.suggestion-window').evaluate(windowEl=>{
      const view=windowEl.getBoundingClientRect();
      const groups=[...windowEl.querySelectorAll('.suggestion-group')].map(el=>el.getBoundingClientRect());
      return {viewLeft:view.left,viewRight:view.right,firstLeft:groups[0].left,firstRight:groups[0].right,secondLeft:groups[1].left,secondRight:groups[1].right};
    });
    assert(bounds.firstLeft<=bounds.viewLeft+18||bounds.secondLeft<=bounds.viewLeft+18,'loop covers left edge at '+cycle);
    assert(bounds.firstRight>=bounds.viewRight-18||bounds.secondRight>=bounds.viewRight-18,'loop covers right edge at '+cycle);
    assert(Math.abs(bounds.firstRight-bounds.secondLeft)<20,'loop has no blank seam at '+cycle);
  }
  await loopPage.close();
  const page=await browser.newPage({viewport:{width:390,height:844}});
  for(const stem of pages){
    await page.goto(base+(stem==='index'?'/':'/'+stem));
    assert.equal(await page.locator('main').count(),1,stem);
    assert.equal(await page.locator('.footer-social a').count(),2,stem+' social footer');
    assert.deepEqual(await page.locator('.footer-social a').evaluateAll(nodes=>nodes.map(el=>el.href)),['https://www.instagram.com/saffran_textile/','https://www.facebook.com/SaffranUkraine/'],stem+' social destinations');
    if(stem.startsWith('product-')){
      const strips=page.locator('.suggestion-window');
      assert.equal(await strips.count(),1,stem+' has recommendation strip');
      const groups=await strips.locator('.suggestion-group').evaluateAll(nodes=>nodes.map(el=>({width:el.getBoundingClientRect().width,visible:getComputedStyle(el).display!=='none',cards:el.querySelectorAll('.suggestion-card').length})));
      assert.equal(groups.length,2,stem+' has two continuous groups');
      assert(groups.every(group=>group.visible&&group.cards>=5&&group.width>390),stem+' has visible full groups');
      assert(Math.abs(groups[0].width-groups[1].width)<1,stem+' groups align without a gap');
      const before=await strips.locator('.suggestion-track').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41);
      await page.waitForTimeout(160);
      assert.notEqual(before,await strips.locator('.suggestion-track').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41),stem+' strip keeps moving');
    }
    if(await page.locator('meta[name="robots"]').count())assert.match(await page.locator('meta[name="robots"]').getAttribute('content'),/noindex/,stem);
    if(['index','products','product-bed-linen'].includes(stem)){
      await page.reload();assert.equal(await page.locator('main').count(),1,stem+' reload');
    }
  }
  await page.goto(base+'/');
  await page.evaluate(()=>scrollTo(0,700));
  await page.waitForTimeout(120);
  assert.equal(await page.locator('.site-header').evaluate(el=>Math.round(el.getBoundingClientRect().height)),0,'mobile header collapses on scroll');
  assert(await page.locator('.menu-toggle').isVisible(),'menu toggle remains visible');
  await page.locator('.menu-toggle').click();
  assert.deepEqual(await page.locator('.nav-links > *').evaluateAll(nodes=>nodes.filter(el=>getComputedStyle(el).display!=='none').sort((a,b)=>Number(getComputedStyle(a).order)-Number(getComputedStyle(b).order)).map(el=>el.className.split(' ').find(name=>name.startsWith('nav-')))),['nav-about','nav-products','nav-hotel','nav-spa','nav-cart','nav-contacts','nav-social'],'mobile navigation order');
  assert.equal(await page.locator('.nav-social a').count(),2,'mobile menu social links');
  await page.locator('.product-menu summary').click();
  await page.waitForTimeout(400);
  assert.equal(await page.locator('.product-menu-panel a img').count(),9,'category thumbnails');
  assert(await page.locator('.product-menu-panel a:first-child').evaluate(el=>getComputedStyle(el).backgroundColor!=='rgba(0, 0, 0, 0)'),'catalog link highlighted');
  await page.screenshot({path:path.join(root,'qa-mobile-menu.png')});
  await page.locator('.menu-toggle').click();
  const strip=page.locator('.partner-strip').first();
  const before=await strip.locator('.partner-track').evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(180);
  const after=await strip.locator('.partner-track').evaluate(el=>getComputedStyle(el).transform);
  assert.notEqual(before,after,'partners keep moving');
  const stripBox=await strip.boundingBox();
  await page.mouse.move(stripBox.x+stripBox.width/2,stripBox.y+stripBox.height/2);
  await page.mouse.down();
  await page.mouse.move(stripBox.x+stripBox.width/2+85,stripBox.y+stripBox.height/2,{steps:5});
  await page.mouse.up();
  const dragged=await strip.locator('.partner-track').evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(180);
  assert.notEqual(dragged,await strip.locator('.partner-track').evaluate(el=>getComputedStyle(el).transform),'partners resume after drag');
  await strip.screenshot({path:path.join(root,'qa-mobile-partners.png')});
  assert.equal(await page.locator('#proposal-form').count(),0,'home uses a concise CTA instead of a duplicate form');
  assert.equal(await page.locator('.proposal-cta').count(),0,'home has no duplicate final CTA');
  assert.deepEqual(outbound,[]);
  await page.goto(base+'/product-towels');
  const group=page.locator('.suggestion-group').first();
  const cardGap=await group.evaluate(el=>el.children[1].getBoundingClientRect().left-el.children[0].getBoundingClientRect().right);
  assert(cardGap<=20,'recommendations have no large gaps');
  const suggestionTrack=page.locator('.suggestion-track');
  assert.equal(await page.locator('.suggestion-group').count(),2,'recommendation group is duplicated for seamless motion');
  const groupWidths=await page.locator('.suggestion-group').evaluateAll(groups=>groups.map(el=>el.getBoundingClientRect().width));
  assert(Math.abs(groupWidths[0]-groupWidths[1])<1,'loop groups have identical widths');
  assert(groupWidths[0]>390,'loop group fills more than the mobile viewport');
  assert.equal(await suggestionTrack.evaluate(el=>getComputedStyle(el).animationName),'none','recommendations use drag-aware animation');
  const suggestionOffset=async()=>suggestionTrack.evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41);
  const flowing=await suggestionOffset();
  await page.waitForTimeout(220);
  assert.notEqual(flowing,await suggestionOffset(),'recommendations move continuously');
  const suggestionBox=await page.locator('.suggestion-window').boundingBox();
  await page.mouse.move(suggestionBox.x+suggestionBox.width/2,suggestionBox.y+suggestionBox.height/2);
  await page.mouse.down();
  await page.mouse.move(suggestionBox.x+suggestionBox.width/2+90,suggestionBox.y+suggestionBox.height/2,{steps:5});
  await page.mouse.up();
  const afterSwipe=await suggestionOffset();
  await page.waitForTimeout(220);
  assert.notEqual(afterSwipe,await suggestionOffset(),'recommendations continue after manual swipe');
  await page.locator('.suggestion-rail').screenshot({path:path.join(root,'qa-mobile-suggestions.png')});
  const card=page.locator('.tier-card:has(.js-color)').first();
  await card.locator('.js-color').selectOption({index:1});
  await card.locator('.js-quantity').fill('4');
  const plus=card.locator('.js-quantity-step[data-step="1"]');
  await plus.scrollIntoViewIfNeeded();
  const box=await plus.boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  await page.mouse.down();
  await page.waitForTimeout(650);
  await page.mouse.up();
  assert(Number(await card.locator('.js-quantity').inputValue())>=7,'holding plus repeats');
  await card.locator('.js-quantity').fill('4');
  await card.locator('.js-add-to-cart').click();
  await page.goto(base+'/');
  await page.evaluate(()=>scrollTo(0,700));
  assert(await page.locator('.mobile-cart-link.has-items').isVisible(),'cart icon remains visible in compact mobile header');
  await page.goto(base+'/cart');
  assert.match(await page.locator('#cart-summary').innerText(),/4 одиниць/);
  await page.locator('#quote-form input[name="phone"]').fill('+380671234567');
  await page.locator('#quote-form button[type="submit"]').click();
  assert.equal(await page.locator('#quote-status').innerText(),'Демонстраційна версія — заявки не надсилаються');
  assert.match(await page.locator('#cart-summary').innerText(),/4 одиниць/);
  assert.deepEqual(outbound,[]);
  await page.setViewportSize({width:1280,height:800});
  await page.goto(base+'/about');
  assert.equal(await page.locator('.ab-hero-media video').count(),1,'About hero keeps the production film');
  assert.match(await page.locator('.ab-hero-media video source').getAttribute('src'),/about-story-23\.mp4/);
  assert.equal(await page.locator('.ab-material video').count(),0,'material section uses photography, not video');
  assert.equal(await page.locator('.ab-material-media img').count(),1,'material photograph in the material section');
  assert.equal(await page.locator('.ab-page img[src*="radisson"]').count(),0,'About has no partner logo image');
  assert.equal(await page.locator('.ab-steps .ab-step').count(),4,'four process steps');
  assert.match(await page.locator('.ab-places').innerText(),/Україна[\s\S]*Європа[\s\S]*Балі/);
  assert.equal(await page.locator('.ab-places').getByText('Азербайджан').count(),0);
  assert.equal(await page.locator('.ab-hero-media video').getAttribute('preload'),'none');
  assert.equal(await page.locator('.nav-links > .nav-extra').count(),0,'duplicate proposal link removed');
  await page.screenshot({path:path.join(root,'qa-about-desktop.png')});
  await page.locator('.product-menu summary').click();
  assert.equal(await page.locator('.product-menu-panel a img').count(),9,'desktop menu thumbnails');
  await page.locator('.product-menu-panel').screenshot({path:path.join(root,'qa-desktop-menu.png')});
  for (const width of [320,390,430,768,1280]) {
    await page.setViewportSize({width,height:844});
    await page.goto(base+'/about');
    const overflow=await page.evaluate(()=>({body:document.body.scrollWidth,root:document.documentElement.scrollWidth,viewport:innerWidth,offenders:[...document.querySelectorAll('*')].filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+3&&getComputedStyle(el).position!=='fixed'}).slice(0,12).map(el=>({tag:el.tagName,class:el.className,right:Math.round(el.getBoundingClientRect().right)}))}));
    if(overflow.root>width+2)console.log('About overflow',width,overflow);
    assert(overflow.root<=width+2,'About has no horizontal overflow at '+width);
    if (width<=430) {
      const media=await page.locator('.ab-hero-media').boundingBox();
      assert(media.width>=width-2,'hero film fills mobile viewport at '+width);
      assert(media.height>=320,'hero film keeps a readable height at '+width);
      assert.equal(await page.locator('.ab-hero-media video').evaluate(el=>getComputedStyle(el).objectFit),'cover');
    }
    if(width===1280){
      const media=await page.locator('.ab-hero-media').boundingBox();
      assert(media.width>width*0.35,'About hero film column holds its share at 1280');
      assert.equal(await page.locator('.ab-hero-media video').evaluate(el=>getComputedStyle(el).objectFit),'cover');
    }
    if (width===390 || width===1280) {
      await page.locator('.ab-hero').screenshot({path:path.join(root,`qa-about-hero-${width}.png`)});
      await page.locator('.ab-manifesto').screenshot({path:path.join(root,`qa-about-statement-${width}.png`)});
      await page.locator('.ab-process').screenshot({path:path.join(root,`qa-about-process-${width}.png`)});
      await page.locator('.ab-geo').screenshot({path:path.join(root,`qa-about-geography-${width}.png`)});
      await page.locator('.ab-quote').screenshot({path:path.join(root,`qa-about-values-${width}.png`)});
    }
  }
  for(const width of [320,390,768,1280]){
    await page.setViewportSize({width,height:844});
    for(const route of ['/', '/products', '/product-towels', '/cart', '/proposal']){
      await page.goto(base+route);
      const overflow=await page.evaluate(()=>({amount:document.documentElement.scrollWidth-innerWidth,offenders:[...document.querySelectorAll('*')].filter(el=>{const rect=el.getBoundingClientRect();return rect.right>innerWidth+2&&getComputedStyle(el).position!=='fixed'}).slice(0,8).map(el=>({tag:el.tagName,class:el.className,right:Math.round(el.getBoundingClientRect().right)}))}));
      if(overflow.amount>2)console.log('Compact overflow',route,width,overflow);
      assert(overflow.amount<=2,route+' has no horizontal overflow at '+width);
      if((width===390||width===1280)&&['/','/products','/product-towels'].includes(route)){
        await page.addStyleTag({content:'.reveal{opacity:1!important;transform:none!important;transition:none!important}'});
        await page.screenshot({path:path.join(root,`qa-compact-${route==='/'?'home':route.slice(1)}-${width}.png`)});
        if(route==='/'){
          await page.locator('.brand-home .hero').screenshot({path:path.join(root,`qa-home-hero-${width}.png`)});
          await page.locator('.brand-home .about').screenshot({path:path.join(root,`qa-home-about-${width}.png`)});
        }
      }
    }
  }
  console.log('Static preview browser QA passed:',pages.length,'clean routes, reloads, native color select, local cart, demo forms without network submissions.');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}

import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await fs.readFile('index.html','utf8');
const css=await fs.readFile('brand-home.css','utf8');
const partnerCss=await fs.readFile('partners.css','utf8');
const systemCss=await fs.readFile('brand-system.css','utf8');
assert(html.includes('<body class="brand-home">'));
assert.equal((html.match(/href="brand-home.css(?:\?[^\"]*)?"/g)||[]).length,1);
assert(html.indexOf('href="brand-home.css')>html.indexOf('href="partners.css'));
assert(html.includes('<em>Ваша гостинність.</em>'));
assert.equal((html.match(/<figure class="partner-work"/g)||[]).length,17);
assert.equal((html.match(/class="partner-work-location"/g)||[]).length,17);
assert(!html.includes('Відкрийте фото, щоб роздивитися деталі'));
assert(!html.includes('partners-motion'));
assert(!/animation-play-state|animation\s*:\s*none/.test(css));
assert(partnerCss.includes('136s linear infinite'));
// White About is retained; partner background is flat navy plus static linework.
assert(!/\.brand-home\s+\.(?:hero|direction-hotel|direction-spa|products|proposal)\s*\{[^}]*\bbackground\s*:/.test(css));
assert(css.includes('.brand-home .about{background:#fbfaf7;'));
assert(!css.includes('radial-gradient'));
assert(css.includes('padding-bottom:88px;isolation:isolate'));
assert(css.includes('.brand-home .about>.container{position:relative;z-index:1}'));
assert(css.includes('.brand-home .about::before{content:none}'));
assert(!/#(?:d9e2e8|ccd7e0|e1e7e9|d4e0e7)/i.test(css));
for(const selector of ['.brand-home .about{','.brand-home .about::before{']){
  const declarations=css.split(selector)[1].split('}')[0];
  for(const [hex] of declarations.matchAll(/#[0-9a-f]{6}(?:[0-9a-f]{2})?/gi)){
    const [red,green,blue]=hex.slice(1,7).match(/../g).map(part=>parseInt(part,16));
    assert(red>=green && green>=blue,`About backdrop introduced an off-palette cool color: ${hex}`);
  }
}
assert(css.includes('.brand-home .about + .partners-portfolio{border-top:0}'));
assert(css.includes('width:min(1280px,calc(100% - 88px));height:1px'));
assert(css.includes('linear-gradient(90deg,#b29a70 0 64px,#e0d9cb 64px 100%)'));
assert(css.includes('.brand-home .about{padding-bottom:56px}'));
assert(css.includes('.brand-home .about-stage{box-shadow:0 14px 42px #111b340a}'));
assert(!/body\s*\{[^}]*\bbackground\s*:/.test(systemCss));
assert(!css.includes('--box-surface'));
assert(!/\.brand-home\s+\.partners-portfolio\s*\{/.test(css));
assert(!html.includes('partners-editorial-note'));
for(const sheet of [systemCss,css,partnerCss]){
  assert(!/brand-black|brand-graphite|#1d1d1b|#363634|#30302e/i.test(sheet));
}
assert(partnerCss.includes('--work-width:clamp(340px,25vw,380px)'));
assert(partnerCss.includes('gap:20px;padding-right:20px;flex-shrink:0;align-items:flex-start'));
assert(partnerCss.includes('.partner-strips{position:relative;z-index:1;display:grid;gap:24px}'));
assert(partnerCss.includes('.partner-strips{gap:18px}.partner-track-group{gap:14px;padding-right:14px}'));
const cardRule=partnerCss.match(/\.partner-work\{([^}]+)\}/)[1];
assert(cardRule.includes('display:block;width:var(--work-width);aspect-ratio:1'));
assert(cardRule.includes('border:0;box-shadow:none;background:transparent'));
const captionRule=partnerCss.match(/\.partner-work-caption\{([^}]+)\}/)[1];
assert(captionRule.includes('position:absolute;z-index:2;top:18px;left:18px'));
assert(captionRule.includes('padding:0;background:none;border:0'));
assert(partnerCss.includes('.partner-work-photo{position:absolute;inset:0;display:block;aspect-ratio:1'));
assert(!partnerCss.includes('--detail-lift'));
assert(!partnerCss.includes('.partner-work-name'));
assert(partnerCss.includes('.partner-work-caption-light .partner-work-location{color:#fff'));
assert(!/\.partner-work-caption\{[^}]*background:(?!none)/.test(partnerCss));
assert(!partnerCss.includes('.partner-work-caption::before'));
assert(!partnerCss.includes('.partner-work::before'));
assert(!partnerCss.includes('.partner-work::after'));
assert(partnerCss.includes('background:#e5e1d9;border:0'));
assert(!/repeating-linear-gradient|border:8px|border-width:6px/.test(partnerCss));
assert(!/background(?:-image)?:[^;\n}]*gradient/i.test(partnerCss));
assert(partnerCss.includes("background-image:url('assets/partner-thread-contour.svg')"));
assert(partnerCss.includes("url('assets/partner-weave-detail.svg')"));
assert(partnerCss.includes('background-size:min(78vw,1020px) auto,min(52vw,680px) auto;pointer-events:none'));
assert(partnerCss.includes('background-size:560px auto,410px auto'));
const contour=await fs.readFile('assets/partner-thread-contour.svg','utf8');
assert.equal((contour.match(/<path\b/g)||[]).length,8);
assert(contour.includes('stroke="#d5b779"'));
assert(contour.includes('fill="none"'));
assert(!/gradient|<filter|<image|<script|<animate/i.test(contour));
assert((await fs.stat('assets/partner-thread-contour.svg')).size<3000);
const weave=await fs.readFile('assets/partner-weave-detail.svg','utf8');
assert(weave.includes('stroke-dasharray="2 11"'));
assert(!/gradient|<filter|<image|<script|<animate/i.test(weave));
assert((await fs.stat('assets/partner-weave-detail.svg')).size<3000);
assert(!/partner-work-city|partner-work-region/.test(html+partnerCss));
assert(partnerCss.includes('font-family:var(--serif);color:#101827;font-size:2rem;font-style:italic;font-weight:700;'));
assert(partnerCss.includes('.partner-work-caption-light .partner-work-location{color:#fff'));
assert(!/partners-transition|Текстиль для вашого простору/.test(html+partnerCss));
assert.equal((html.match(/<div class="partners-boundary" aria-hidden="true"><\/div>/g)||[]).length,0);
assert(partnerCss.includes('padding:88px 0 42px;background:#111b34'));
const partnerSection=html.match(/<section class="partners\b[\s\S]*?<\/section>/)[0];
assert.equal((partnerSection.match(/<a\b/g)||[]).length,0,'Moving partner photos should not add a second navigation strip');
assert(partnerCss.includes('mask-image:linear-gradient'));
assert(partnerCss.includes('background:#111b34'));
assert(partnerCss.includes('font-style:italic'));
assert(partnerCss.includes('font-size:2rem'));
assert(!/line-clamp|text-overflow:ellipsis/.test(partnerCss));
assert(!html.includes('partner-work-number'));
assert(!partnerCss.includes('partner-work-number'));
assert(!html.includes('partner-sectors'));
assert(partnerCss.includes('animation-delay:-37s'));
for(const filename of (await fs.readdir('.')).filter(name=>name.endsWith('.html'))){
  const page=await fs.readFile(filename,'utf8');
  assert.equal((page.match(/href="brand-system.css(?:\?[^\"]*)?"/g)||[]).length,1,`${filename}: shared brand stylesheet missing or duplicated`);
  assert(!/Manrope|Cormorant Garamond|assets\/(cg-|manrope-)/.test(page),`${filename}: old font reference`);
}
const generator=await fs.readFile('generate-products.mjs','utf8');
assert(generator.includes('href="brand-system.css"'));
for(const file of ['montserrat-variable.woff2','cormorant-variable.woff2','cormorant-italic-variable.woff2','montserrat-OFL.txt','cormorant-OFL.txt']){
  assert((await fs.stat(`assets/brand-fonts/${file}`)).size>1000);
}
for(const filename of (await fs.readdir('.')).filter(name=>name.endsWith('.html')&&name!=='index.html')){
  assert(!(await fs.readFile(filename,'utf8')).includes('href="brand-home.css"'),`Homepage styling leaked into ${filename}`);
}
function luminance(hex){
  return hex.match(/\w\w/g).map(value=>parseInt(value,16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
}
function contrast(a,b){const values=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (values[0]+.05)/(values[1]+.05);}
// Conservative bound brighter than flat navy plus the translucent gold contour.
for(const [label,foreground,background] of [
  ['partner section heading','f4efe5','56566a'],
  ['light partner accents','ffffff','56566a'],
  ['gold accent heading','e4cda6','56566a'],
  ['intro body','c8d2df','56566a'],
  ['catalog link','e4cda6','56566a'],
  ['about heading','111b34','fbfaf7'],
  ['about intro','111b34','fbfaf7'],
  ['about bronze accent','87663a','fbfaf7']
]){
  const ratio=contrast(foreground,background);
  assert(ratio>=4.5,`${label}: insufficient contrast ${ratio.toFixed(2)}`);
  console.log(`${label}: ${ratio.toFixed(2)}:1`);
}
console.log('Theme checks passed: city captions over borderless photos without backgrounds, Premier named once, separate rows and uninterrupted tracks. Browser rendering not tested.');

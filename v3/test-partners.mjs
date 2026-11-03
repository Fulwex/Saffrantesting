import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import sharp from 'sharp';
import {partners,sourcePhotos,pendingPhotos,duplicatePhotos,partnerLogoSources,partnerLogoCrops} from './partner-data.mjs';
import {partnerRetouchAssets} from './partner-retouch-assets.mjs';
import {displayLocations,captionLayout,partnerRowIds,premierDisplayName} from './partner-caption-layout.mjs';
const html=await fs.readFile('index.html','utf8');
const css=await fs.readFile('partners.css','utf8');
const script=await fs.readFile('partners.js','utf8');
assert.equal((html.match(/class="partner-strip(?: partner-strip-reverse)?"/g)||[]).length,2);
const figures=[...html.matchAll(/<figure class="partner-work"[^>]*>[\s\S]*?<\/figure>/g)].map(match=>match[0]);
assert.equal(figures.length,partners.length);
assert.equal(new Set(partnerRowIds.flat()).size,partners.length);
assert(partnerRowIds.flat().every(id=>partners.some(partner=>partner.id===id)));
for(const row of partnerRowIds){
  const longIds=new Set(['wol','beverly']);
  assert(row.every((id,index)=>!longIds.has(id)||!longIds.has(row[(index+1)%row.length])),'Long place labels must not follow each other, including at the loop seam');
  const place=id=>(displayLocations[id]||partners.find(partner=>partner.id===id)?.location||'').split(' · ')[0];
  assert(row.every((id,index)=>place(id)!==place(row[(index+1)%row.length])),'Neighbouring cases should have different cities, including at the loop seam');
}
assert(!/partner-work-city|partner-work-region/.test(html));
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const partner of partners){
  const location=displayLocations[partner.id]||partner.location;
  assert(!/Поляниця|область/.test(location),'Do not use Polianytsia or an unabbreviated oblast');
  const figure=figures.find(value=>value.includes(`data-partner="${partner.id}"`));
  assert(figure.includes(`<span class="partner-work-location">${escape(location)}</span>`),'Keep the verified place label with each image');
  const layout=captionLayout[partner.id];
  assert(figure.includes(`partner-work-caption-${layout.corner}`),'Caption must use a photo-specific free corner');
  assert.equal(figure.includes('partner-work-caption-light'),layout.tone==='light');
  assert.equal((figure.match(/<strong>/g)||[]).length,partner.id==='premier'?1:0,'Only Premier needs a visible name');
  if(partner.id==='premier') assert(figure.includes(`<strong>${escape(premierDisplayName)}</strong>`));
  assert(!figure.includes('partner-work-name'),'Do not add a separate name overlay');
}
for(const figure of figures){
  assert(!figure.includes('--detail-lift'));
  assert.equal((figure.match(/<figcaption\b/g)||[]).length,1);
}
assert.equal(new Set(partners.map(p=>p.id)).size,partners.length);
assert.equal(Object.keys(partnerLogoSources).length,partners.length);
assert.equal(partners.find(partner=>partner.id==='trysyny').name,'Три Сини та Донька');
assert(!html.includes('Три Сини та Донька 5*'));
assert.equal((html.match(/class="partner-work-photo partner-work-photo-relit"/g)||[]).length,partners.length);
assert(css.includes('object-fit:contain;filter:none'));
assert(!html.includes('--crop-saturation:'));
const assigned=[...partners.flatMap(p=>p.photos.map(p=>p.number)),...pendingPhotos.flatMap(p=>p.numbers),...duplicatePhotos.map(p=>p.number)];
assert.deepEqual(assigned.sort((a,b)=>a-b),sourcePhotos.map(p=>p.number));
assert(css.includes('136s linear infinite'));
assert(css.includes('animation-direction:reverse'));
assert(css.includes('translate3d(-50%,0,0)'));
assert(css.includes('aspect-ratio:1;'));
assert(css.includes('.partner-work-location{display:block;margin:0;padding:0;font-family:var(--serif)'));
assert(css.includes('font-size:2rem;font-style:italic;font-weight:700;'));
assert(css.includes('width:var(--crop-width)'));
assert(css.includes('height:var(--crop-height)'));
assert(!/\brotate\(|\bskew\(|\bperspective\(/.test(css));
assert(!css.includes('animation-play-state'));
assert(!/animation\s*:\s*none/.test(css));
assert(!/showModal|partner-dialog|addEventListener|partners-paused|partner-gallery-data/.test(script));
assert(!/partner-dialog|partner-work-open|partner-gallery-data|Призупинити рух/.test(html));
for(const figure of figures){
  assert(!/<a\b|<button\b|\btabindex=|\bonclick=/.test(figure),'Logo must not be interactive');
  assert(figure.includes('draggable="false"'));
}
let bytes=0;
let smallBytes=0;
for(const partner of partners){
  assert(partner.name && partner.location);
  const crop=partnerLogoCrops[partner.id];
  const src=`assets/partners/work-${crop.number}.webp`;
  const asset=partnerRetouchAssets[partner.id];
  assert(asset);
  assert(html.includes(`src="${asset.src}"`));
  assert(html.includes(`srcset="${asset.small} 400w, ${asset.src} 800w"`));
  assert(!html.includes(`src="${src}"`),'Do not mix old and relit versions');
  assert(!html.includes('assets/partners/logos/'));
  const metadata=await sharp(src).metadata();
  assert.equal(metadata.format,'webp');
  assert.equal(metadata.width,crop.width);
  assert.equal(metadata.height,crop.height);
  assert(crop.left>=0 && crop.top>=0 && crop.size>0);
  assert(crop.left+crop.size<=crop.width && crop.top+crop.size<=crop.height);
  assert(crop.light>=1 && crop.light<=1.2);
  assert(crop.contrast>1 && crop.contrast<=1.16);
  assert(crop.saturation>1 && crop.saturation<=1.30);
  // One uniform scale preserves the source aspect ratio; only the viewport is square.
  assert(Math.abs((crop.width/crop.size)/(crop.height/crop.size)-crop.width/crop.height)<1e-10);
  const window=asset.window;
  assert(window.left>=0 && window.top>=0 && window.size>=.5 && window.size<=1);
  assert(window.left+window.size<=1 && window.top+window.size<=1);
  const master=await sharp(asset.source).metadata();
  assert.equal(master.width,master.height);
  assert(master.width>=800);
  for(const [file,width] of [[asset.src,800],[asset.small,400]]){
    const meta=await sharp(file).metadata();
    assert.equal(meta.format,'webp');
    assert.equal(meta.width,width);
    assert.equal(meta.height,width);
  }
  bytes+=(await fs.stat(asset.src)).size;
  smallBytes+=(await fs.stat(asset.small)).size;
}
assert(bytes<4_000_000,'Oversized high-DPI gallery');
assert(smallBytes<1_500_000,'Oversized mobile gallery');
class Element {
  constructor(){this.children=[];this.attrs={};this.classes=new Set();this.classList={add:c=>this.classes.add(c)};}
  setAttribute(key,value){this.attrs[key]=value;}
  hasAttribute(key){return key in this.attrs;}
  append(element){element.parent=this;this.children.push(element);}
  get firstElementChild(){return this.children[0];}
  get lastElementChild(){return this.children.at(-1);}
  get scrollWidth(){return this.children.length*244;}
  remove(){this.parent.children=this.parent.children.filter(item=>item!==this);}
  cloneNode(){const copy=new Element();copy.attrs={...this.attrs};for(const child of this.children)copy.append(child.cloneNode(true));return copy;}
  querySelector(selector){return this.selectors?.[selector];}
}
const section=new Element();
const strips=[0,1].map(()=>{const strip=new Element(),track=new Element(),group=new Element();strip.clientWidth=1440;for(let i=0;i<8;i++)group.append(new Element());track.append(group);strip.selectors={'.partner-track':track};return strip;});
section.querySelectorAll=()=>strips;
let resizeCallback;
vm.runInNewContext(script,{document:{querySelector:()=>section},ResizeObserver:class{constructor(callback){resizeCallback=callback;}observe(){}}});
for(const strip of strips){
  const track=strip.selectors['.partner-track'];
  assert.equal(track.children.length,2);
  assert.equal(track.firstElementChild.children.length,track.lastElementChild.children.length);
  assert.equal(track.lastElementChild.attrs['aria-hidden'],'true');
  assert(strip.classes.has('is-ready'));
}
strips[0].clientWidth=7680;
resizeCallback();
const track=strips[0].selectors['.partner-track'];
assert(track.firstElementChild.scrollWidth>=7680);
assert.equal(track.firstElementChild.children.length,track.lastElementChild.children.length);
assert.equal(track.children.length,2);
resizeCallback();
assert.equal(track.children.length,2);
console.log(`Partner checks passed: ${partners.length} non-interactive relit details, ${(bytes/1024).toFixed(0)} KB at 800px / ${(smallBytes/1024).toFixed(0)} KB at 400px, valid viewing windows, originals retained, seamless two-way tracks. Browser rendering not tested.`);

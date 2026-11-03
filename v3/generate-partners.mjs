import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {partners, sourcePhotos} from './partner-data.mjs';
import {partnerRetouchAssets} from './partner-retouch-assets.mjs';
import {displayLocations,captionLayout,partnerRowIds,premierDisplayName} from './partner-caption-layout.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'assets/partners');
await fs.mkdir(path.join(output,'originals'), {recursive:true});
// Mechanical encoding only: no generative alteration of client logos or textile.
for (const photo of sourcePhotos) {
  const original = path.join(output, 'originals', `${photo.number}-${photo.file}`);
  try {await fs.access(original);} catch {await fs.copyFile(photo.path, original);}
  for (const [suffix, size, quality] of [['-small',880,83],['',1800,90]]) {
    const target = path.join(output, `work-${photo.number}${suffix}.webp`);
    try {await fs.access(target);} catch {
      await sharp(original).rotate().resize({width:size,height:size,fit:'inside',withoutEnlargement:true}).webp({quality,effort:5}).toFile(target);
    }
  }
}
const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
// Fail explicitly rather than silently publishing missing or mixed revision assets.
for(const asset of Object.values(partnerRetouchAssets)) {
  await fs.access(path.join(root,asset.src));
  await fs.access(path.join(root,asset.small));
}
const locationLabel = partner => displayLocations[partner.id] || partner.location;
const card = partner => {
  const asset=partnerRetouchAssets[partner.id];
  const window=asset.window;
  const detailStyle=`--detail-size:${(100/window.size).toFixed(5)}%;--detail-left:${(-window.left/window.size*100).toFixed(5)}%;--detail-top:${(-window.top/window.size*100).toFixed(5)}%`;
  const sizes=window.size<1?`(max-width: 760px) ${Math.ceil(340/window.size)}px, ${Math.ceil(380/window.size)}px`:'(max-width: 760px) 340px, (min-width: 1520px) 380px, (min-width: 1360px) 25vw, 340px';
  const layout=captionLayout[partner.id];
  const captionClass=`partner-work-caption partner-work-caption-${layout.corner}${layout.tone==='light'?' partner-work-caption-light':''}${layout.size?` partner-work-caption-${layout.size}`:''}`;
  return `            <figure class="partner-work" data-partner="${partner.id}">
              <div class="partner-work-photo partner-work-photo-relit" style="${detailStyle}"><img src="${asset.src}" srcset="${asset.small} 400w, ${asset.src} 800w" sizes="${sizes}" alt="${escape(partner.name)} — логотип і фактура текстилю" width="${asset.width}" height="${asset.height}" loading="eager" decoding="async" draggable="false"></div>
              <figcaption class="${captionClass}">${partner.id==='premier'?`<strong>${escape(premierDisplayName)}</strong>`:''}<span class="partner-work-location">${escape(locationLabel(partner))}</span></figcaption>
            </figure>`;
};
const byId=new Map(partners.map(partner=>[partner.id,partner]));
const rows=partnerRowIds.map(row=>row.map(id=>byId.get(id)));
if(rows.flat().length!==partners.length || new Set(rows.flat()).size!==partners.length || rows.flat().some(partner=>!partner)) throw new Error('Partner row layout must include every partner exactly once');
const markup = `    <section class="partners partners-portfolio" id="partners" aria-labelledby="partners-title">
      <div class="container">
        <div class="partners-head">
          <div><div class="eyebrow">SAFFRAN · Наші партнери</div><h2 id="partners-title">Наш текстиль.<br><em>Ваша гостинність.</em></h2></div>
          <div class="partners-intro"><p class="partners-lead">Рушники, халати й білизна, які стають частиною щоденного сервісу.</p><p class="partners-copy">Фактура, пошиття, фірмові деталі. Готові вироби SAFFRAN для просторів, у яких дбають про кожен дотик.</p><p class="partner-context">Готелі · Курорти · SPA &amp; wellness</p></div>
        </div>
      </div>
      <div class="partner-strips" aria-label="Логотипи клієнтів на текстилі SAFFRAN">
${rows.map((row,index)=>`        <div class="partner-strip${index?' partner-strip-reverse':''}" aria-label="Роботи SAFFRAN, ряд ${index+1}">
          <div class="partner-track">
            <div class="partner-track-group">
${row.map(card).join('\n')}
            </div>
          </div>
        </div>`).join('\n')}
      </div>
    </section>`;
const indexPath=path.join(root,'index.html');
let html=await fs.readFile(indexPath,'utf8');
html=html.replace(/    <section class="partners\b[\s\S]*?<\/section>/,markup);
if(!/href="partners\.css(?:\?[^\"]*)?"/.test(html)) html=html.replace('<link rel="stylesheet" href="v2-home.css">','<link rel="stylesheet" href="v2-home.css">\n  <link rel="stylesheet" href="partners.css">');
if(!html.includes('src="partners.js"')) html=html.replace('<script src="cart.js" defer></script>','<script src="cart.js" defer></script>\n  <script src="partners.js" defer></script>');
await fs.writeFile(indexPath,html);
console.log(`Partners: ${partners.length} individually relit textile details, responsive 400/800px assets, no lightbox; all ${sourcePhotos.length} originals retained.`);

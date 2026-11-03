import {chromium} from 'playwright';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const output=path.resolve('qa-shots');
fs.mkdirSync(output,{recursive:true});
const file=name=>pathToFileURL(path.resolve(name)).href;
const errors=[];
for(const viewport of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
  const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
  for(const name of ['index','about','hotel-textile','spa-textile','product-bed-linen','product-towels','product-robes','cart']){
    await page.goto(file(`${name}.html`));
    await page.waitForTimeout(100);
    await page.evaluate(()=>document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible')));
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))errors.push(`${name}/${viewport.name}: horizontal overflow`);
    if(['index','about','hotel-textile','spa-textile','product-towels','product-robes'].includes(name)){
      await page.screenshot({path:path.join(output,`${name}-${viewport.name}.png`),fullPage:true});
    }
  }
  await page.close();
}
const page=await browser.newPage({viewport:{width:1280,height:800}});
await page.goto(file('product-towels.html'));
const colors=page.locator('.js-color');
if(await colors.count()!==1)errors.push('towels: color selector missing');
else{
  await colors.selectOption('Графіт');
  const src=await page.locator('.tier-card-extended .tier-photo img').first().getAttribute('src');
  if(!src?.includes('towel-colors-preview'))errors.push('towels: preview not changing');
  await page.locator('.tier-card-extended .js-add-to-cart').first().click();
  await page.locator('.tier-card-extended .js-add-to-cart').first().click();
  await page.goto(file('cart.html'));
  const row=page.locator('.cart-line');
  if(await row.count()!==1)errors.push('cart: identical configured towels did not stack');
  if(await row.locator('input[data-quantity]').inputValue()!=='2')errors.push('cart: stacked quantity is not 2');
  if(!(await row.innerText()).includes('Графіт'))errors.push('cart: selected color missing');
  if(!(await row.locator('img').getAttribute('src'))?.includes('towel-colors-preview'))errors.push('cart: selected preview missing');
}
await page.goto(file('product-bed-linen.html'));
await page.locator('.linen-group:not([hidden]) .tier-card').nth(1).locator('.js-fabric').selectOption('Сатин-страйп 250 TC');
if(!(await page.locator('.linen-group:not([hidden]) .tier-card').nth(1).locator('.js-spec').allTextContents()).length)errors.push('linen: sizes did not update');
await browser.close();
console.log(errors.length?errors.join('\n'):'Visual dimensions and cart interactions passed.');
process.exitCode=errors.length?1:0;

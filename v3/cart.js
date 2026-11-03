(() => {
  const KEY = 'saffran-quote-cart-v3';
  const NAME_PREFIX = 'saffran-cart-v3:';
  const clean = value => typeof value === 'string' ? value.slice(0, 220) : '';
  const normalize = value => {
    if (!Array.isArray(value)) return [];
    const merged = new Map();
    for (const item of value) {
      if (!item || typeof item.id !== 'string') continue;
      const entry = {
        id: clean(item.id), name: clean(item.name), category: clean(item.category), tier: clean(item.tier), image: clean(item.image), spec: clean(item.spec), fabric: clean(item.fabric), embroidery: clean(item.embroidery), hood: clean(item.hood), color: clean(item.color), preview: clean(item.preview), previewIndex: Math.max(0,Number.parseInt(item.previewIndex,10)||0), previewCount: Math.max(1,Number.parseInt(item.previewCount,10)||1),
        quantity: Math.max(1, Math.min(100000, Number.parseInt(item.quantity, 10) || 1))
      };
      if (!entry.id || !entry.name) continue;
      const previous=merged.get(entry.id);
      if (previous) previous.quantity=Math.min(100000,previous.quantity+entry.quantity);
      else merged.set(entry.id,entry);
      if (merged.size>=100) break;
    }
    return [...merged.values()];
  };
  const read = () => {
    try {
      if (window.name.startsWith(NAME_PREFIX)) return normalize(JSON.parse(window.name.slice(NAME_PREFIX.length)));
    } catch (_) {}
    try {
      const selection = new URLSearchParams(location.search).get('selection');
      if (selection) return normalize(JSON.parse(selection));
    } catch (_) {}
    try {
      const fromStorage = localStorage.getItem(KEY);
      if (fromStorage) return normalize(JSON.parse(fromStorage));
    } catch (_) {}
    return [];
  };
  let cart = read();
  window.SaffranCart = {getItems: () => cart.map(item => ({...item}))};
  const save = () => {
    const serialized = JSON.stringify(cart);
    try { localStorage.setItem(KEY, serialized); } catch (_) {}
    window.name = NAME_PREFIX + serialized;
    updateBadges();
  };
  const mobileNav=document.querySelector('.nav-wrap');
  if(mobileNav){
    const shortcut=document.createElement('a');shortcut.className='mobile-cart-link';shortcut.href='cart.html';shortcut.setAttribute('aria-label','Відкрити кошик');shortcut.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2l2.2 11h11.3l2.2-8H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg><span class="mobile-cart-count"></span>';
    mobileNav.append(shortcut);
  }
  const updateBadges = () => {
    document.querySelectorAll('.cart-count').forEach(el => { el.textContent = String(cart.length); });
    document.querySelectorAll('.mobile-cart-link').forEach(el=>{el.classList.toggle('has-items',cart.length>0);el.querySelector('.mobile-cart-count').textContent=String(cart.length)});
  };
  const toast = message => {
    let el = document.querySelector('.cart-toast');
    if (!el) {
      el = document.createElement('div'); el.className = 'cart-toast'; el.setAttribute('role', 'status');
      const text = document.createElement('span'); text.className = 'cart-toast-text'; el.append(text);
      const link = document.createElement('a'); link.href = 'cart.html'; link.textContent = 'До кошика'; el.append(link);
      document.body.append(el);
    }
    el.querySelector('.cart-toast-text').textContent = message;
    el.classList.add('is-visible');
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => el.classList.remove('is-visible'), 4000);
  };
  const add = button => {
    const {id,name,category,tier,image} = button.dataset;
    if (!id || !name) return;
    const card=button.closest('.tier-card');
    const spec=card?.querySelector('.js-spec')?.value||'Параметри за запитом';
    const fabric=card?.querySelector('.js-fabric')?.value||'';
    const embroidery=card?.querySelector('.js-embroidery')?.checked?'Вишивка логотипа':'Без вишивки';
    const hood=card?.querySelector('.js-hood')?(card.querySelector('.js-hood').checked?'З капюшоном':'Без капюшона'):'';
    const quantity=Math.max(1,Math.min(100000,Number.parseInt(card?.querySelector('.js-quantity')?.value,10)||1));
    const colorSelect=card?.querySelector('.js-color');
    const color=colorSelect?.value||'Білий';
    const preview=colorSelect?.dataset.preview||'';
    const previewIndex=Number(colorSelect?.selectedOptions[0]?.dataset.index)||0;
    const previewCount=Number(colorSelect?.dataset.count)||1;
    const configuredId=[id,fabric,spec,color,embroidery,hood].join('|');
    const current = cart.find(item => item.id === configuredId);
    if (current) current.quantity = Math.min(100000,current.quantity+quantity);
    else cart.push({id:configuredId,name,category,tier,image,spec,fabric,color,embroidery,hood,preview,previewIndex,previewCount,quantity});
    save(); toast(`${name} · ${spec} · ${color} · ${quantity} шт. додано до запиту.`);
    const before = button.textContent;
    button.textContent = 'Додано';
    setTimeout(() => { button.textContent = before; }, 1500);
  };
  document.addEventListener('click', event => {
    const button = event.target.closest('.js-add-to-cart');
    if (button) add(button);
  });
  document.addEventListener('click', event => {
    if (location.protocol !== 'file:' || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.getAttribute('href').startsWith('#') || link.hasAttribute('download')) return;
    try {
      const url = new URL(link.href);
      if (url.protocol !== 'file:' || !url.pathname.endsWith('.html')) return;
      url.searchParams.set('selection', JSON.stringify(cart));
      link.href = url.href;
    } catch (_) {}
  }, true);
  updateBadges();

  const lines = document.querySelector('#cart-lines');
  if (!lines) return;
  const summary = document.querySelector('#cart-summary');
  const form = document.querySelector('#quote-form');
  const status = document.querySelector('#quote-status');
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  };
  const render = () => {
    lines.replaceChildren();
    if (!cart.length) {
      const empty = make('div','cart-empty');
      empty.append(make('h2','', 'Ваш кошик поки порожній'), make('p','', 'Оберіть товари для вашого об’єкта. Тут можна буде змінити кількість і сформувати запит на комерційну пропозицію.'));
      const link = make('a','btn btn-gold','Перейти до продукції'); link.href = 'products.html'; empty.append(link); lines.append(empty);
      form.querySelector('button[type="submit"]').disabled = true;
    } else {
      form.querySelector('button[type="submit"]').disabled = false;
      for (const item of cart) {
        const row = make('article','cart-line');
        const thumb=make('div','cart-thumb');
        const img = make('img'); img.src = item.preview||item.image; img.alt = `${item.name} · ${item.color||'Білий'}`; img.loading = 'lazy';
        if(item.preview){img.style.width=`${item.previewCount*100}%`;img.style.height='auto';img.style.maxWidth='none';img.style.position='absolute';img.style.top='50%';img.style.left='0';img.style.transform=`translate(-${item.previewIndex*100/item.previewCount}%,-50%)`;}
        thumb.append(img); row.append(thumb);
        const info = make('div','cart-line-info');
        info.append(make('small','',`${item.category} · ${item.tier}`),make('h2','',item.name),make('p','cart-line-spec',`${item.fabric?item.fabric+' · ':''}${item.spec||'Розмір уточнити'} · колір: ${item.color||'Білий'} · ${item.embroidery||'Без вишивки'}${item.hood?' · '+item.hood:''}`));
        const remove = make('button','remove-line','Прибрати'); remove.type = 'button'; remove.dataset.remove = item.id; info.append(remove); row.append(info);
        const qty = make('div','cart-qty');
        const label = make('label','', 'Кількість'); const input = make('input'); input.type = 'number'; input.min = '1'; input.max = '100000'; input.step = '1'; input.value = String(item.quantity); input.dataset.quantity = item.id; input.setAttribute('aria-label',`Кількість: ${item.name}`);
        qty.append(label,input); row.append(qty); lines.append(row);
      }
    }
    summary.textContent = cart.length ? `${cart.length} позицій · ${cart.reduce((sum,item)=>sum+item.quantity,0)} одиниць у запиті` : '0 позицій у запиті';
    updateBadges();
  };
  lines.addEventListener('click', event => {
    const button = event.target.closest('[data-remove]');
    if (!button) return;
    cart = cart.filter(item => item.id !== button.dataset.remove); save(); render();
  });
  lines.addEventListener('change', event => {
    const input = event.target.closest('[data-quantity]');
    if (!input) return;
    const item = cart.find(product => product.id === input.dataset.quantity);
    if (!item) return;
    item.quantity = Math.max(1, Math.min(100000, Number.parseInt(input.value,10) || 1));
    input.value = String(item.quantity); save(); render();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!cart.length || !form.reportValidity()) return;
    const data = new FormData(form);
    status.hidden = false;
    const files=[...form.querySelector('input[type="file"]').files];
    if(files.length>5||files.some(file=>file.size>10*1024*1024)){status.textContent='Можна додати до 5 файлів, кожен до 10 МБ.';return}
    if(location.protocol==='file:'||['localhost','127.0.0.1'].includes(location.hostname)){status.textContent='Форма готова до надсилання після підключення сайту до WordPress. Зараз відкрито локальну копію.';return}
    data.set('action','saffran_quote');
    cart.forEach(item=>data.append('product[]',`${item.name} · ${item.tier}${item.fabric?' · '+item.fabric:''} · ${item.spec} · ${item.color} · ${item.embroidery}${item.hood?' · '+item.hood:''} · ${item.quantity} шт.`));
    const button=form.querySelector('button[type="submit"]');button.disabled=true;status.textContent='Надсилаємо запит…';
    try{const response=await fetch('/wp-admin/admin-post.php',{method:'POST',body:data,credentials:'same-origin'});const result=await response.json();if(!response.ok||!result.success)throw new Error(result?.data?.message||'Не вдалося надіслати запит.');status.textContent='Запит надіслано. Ми зв’яжемося з вами найближчим часом.';form.reset();cart=[];save();render()}catch(error){status.textContent=error.message||'Не вдалося надіслати запит. Спробуйте ще раз.'}finally{button.disabled=!cart.length}
  });
  render();
})();

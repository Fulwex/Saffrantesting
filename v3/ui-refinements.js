(() => {
  const thumbnails = {
    'product-towels':'assets/catalog-pool-towels.webp',
    'product-bath-mats':'assets/catalog-bath-mat.webp',
    'product-bed-linen':'assets/catalog-hotel-bed-selected.webp',
    'product-robes':'assets/catalog-robes-family.webp',
    'product-mattress-protectors':'assets/mattress-protector.webp',
    'product-pillows':'assets/products/3G3A0614.webp',
    'product-duvets':'assets/quilt.jpg',
    'product-slippers':'assets/slippers.jpg',
    'product-table-textiles':'assets/products/DSC07945.webp'
  };
  const labels = {
    'product-towels':'Рушники','product-bath-mats':'Килимки','product-bed-linen':'Постільна білизна',
    'product-robes':'Халати','product-mattress-protectors':'Наматрацники й топери',
    'product-pillows':'Подушки','product-duvets':'Ковдри','product-slippers':'Готельні капці',
    'product-table-textiles':'Столовий текстиль'
  };
  const menuMarkup = `<summary>Продукція</summary><div class="product-menu-panel"><a href="products.html"><strong>Весь каталог</strong></a>${Object.entries(labels).map(([slug,label])=>`<a href="${slug}.html">${label}</a>`).join('')}</div>`;
  const socialMarkup = `<a href="https://www.instagram.com/saffran_textile/" target="_blank" rel="noopener noreferrer" aria-label="SAFFRAN в Instagram"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg><span>Instagram</span></a><a href="https://www.facebook.com/SaffranUkraine/" target="_blank" rel="noopener noreferrer" aria-label="SAFFRAN у Facebook"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7a23 23 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3v2H8.3V13h2.8v8z" fill="currentColor"/></svg><span>Facebook</span></a>`;
  document.querySelectorAll('.nav-links').forEach(nav => {
    if (!nav.querySelector('.product-menu')) {
      const direct = [...nav.children].find(el => el.tagName === 'A' && /(?:^|\/)products(?:\.html)?$/.test(new URL(el.href, location.href).pathname));
      if (direct) {
        const menu = document.createElement('details');
        menu.className = 'product-menu';
        menu.innerHTML = menuMarkup;
        direct.replaceWith(menu);
      }
    }
    if (![...nav.children].some(el=>el.textContent.trim()==='Контакти')) {
      const contacts = document.createElement('a');
      contacts.href = 'index.html#footer-contacts';
      contacts.textContent = 'Контакти';
      nav.append(contacts);
    }
    [...nav.children].forEach(el => {
      const text = el.textContent.trim();
      const path = el.tagName === 'A' ? new URL(el.href,location.href).pathname : '';
      const kind = el.classList.contains('product-menu') ? 'products'
        : /about(?:\.html)?$/.test(path) ? 'about'
        : /hotel-textile(?:\.html)?$/.test(path) ? 'hotel'
        : /spa-textile(?:\.html)?$/.test(path) ? 'spa'
        : /cart(?:\.html)?$/.test(path) ? 'cart'
        : text === 'Контакти' ? 'contacts' : 'extra';
      el.classList.add('nav-'+kind);
      if (kind === 'extra' && text === 'Отримати пропозицію') el.remove();
    });
    if (!nav.querySelector('.nav-social')) {
      const social = document.createElement('div');
      social.className = 'nav-social';
      social.setAttribute('aria-label', 'Соціальні мережі SAFFRAN');
      social.innerHTML = socialMarkup;
      nav.append(social);
    }
  });
  document.querySelectorAll('footer .container').forEach(container => {
    if (container.querySelector('.footer-social')) return;
    const social = document.createElement('div');
    social.className = 'footer-social';
    social.setAttribute('aria-label', 'Соціальні мережі SAFFRAN');
    social.innerHTML = `<span>SAFFRAN У МЕРЕЖІ</span><div>${socialMarkup}</div>`;
    const bottom = container.querySelector('.footer-bottom');
    if (bottom) bottom.before(social); else container.append(social);
  });
  document.querySelectorAll('.product-menu-panel a').forEach(link => {
    const path = new URL(link.href, location.href).pathname.split('/').pop().replace(/\.html$/, '');
    const src = thumbnails[path];
    if (!src || link.querySelector('img')) return;
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    link.prepend(img);
  });
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) video.play().catch(()=>{});
      else video.pause();
    }), {rootMargin:'120px 0px', threshold:.1});
    document.querySelectorAll('video[data-play-on-view]').forEach(video => observer.observe(video));
  }
  document.querySelectorAll('.suggestion-window').forEach(windowEl => {
    const track = windowEl.querySelector('.suggestion-track');
    const first = track?.querySelector('.suggestion-group');
    if (!track || !first) return;
    let second = track.querySelector('.suggestion-group:nth-child(2)');
    if (!second) {
      second = first.cloneNode(true);
      second.setAttribute('aria-hidden', 'true');
      second.querySelectorAll('a').forEach(link => link.tabIndex = -1);
      track.append(second);
    }
    second.style.setProperty('display', 'flex', 'important');
    let offset = 0, pointer = null, lastX = 0, moved = false, previous = 0;
    windowEl.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointer = event.pointerId;
      lastX = event.clientX;
      moved = false;
      windowEl.setPointerCapture(event.pointerId);
    });
    windowEl.addEventListener('pointermove', event => {
      if (pointer !== event.pointerId) return;
      const dx = event.clientX - lastX;
      offset += dx;
      if (Math.abs(dx) > 2) moved = true;
      lastX = event.clientX;
    });
    const release = event => { if (pointer === event.pointerId) {pointer = null; setTimeout(() => {moved = false;}, 0);} };
    windowEl.addEventListener('pointerup', release);
    windowEl.addEventListener('pointercancel', release);
    windowEl.addEventListener('click', event => {
      if (!moved) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      moved = false;
    }, true);
    function frame(now) {
      const elapsed = previous ? Math.min((now - previous) / 1000, .05) : 0;
      previous = now;
      const width = first.getBoundingClientRect().width;
      if (width) {
        if (pointer === null) offset -= width / 57.6 * elapsed;
        offset = ((offset % width) - width) % width;
        track.style.transform = `translate3d(${offset}px,0,0)`;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
})();

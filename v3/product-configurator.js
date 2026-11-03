(() => {
  const updateColorPreview=select=>{
    const card=select.closest('.tier-card');
    const img=card?.querySelector('.tier-photo img');
    if(!img)return;
    const count=Number(select.dataset.count)||1;
    const index=Number(select.selectedOptions[0]?.dataset.index)||0;
    const swatch=card.querySelector('.color-swatch');
    if(swatch)swatch.style.background=select.selectedOptions[0]?.dataset.swatch||'#ddd';
    img.src=select.dataset.preview;
    img.style.width=`${count*100}%`;
    img.style.height='auto';
    img.style.maxWidth='none';
    img.style.position='absolute';
    img.style.inset='auto';
    img.style.zIndex='0';
    img.style.left='0';
    img.style.top='50%';
    img.style.transform=`translate(-${index*100/count}%,-50%)`;
    img.alt=`${card.querySelector('h3')?.textContent||'Виріб'} — колір ${select.value}`;
  };
  document.querySelectorAll('.js-color').forEach(select=>{
    updateColorPreview(select);
    select.addEventListener('change',()=>updateColorPreview(select));
  });
  document.querySelectorAll('.js-fabric').forEach(select=>{
    select.addEventListener('change',()=>{
      const sizes=(select.selectedOptions[0]?.dataset.sizes||'').split('|').filter(Boolean);
      const spec=select.closest('.tier-card')?.querySelector('.js-spec');
      if(!spec)return;
      spec.replaceChildren(...[...sizes,'Індивідуальний розмір'].map(size=>new Option(size,size)));
    });
  });
  document.querySelectorAll('.js-quantity').forEach(input=>{
    const clamp=()=>{input.value=String(Math.max(1,Math.min(100000,Number.parseInt(input.value,10)||1)));};
    input.addEventListener('change',clamp);
    input.closest('.config-quantity')?.querySelectorAll('.js-quantity-step').forEach(button=>{
      const step=()=>{
        input.value=String(Math.max(1,Math.min(100000,(Number.parseInt(input.value,10)||1)+Number(button.dataset.step))));
        input.dispatchEvent(new Event('input',{bubbles:true}));
      };
      let delay, repeat;
      const stop=()=>{clearTimeout(delay);clearInterval(repeat);delay=repeat=undefined;};
      button.addEventListener('pointerdown',event=>{
        if(event.pointerType==='mouse'&&event.button!==0)return;
        event.preventDefault();
        button.setPointerCapture?.(event.pointerId);
        step();
        delay=setTimeout(()=>{repeat=setInterval(step,90);},350);
      });
      button.addEventListener('pointerup',stop);
      button.addEventListener('pointercancel',stop);
      button.addEventListener('lostpointercapture',stop);
      button.addEventListener('click',event=>{if(event.detail===0)step();});
    });
  });
  const tabs=[...document.querySelectorAll('[data-linen-tab]')];
  if (!tabs.length) return;
  const activate=tab=>{
    tabs.forEach(button=>{
      const active=button===tab;
      button.setAttribute('aria-selected',String(active));
      const panel=document.querySelector('#linen-'+button.dataset.linenTab);
      if(panel) panel.hidden=!active;
    });
  };
  tabs.forEach((button,index)=>{
    button.addEventListener('click',()=>activate(button));
    button.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
      event.preventDefault();
      const next=tabs[(index+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length];
      activate(next);next.focus();
    });
  });
})();

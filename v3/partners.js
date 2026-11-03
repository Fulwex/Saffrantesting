(() => {
  const section = document.querySelector('.partners-portfolio');
  if (!section) return;
  const strips = [...section.querySelectorAll('.partner-strip')];
  function fillTrack(strip) {
    const track = strip.querySelector('.partner-track');
    const group = track.firstElementChild;
    const originals = [...group.children].filter(card=>!card.hasAttribute('data-partner-fill'));
    let filled = false;
    while(group.scrollWidth < strip.clientWidth && originals.length) {
      originals.forEach(card=>{
        const extra=card.cloneNode(true);
        extra.setAttribute('data-partner-fill','');
        extra.setAttribute('aria-hidden','true');
        group.append(extra);
      });
      filled = true;
    }
    if(track.children.length>1 && !filled) return;
    if(track.children.length>1) track.lastElementChild.remove();
    const duplicate=group.cloneNode(true);
    duplicate.setAttribute('aria-hidden','true');
    track.append(duplicate);
    strip.classList.add('is-ready');
  }
  strips.forEach(fillTrack);
  const states=strips.map((strip,index)=>({strip,track:strip.querySelector('.partner-track'),group:strip.querySelector('.partner-track-group'),index,offset:0,pointer:null,lastX:0}));
  states.forEach(state=>{
    const width=state.group.getBoundingClientRect().width;
    if(state.index)state.offset=-width;
    state.strip.addEventListener('pointerdown',event=>{
      if(event.pointerType==='mouse'&&event.button!==0)return;
      state.pointer=event.pointerId;
      state.slideStart=0;
      state.lastX=event.clientX;
      state.strip.setPointerCapture(event.pointerId);
    });
    state.strip.addEventListener('pointermove',event=>{
      if(state.pointer!==event.pointerId)return;
      state.offset+=event.clientX-state.lastX;
      state.lastX=event.clientX;
    });
    const release=event=>{if(state.pointer===event.pointerId)state.pointer=null;};
    state.strip.addEventListener('pointerup',release);
    state.strip.addEventListener('pointercancel',release);
  });
  const carousel=section.querySelector('.partner-carousel');
  carousel?.querySelectorAll('.partner-arrow').forEach(button=>{
    button.addEventListener('click',()=>{
      const state=states[0];
      if(!state)return;
      const card=state.group.querySelector('.partner-work');
      const next=card?.nextElementSibling;
      const step=next ? next.offsetLeft-card.offsetLeft : card?.getBoundingClientRect().width || 0;
      state.slideFrom=state.offset;
      state.slideBy=(button.classList.contains('partner-arrow-next')?-step:step);
      state.slideStart=performance.now();
    });
  });
  let previous=0;
  function frame(now){
    const elapsed=previous?Math.min((now-previous)/1000,.05):0;
    previous=now;
    states.forEach(state=>{
      const width=state.group.getBoundingClientRect().width;
      if(!width)return;
      if(state.pointer===null){
        if(state.slideStart){
          const progress=Math.min((now-state.slideStart)/620,1);
          const eased=1-Math.pow(1-progress,3);
          state.offset=state.slideFrom+state.slideBy*eased;
          if(progress===1)state.slideStart=0;
        }else state.offset+=(state.index?1:-1)*width/(((state.index?148:136)/1.2)*1.7)*elapsed;
      }
      state.offset=((state.offset%width)-width)%width;
      state.track.style.transform=`translate3d(${state.offset}px,0,0)`;
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  if(typeof ResizeObserver==='function') {
    const resize=new ResizeObserver(()=>strips.forEach(fillTrack));
    strips.forEach(strip=>resize.observe(strip));
  }
})();

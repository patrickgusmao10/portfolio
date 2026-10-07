(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const assetRoot = new URL('.', document.currentScript.src);
  if (!reduce.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed'); observer.unobserve(entry.target);
    }), {threshold: .08});
    document.querySelectorAll('.section-heading,.project,.case-card,.skill-card,.game-card,.games-intro,.cinema-copy').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add('scroll-reveal');observer.observe(el);
    });
    reduce.addEventListener('change', () => {if(reduce.matches){document.querySelectorAll('.scroll-reveal').forEach(el=>el.classList.add('revealed'));observer.disconnect();}});
  }
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.project-cover').forEach(el => {
      let pending=0, x=0, y=0;
      function reset(){cancelAnimationFrame(pending);pending=0;el.style.transform='';}
      el.addEventListener('pointermove',event=>{
        if(reduce.matches)return;
        const rect=el.getBoundingClientRect();x=(event.clientX-rect.left)/rect.width-.5;y=(event.clientY-rect.top)/rect.height-.5;
        if(!pending)pending=requestAnimationFrame(()=>{el.style.transform=`perspective(1000px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`;pending=0;});
      });
      el.addEventListener('pointerleave',reset);el.addEventListener('pointercancel',reset);reduce.addEventListener('change',reset);
    });
  }
  const code=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let position=0, lastKey=0, active=null;
  document.addEventListener('keydown',event=>{
    if(event.target.closest('input,textarea,select,[contenteditable="true"]')||event.ctrlKey||event.metaKey||event.altKey||event.repeat)return;
    if(event.key==='Escape'){active?.();position=0;return;}
    if(Date.now()-lastKey>5000)position=0;lastKey=Date.now();
    const key=event.key.length===1?event.key.toLowerCase():event.key;
    position=key===code[position]?position+1:(key===code[0]?1:0);
    if(position===code.length){position=0;showSecret();}
  });
  function showSecret(){
    if(active)return;
    const panel=document.createElement('aside');panel.className='konami-guest';panel.setAttribute('aria-label','Ponte dos Juros');
    const canvas=document.createElement('canvas');canvas.width=192;canvas.height=192;canvas.setAttribute('aria-label','Ponte dos Juros character');
    const close=document.createElement('button');close.type='button';close.textContent='×';
    const labelClose=()=>close.setAttribute('aria-label',window.portfolioLanguage==='pt'?'Fechar animação':'Close animation');labelClose();
    document.addEventListener('languagechange',labelClose);
    panel.append(canvas,close);document.body.append(panel);
    const ctx=canvas.getContext('2d');let timer,cleanupTimer,finished=false;
    active=()=>{finished=true;clearTimeout(timer);clearTimeout(cleanupTimer);panel.remove();document.removeEventListener('languagechange',labelClose);active=null;};
    close.addEventListener('click',()=>active?.());
    const images={};
    Promise.all(['idle','attack'].map(name=>new Promise((resolve,reject)=>{const im=new Image();images[name]=im;im.onload=resolve;im.onerror=reject;im.src=new URL(`images/bridge/${name}.png`,assetRoot).href;}))).then(()=>{
      if(finished)return;const sequence=[];for(const [name,count] of [['idle',12],['attack',8],['idle',12]])for(let f=0;f<count;f++)sequence.push([name,f]);
      let frame=0;
      function draw(){if(finished)return;const [name,f]=sequence[frame];ctx.clearRect(0,0,192,192);ctx.imageSmoothingEnabled=false;ctx.drawImage(images[name],f*64,0,64,64,0,0,192,192);if(!reduce.matches&&!document.hidden){frame=(frame+1)%sequence.length;timer=setTimeout(draw,150);}}
      draw();cleanupTimer=setTimeout(()=>active?.(),6000);
    }).catch(()=>active?.());
  }
})();

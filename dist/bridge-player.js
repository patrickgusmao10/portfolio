(() => {
  const canvas = document.getElementById('bridge-player');
  const button = document.getElementById('bridge-animation-toggle');
  if (!canvas || !button) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches, visible = false, timer = null, index = 0;
  const sequence = [];
  for (const [name, count, duration] of [['idle',12,200],['walk',6,200],['walk',6,200],['attack',8,125],['idle',12,200]])
    for (let frame=0; frame<count; frame++) sequence.push({name,frame,duration});
  const images = {};
  let loaded = false;
  function label() {
    button.textContent = window.portfolioTranslate?.(paused ? 'Play animation' : 'Pause animation') || (paused ? 'Play animation' : 'Pause animation');
    button.setAttribute('aria-pressed',String(paused));
  }
  function draw() {
    const frame = sequence[index];
    context.clearRect(0,0,canvas.width,canvas.height);
    context.imageSmoothingEnabled = false;
    context.drawImage(images[frame.name],frame.frame*64,0,64,64,0,0,canvas.width,canvas.height);
  }
  function schedule() {
    clearTimeout(timer);
    if (!loaded || paused || !visible || document.hidden) return;
    timer = setTimeout(() => { index = (index+1)%sequence.length; draw(); schedule(); },sequence[index].duration);
  }
  button.addEventListener('click',() => { paused = !paused; label(); schedule(); });
  document.addEventListener('languagechange',label);
  document.addEventListener('visibilitychange',schedule);
  motion.addEventListener('change',event => { paused=event.matches; label(); schedule(); });
  new IntersectionObserver(entries => {visible=entries[0].isIntersecting;schedule();}).observe(canvas);
  Promise.all(['idle','walk','attack'].map(name => new Promise((resolve,reject) => {
    const image = new Image(); images[name]=image;
    image.onload=resolve; image.onerror=reject;
    image.src=new URL(`images/bridge/${name}.png`,document.baseURI).href;
  }))).then(() => {loaded=true;draw();schedule();}).catch(() => {button.hidden=true;});
  label();
})();

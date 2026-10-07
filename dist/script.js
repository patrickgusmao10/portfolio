const dialog = document.getElementById('terminal');
const input = document.getElementById('command');
const output = document.getElementById('terminal-output');
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('open-terminal').addEventListener('click', () => { dialog.showModal(); input.focus(); });
document.getElementById('close-terminal').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if(event.target === dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();} });
const messages = {help:'Commands: about, skills, projects, career, cinema, cinema-page, github, linkedin, play-asteroids, clear, exit',about:'Patrick Gonçalves Gusmão — Solutions & Implementation Analyst, BPMN specialist and Software Engineering student. 27 years old. Based in Joinville, Brazil.',skills:'BPMN · Process Modeling · Requirements · SQL · REST APIs · Workflows · Integrations · JavaScript · Flutter · Godot',cinema:'Explore my cinema journal using the cinema-page command.'};
const sections = {projects:'work',career:'journey'};
const links = {'cinema-page':['Cinema journal','./cinema/'],github:['GitHub','https://github.com/patrickgusmao10'],linkedin:['LinkedIn','https://www.linkedin.com/in/patrick-gusm%C3%A3o-55385b137/'],'play-asteroids':['Play Asteroids','https://patrickgusmao10.github.io/asteroids-godot/v3/']};
document.getElementById('terminal-form').addEventListener('submit', event => {
 event.preventDefault();const command=input.value.trim().toLowerCase();input.value='';if(!command)return;
 if(command==='exit'){dialog.close();return;}if(command==='clear'){output.replaceChildren();return;}
 const echo=document.createElement('p');echo.textContent='patrick:~$ '+command;output.append(echo);
 const reply=document.createElement('p');
 if(messages[command])reply.textContent=window.portfolioTranslate(messages[command]);
 else if(sections[command]){dialog.close();document.getElementById(sections[command]).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return;}
 else if(links[command]){const a=document.createElement('a');a.textContent=window.portfolioTranslate(links[command][0]);a.href=links[command][1];a.target='_blank';a.rel='noopener noreferrer';a.style.textDecoration='underline';reply.append(a);}
 else reply.textContent=window.portfolioTranslate('Unknown command. Type help for the available commands.');
 output.append(reply);output.scrollTop=output.scrollHeight;
});

// Content stays visible without JS, with reduced motion, and in unsupported browsers.
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;
function configureReveals() {
  revealObserver?.disconnect();
  document.querySelectorAll('.reveal-pending').forEach(element => {
    element.classList.remove('reveal-pending', 'is-visible');
  });
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  const targets = document.querySelectorAll('.stats > div, .section-heading, .project, .case-card, .about > div, .practice-grid article, .journey > div, .timeline li, .stack > *, .cinema > *, .contact > div');
  targets.forEach(element => {
    // Never hide content already visible or above the viewport after navigation.
    if (element.getBoundingClientRect().top < innerHeight) return;
    const siblings = Array.from(element.parentElement.children);
    element.style.setProperty('--reveal-delay', Math.min(siblings.indexOf(element), 2) * 90 + 'ms');
    element.classList.add('reveal-pending');
    revealObserver.observe(element);
  });
}
configureReveals();
motionPreference.addEventListener('change', configureReveals);

const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const fields = new FormData(contactForm);
  const name = fields.get('name').trim();
  const email = fields.get('email').trim();
  const subject = fields.get('subject').trim();
  const message = fields.get('message').trim();
  if (!name || !email || !subject || !message) return;
  const body = ` ${window.portfolioLanguage === 'pt' ? 'Nome' : 'Name'}: ${name}\r\nEmail: ${email}\r\n\r\n${message}`;
  window.location.href = `mailto:patrick.goncalves.gusmao@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const status = document.getElementById('contact-status');
  status.hidden = false;
  status.textContent = window.portfolioTranslate('Your email app will open. Review your message and send it there.');
});

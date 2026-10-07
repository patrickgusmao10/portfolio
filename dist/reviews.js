(async () => {
  const grid = document.getElementById('recent-reviews');
  const status = document.getElementById('reviews-sync-status');
  if (!grid || !status) return;
  let state = 'saved';
  const localImages = new Map([...grid.querySelectorAll('article')].map(card => [card.querySelector('a').href, card.querySelector('img').getAttribute('src')]));
  function updateLabels() {
    const pt = document.documentElement.lang === 'pt-BR';
    status.textContent = state === 'live'
      ? (pt ? 'Últimas críticas com comentários · Atualização automática (cache de até 30 min).' : 'Latest reviews with comments · Automatic updates (up to 30 min cache).')
      : (pt ? 'Críticas salvas · 6 de outubro de 2026. Atualização automática indisponível no momento.' : 'Saved reviews · October 6, 2026. Automatic update currently unavailable.');
    grid.querySelectorAll('.text-link').forEach(el => el.textContent = pt ? 'Ver no Letterboxd' : 'View on Letterboxd');
  }
  document.addEventListener('languagechange', updateLabels);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fletterboxd.com%2Fpatrickgusmao10%2Frss%2F', {signal: controller.signal});
    if (!response.ok) throw new Error('Feed unavailable');
    const feed = await response.json();
    if (feed.status !== 'ok' || !Array.isArray(feed.items)) throw new Error('Invalid feed');
    const reviews = feed.items.filter(item => String(item.guid).startsWith('letterboxd-review-')).map(item => {
      const url = new URL(item.link);
      if (url.protocol !== 'https:' || url.hostname !== 'letterboxd.com' || !url.pathname.startsWith('/patrickgusmao10/film/')) return null;
      const doc = new DOMParser().parseFromString(item.description || '', 'text/html');
      const comment = [...doc.querySelectorAll('p')].filter(p => !p.querySelector('img')).map(p => p.textContent.trim()).filter(Boolean).join('\n\n');
      if (!comment || /^Watched on /i.test(comment)) return null;
      const parsed = item.title.match(/^(.*), (\d{4})(?: - ([★½]+))?$/);
      if (!parsed) return null;
      let image = localImages.get(url.href);
      if (!image) {
        const source = doc.querySelector('img')?.getAttribute('src');
        if (!source) return null;
        const photo = new URL(source);
        if (photo.protocol !== 'https:' || photo.hostname !== 'a.ltrbxd.com') return null;
        image = photo.href;
      }
      return {url:url.href,title:parsed[1],year:parsed[2],rating:parsed[3] ? ([...parsed[3]].filter(c=>c==='★').length+(parsed[3].includes('½')?.5:0)) : null,comment,image,date:Date.parse(item.pubDate.replace(' ','T')+'Z')};
    }).filter(Boolean).sort((a,b)=>b.date-a.date).slice(0,3);
    if (!reviews.length) throw new Error('No reviews');
    const fragment = document.createDocumentFragment();
    for (const review of reviews) {
      const card = document.createElement('article'); card.className = 'film';
      const link = document.createElement('a'); link.href=review.url; link.target='_blank'; link.rel='noopener noreferrer';
      const image = document.createElement('img'); image.src=review.image; image.alt=review.title; image.width=1200; image.height=675; image.loading='lazy'; image.decoding='async';
      const body=document.createElement('div');body.className='film-body';
      const meta=document.createElement('span');meta.className='eyebrow';meta.textContent=review.year;
      if(review.rating!==null){const rating=document.createElement('span');rating.className='film-rating';rating.textContent=review.rating+' / 5';meta.append(rating);}
      const title=document.createElement('h3');title.textContent=review.title;
      const quote=document.createElement('blockquote');quote.lang='pt-BR';quote.textContent='“'+review.comment+'”';
      const label=document.createElement('span');label.className='text-link';
      body.append(meta,title,quote,label);link.append(image,body);card.append(link);fragment.append(card);
    }
    grid.replaceChildren(fragment);state='live';
  } catch { /* Preserve complete saved cards if the public feed is unavailable. */ }
  finally { clearTimeout(timeout); updateLabels(); }
})();

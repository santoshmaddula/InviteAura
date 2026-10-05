(function(){
  const root=document.querySelector('.invite');
  if(!root)return;
  const wedding=new Date('2026-11-21T21:56:00+05:30').getTime();
  const sections=[...document.querySelectorAll('.screen[data-section]')];
  const nav=[...document.querySelectorAll('.bottom-nav button')];
  const toast=document.getElementById('toast');
  function showToast(msg){toast.textContent=msg;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)}
  function go(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}
  document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
  nav.forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');nav.forEach(n=>n.classList.toggle('active',n.dataset.go===e.target.dataset.section))}}),{threshold:.35});
  sections.forEach(s=>observer.observe(s));
  function updateCountdown(){
    const diff=Math.max(0,wedding-Date.now());
    const d=Math.floor(diff/86400000),h=Math.floor(diff/3600000)%24,m=Math.floor(diff/60000)%60,s=Math.floor(diff/1000)%60;
    [['days',d],['hours',h],['minutes',m],['seconds',s]].forEach(([id,val])=>{const el=document.getElementById(id);if(el)el.textContent=String(val).padStart(2,'0')});
  }
  /* Gallery Slider */
  const gallerySlides = document.querySelectorAll('.gallery-slide');
  const galleryDots = document.querySelectorAll('.gallery-dots button');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');

  let galleryIndex = 0;

  function showGallerySlide(index) {
      if (!gallerySlides.length) return;

      galleryIndex =
          (index + gallerySlides.length) % gallerySlides.length;

      gallerySlides.forEach((slide, i) => {
          slide.classList.toggle('active', i === galleryIndex);
      });

      galleryDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === galleryIndex);
      });
  }

  galleryPrev?.addEventListener('click', () => {
      showGallerySlide(galleryIndex - 1);
  });

  galleryNext?.addEventListener('click', () => {
      showGallerySlide(galleryIndex + 1);
  });

  galleryDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
          showGallerySlide(index);
      });
  });
  let galleryTouchStartX = 0;
  let galleryTouchEndX = 0;

  const galleryTrack = document.querySelector('.gallery-track');

  galleryTrack?.addEventListener('touchstart', (e) => {
      galleryTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  galleryTrack?.addEventListener('touchend', (e) => {
      galleryTouchEndX = e.changedTouches[0].screenX;

      const swipeDistance =
          galleryTouchEndX - galleryTouchStartX;

      if (Math.abs(swipeDistance) < 50) return;

      if (swipeDistance < 0) {
          showGallerySlide(galleryIndex + 1);
      } else {
          showGallerySlide(galleryIndex - 1);
      }
  }, { passive: true });
//  setInterval(() => {
//      showGallerySlide(galleryIndex + 1);
//  }, 4000);
  updateCountdown();setInterval(updateCountdown,1000);
  function petals(){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const box=document.querySelector('.petals');for(let i=0;i<16;i++){const p=document.createElement('span');p.className='petal';p.style.left=(Math.random()*100)+'%';p.style.setProperty('--drift',(Math.random()*180-90)+'px');p.style.animationDuration=(6+Math.random()*7)+'s';p.style.animationDelay=(Math.random()*5)+'s';box.appendChild(p)}}petals();
  const shareData={title:'Atrivarada & Renuka — Wedding Invitation',text:'You are warmly invited to celebrate the wedding of Atrivarada & Renuka.',url:location.href};
  document.getElementById('shareBtn')?.addEventListener('click',async()=>{try{if(navigator.share){await navigator.share(shareData)}else{await navigator.clipboard.writeText(location.href);showToast('Invitation link copied')}}catch(e){}});
  document.getElementById('copyBtn')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);showToast('Invitation link copied')}catch(e){showToast(location.href)}});
  document.querySelectorAll('.gallery button').forEach(b=>b.addEventListener('click',()=>{document.getElementById('lightboxImg').src=b.querySelector('img').src;document.getElementById('lightbox').classList.add('open')}));
  document.getElementById('closeLightbox')?.addEventListener('click',()=>document.getElementById('lightbox').classList.remove('open'));
  document.getElementById('lightbox')?.addEventListener('click',e=>{if(e.target.id==='lightbox')e.currentTarget.classList.remove('open')});
  document.querySelectorAll('[data-rsvp]').forEach(b=>b.addEventListener('click',()=>{const text=encodeURIComponent('Wedding RSVP — Atrivarada & Renuka\n\nI would like to respond: '+b.dataset.rsvp+'\n\nInvitation: '+location.href);location.href='https://wa.me/?text='+text}));
  document.getElementById('calendarBtn')?.addEventListener('click',()=>{const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//InviteAura//Wedding//EN','BEGIN:VEVENT','DTSTART:20261121T212600','DTEND:20261121T232600','SUMMARY:Atrivarada & Renuka — Wedding / Muhurtham','LOCATION:Vijayawada','DESCRIPTION:Wedding invitation for Atrivarada & Renuka.','END:VEVENT','BEGIN:VEVENT','DTSTART:20261205T190000','DTEND:20261205T220000','SUMMARY:Atrivarada & Renuka — Reception','LOCATION:Vijayawada','DESCRIPTION:Wedding reception for Atrivarada & Renuka.','END:VEVENT','END:VCALENDAR'].join('\r\n');const blob=new Blob([ics],{type:'text/calendar'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Atrivarada-Renuka-Wedding.ics';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
  document.getElementById('directionsBtn')?.addEventListener('click',()=>{window.open('https://www.google.com/maps/search/?api=1&query=Vijayawada','_blank','noopener')});
  const musicBtn=document.getElementById('musicBtn');let audio=null;musicBtn?.addEventListener('click',()=>{if(!audio){showToast('Add your wedding music file to enable music');return}audio.paused?audio.play():audio.pause()});
})();


(function () {
  const root = document.querySelector('.invite');
  if (!root) return;

  document.body.classList.add('invitation-locked');

  const musicBtn = document.getElementById('musicBtn');

  const audio = new Audio('../../assets/wedding-song.mp3');
  audio.loop = true;
  audio.volume = 0.45;

  /* Opening animation */
  const opening = document.getElementById('opening');
  const openInvitation = document.getElementById('openInvitation');

  let invitationOpened = false;

  function openWeddingInvitation() {
    if (invitationOpened || !opening) return;

    invitationOpened = true;
    opening.classList.add('opening-closing');
    document.body.classList.remove('invitation-locked');

    audio.play().catch(() => {});
    musicBtn?.classList.add('playing');

    setTimeout(() => opening.classList.add('opened'), 1100);
  }

  openInvitation?.addEventListener('click', openWeddingInvitation);

  opening?.addEventListener('click', (event) => {
    if (event.target === opening) {
      openWeddingInvitation();
    }
  });

  /* Wedding countdown */
  const wedding = new Date('2026-11-21T21:56:00+05:30').getTime();

  const sections = [
    ...document.querySelectorAll('.screen[data-section]')
  ];

  const nav = [...document.querySelectorAll('.bottom-nav button')];
  const toast = document.getElementById('toast');

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  /* Cinematic presentation */
  document.body.classList.add('presentation-mode');

  let sceneIndex = 0;
  let scenePlaying = true;
  let sceneTimer = null;

  const sceneDurations = [
    6500,
    6500,
    7500,
    6000,
    7000,
    9000
  ];

  const scenePrev = document.getElementById('scenePrev');
  const sceneNext = document.getElementById('sceneNext');
  const scenePlay = document.getElementById('scenePlay');
  const sceneProgress = document.getElementById('sceneProgress');

  /*
   * Remove the scene controls and progress indicators.
   * The presentation will continue automatically.
   */
  const sceneControls = document.querySelector('.scene-controls');

  if (sceneControls) {
    sceneControls.remove();
  }

  const sceneDots = [];

  function resetSceneTimer() {
    clearTimeout(sceneTimer);

    if (!scenePlaying || sections.length < 2) return;

    sceneTimer = setTimeout(() => {
      showScene(sceneIndex + 1);
    }, sceneDurations[sceneIndex] || 6500);
  }

  function showScene(index, fromUser = false) {
    if (!sections.length) return;

    sceneIndex = (index + sections.length) % sections.length;

    sections.forEach((section, i) => {
      section.classList.toggle('active-scene', i === sceneIndex);
    });

    nav.forEach((button) => {
      button.classList.toggle(
        'active',
        button.dataset.go === sections[sceneIndex].dataset.section
      );
    });

    sceneDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === sceneIndex);
    });

    if (fromUser) {
      scenePlaying = true;

      if (scenePlay) {
        scenePlay.textContent = 'Ⅱ';
        scenePlay.setAttribute('aria-label', 'Pause presentation');
      }
    }

    resetSceneTimer();
  }

  function go(id) {
    const index = sections.findIndex((section) => section.id === id);

    if (index >= 0) {
      showScene(index, true);
    }
  }

  scenePrev?.addEventListener('click', () => {
    showScene(sceneIndex - 1, true);
  });

  sceneNext?.addEventListener('click', () => {
    showScene(sceneIndex + 1, true);
  });

  scenePlay?.addEventListener('click', () => {
    scenePlaying = !scenePlaying;

    scenePlay.textContent = scenePlaying ? 'Ⅱ' : '▶';
    scenePlay.setAttribute(
      'aria-label',
      scenePlaying ? 'Pause presentation' : 'Play presentation'
    );

    resetSceneTimer();
  });

  document.querySelectorAll('[data-go]').forEach((button) => {
    button.addEventListener('click', () => {
      go(button.dataset.go);
    });
  });

  /* Respect reduced-motion preferences */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    scenePlaying = false;

    if (scenePlay) {
      scenePlay.textContent = '▶';
      scenePlay.setAttribute('aria-label', 'Play presentation');
    }
  }

  showScene(0);

  /* Pause automatic transitions when visitors interact */
  document.querySelectorAll('button, input, a').forEach((element) => {
    element.addEventListener('pointerdown', () => {
      if (
        element.closest('.scene-controls') ||
        element.closest('.bottom-nav') ||
        element.id === 'openInvitation'
      ) {
        return;
      }

      scenePlaying = false;

      if (scenePlay) {
        scenePlay.textContent = '▶';
        scenePlay.setAttribute('aria-label', 'Play presentation');
      }

      clearTimeout(sceneTimer);
    });
  });

  /* Countdown display */
  function updateCountdown() {
    const difference = Math.max(0, wedding - Date.now());

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor(difference / 3600000) % 24;
    const minutes = Math.floor(difference / 60000) % 60;
    const seconds = Math.floor(difference / 1000) % 60;

    [
      ['days', days],
      ['hours', hours],
      ['minutes', minutes],
      ['seconds', seconds]
    ].forEach(([id, value]) => {
      const element = document.getElementById(id);

      if (element) {
        element.textContent = String(value).padStart(2, '0');
      }
    });
  }

  /* Gallery slider */
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

  /* Mobile gallery swipe support */
  let galleryTouchStartX = 0;
  let galleryTouchEndX = 0;

  const galleryTrack = document.querySelector('.gallery-track');

  galleryTrack?.addEventListener(
    'touchstart',
    (event) => {
      galleryTouchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  galleryTrack?.addEventListener(
    'touchend',
    (event) => {
      galleryTouchEndX = event.changedTouches[0].screenX;

      const swipeDistance =
        galleryTouchEndX - galleryTouchStartX;

      if (Math.abs(swipeDistance) < 50) return;

      if (swipeDistance < 0) {
        showGallerySlide(galleryIndex + 1);
      } else {
        showGallerySlide(galleryIndex - 1);
      }
    },
    { passive: true }
  );

  /* Floating petals and countdown refresh */
  updateCountdown();
  setInterval(updateCountdown, 1000);

  function petals() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const container = document.querySelector('.petals');
    if (!container) return;

    for (let i = 0; i < 16; i++) {
      const petal = document.createElement('span');

      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';

      petal.style.setProperty(
        '--drift',
        Math.random() * 180 - 90 + 'px'
      );

      petal.style.animationDuration =
        6 + Math.random() * 7 + 's';

      petal.style.animationDelay =
        Math.random() * 5 + 's';

      container.appendChild(petal);
    }
  }

  petals();

  /* Share invitation */
  const shareData = {
    title: 'Atrivarada & Renuka — Wedding Invitation',
    text: 'You are warmly invited to celebrate the wedding of Atrivarada & Renuka.',
    url: location.href
  };

  document.getElementById('shareBtn')?.addEventListener(
    'click',
    async () => {
      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(location.href);
          showToast('Invitation link copied');
        }
      } catch (error) {
        // Sharing may be cancelled by the visitor.
      }
    }
  );

  /* Copy invitation link */
  document.getElementById('copyBtn')?.addEventListener(
    'click',
    async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        showToast('Invitation link copied');
      } catch (error) {
        showToast(location.href);
      }
    }
  );

  /* Gallery image lightbox */
  document.querySelectorAll('.gallery-slide img').forEach((image) => {
    image.addEventListener('click', () => {
      const lightbox = document.getElementById('lightbox');
      const lightboxImage = document.getElementById('lightboxImg');

      if (!lightbox || !lightboxImage) return;

      lightboxImage.src = image.src;
      lightbox.classList.add('open');
    });
  });

  document.getElementById('closeLightbox')?.addEventListener('click', () => {
    document.getElementById('lightbox')?.classList.remove('open');
  });

  document.getElementById('lightbox')?.addEventListener('click', (event) => {
    if (event.target.id === 'lightbox') {
      event.currentTarget.classList.remove('open');
    }
  });

  /* WhatsApp RSVP */
  document.querySelectorAll('[data-rsvp]').forEach((button) => {
    button.addEventListener('click', () => {
      const message = encodeURIComponent(
        'Wedding RSVP — Atrivarada & Renuka\n\n' +
        'I would like to respond: ' + button.dataset.rsvp + '\n\n' +
        'Invitation: ' + location.href
      );

      window.location.href = 'https://wa.me/?text=' + message;
    });
  });

  /* Download wedding and reception calendar events */
  document.getElementById('calendarBtn')?.addEventListener('click', () => {
    const calendar = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//InviteAura//Wedding//EN',

      'BEGIN:VEVENT',
      'DTSTART:20261121T212600',
      'DTEND:20261121T232600',
      'SUMMARY:Atrivarada & Renuka — Wedding / Muhurtham',
      'LOCATION:Vijayawada',
      'DESCRIPTION:Wedding invitation for Atrivarada & Renuka.',
      'END:VEVENT',

      'BEGIN:VEVENT',
      'DTSTART:20261205T190000',
      'DTEND:20261205T220000',
      'SUMMARY:Atrivarada & Renuka — Reception',
      'LOCATION:Visakhapatnam',
      'DESCRIPTION:Wedding reception for Atrivarada & Renuka.',
      'END:VEVENT',

      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([calendar], {
      type: 'text/calendar;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'Atrivarada-Renuka-Wedding.ics';

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  /* Directions to wedding venue */
//  document.getElementById('directionsBtn')?.addEventListener('click', () => {
//    window.open(
//      'https://www.google.com/maps/search/?api=1&query=Vijayawada',
//      '_blank',
//      'noopener'
//    );
//  });
/* Directions to wedding venue */
//document.getElementById('directionsBtn')?.addEventListener('click', () => {
//  window.open(
//    'https://maps.app.goo.gl/6zN2wuTD8FuyCXKg9?g_st=aw',
//    '_blank',
//    'noopener,noreferrer'
//  );
//});

/* Google Maps directions */
document.getElementById('directionsBtn')?.addEventListener('click', () => {
  window.open(
    'https://maps.app.goo.gl/6zN2wuTD8FuyCXKg9?g_st=aw',
    '_blank',
    'noopener,noreferrer'
  );
});

document.getElementById('receptionDirectionsBtn')?.addEventListener('click', () => {
  window.open(
    'https://maps.app.goo.gl/9U1wd8DCnN1WmSZp8',
    '_blank',
    'noopener,noreferrer'
  );
});

/* Download an event as an .ics calendar file */
function downloadCalendarEvent({ filename, title, start, end, location, description }) {
  const formatDate = (date) =>
    date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const escapeICS = (value) =>
    String(value)
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//Events//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${filename}-${start.getTime()}@wedding-invitation`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${escapeICS(title)}`,
    `LOCATION:${escapeICS(location)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], {
    type: 'text/calendar;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/* Wedding: 21 November 2026, 9:56 PM IST
   Assumed duration: 2 hours */
document.getElementById('weddingCalendarBtn')?.addEventListener('click', () => {
  downloadCalendarEvent({
    filename: 'atrivarada-renuka-wedding',
    title: 'Wedding of Atrivarada & Renuka',
    start: new Date('2026-11-21T21:56:00+05:30'),
    end: new Date('2026-11-21T23:56:00+05:30'),
    location: 'Vijayawada',
    description: 'Wedding celebration of Atrivarada & Renuka.'
  });
});

/* Reception: 5 December 2026, 7 PM onwards
   Assumed duration: 4 hours */
document.getElementById('receptionCalendarBtn')?.addEventListener('click', () => {
  downloadCalendarEvent({
    filename: 'atrivarada-renuka-reception',
    title: 'Reception of Atrivarada & Renuka',
    start: new Date('2026-12-05T19:00:00+05:30'),
    end: new Date('2026-12-05T23:00:00+05:30'),
    location: 'Visakhapatnam',
    description: 'Reception celebration of Atrivarada & Renuka.'
  });
});


  /* Background music toggle */
  musicBtn?.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();

        musicBtn.textContent = '♫';
        musicBtn.classList.add('playing');

        showToast('Wedding music playing ♫');
      } else {
        audio.pause();

        musicBtn.textContent = '♪';
        musicBtn.classList.remove('playing');

        showToast('Music paused');
      }
    } catch (error) {
      showToast('Tap again to start the music');
    }
  });

  /* Gallery arrow: continue directly to RSVP */
  const nextSceneBtn = document.getElementById('nextSceneBtn');

  nextSceneBtn?.addEventListener('click', () => {
    go('rsvp');
  });

})();

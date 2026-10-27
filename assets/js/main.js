/* Each block checks that its elements exist, so removing a section never breaks the rest.
   The `js` class is added on <html> at the very end; CSS uses it to enable the reveal animation
   (the speaker cards have their own `speakers-ready` class). If this script fails to load or
   stops during start-up, all content stays visible. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scrollBehavior = () => (reduceMotion.matches ? 'auto' : 'smooth');

/* ═══════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════ */
(function() {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (!mobileToggle || !navLinks) return;
  const spans = mobileToggle.querySelectorAll('span');

  function setOpen(open) {
    navLinks.classList.toggle('open', open);
    mobileToggle.setAttribute('aria-expanded', String(open));
    if (spans.length < 3) return;
    spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = open ? '0' : '';
    spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
  }

  mobileToggle.addEventListener('click', () => setOpen(!navLinks.classList.contains('open')));
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !navLinks.classList.contains('open')) return;
    if (navLinks.contains(document.activeElement)) mobileToggle.focus();
    setOpen(false);
  });
})();

/* ═══════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════ */
(function() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('visible'));
    return;
  }
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  // threshold 0: a block appears as soon as its top is 50 px inside the screen. A share of its
  // height (the original 10%) left tall blocks, like the speaker grid on phones, blank for a while.
  }, { threshold: 0, rootMargin: '0px 0px -50px 0px' });

  // anything already on screen when the script runs (e.g. on a slow connection) stays visible
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('visible');
    else revealObserver.observe(el);
  });
})();

/* ═══════════════════════════════════════
   COUNTING ANIMATION
   ═══════════════════════════════════════ */
(function() {
  const proofNumbers = document.querySelectorAll('.proof-number');
  if (!proofNumbers.length) return;

  const format = (value, target) =>
    (target >= 1000 ? value.toLocaleString() : value) + (target > 10 ? '+' : '');

  function run() {
    proofNumbers.forEach(el => {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (reduceMotion.matches) {
        el.textContent = format(target, target);
        return;
      }
      const duration = 2000;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = format(Math.round(eased * target), target);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    });
  }

  if (!('IntersectionObserver' in window)) {
    run();
    return;
  }
  const countObserver = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) {
      countObserver.disconnect();
      run();
    }
  }, { threshold: 0.3 });

  proofNumbers.forEach(el => countObserver.observe(el));
})();

/* ═══════════════════════════════════════
   VENUE SLIDER
   ═══════════════════════════════════════ */
(function() {
  const track = document.getElementById('venueTrack');
  if (!track) return;
  const dotsContainer = document.getElementById('venueDots');
  const prevBtn = document.getElementById('venuePrev');
  const nextBtn = document.getElementById('venueNext');

  let current = 0;
  const total = track.querySelectorAll('.venue-slide').length;
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.venue-slider-dot') : [];

  // Lazy images in a sideways-moved track may never start loading: load all slides when the
  // slider comes near the screen (and at the latest on first use)
  const loadAll = () => track.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
  if ('IntersectionObserver' in window) {
    const near = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        near.disconnect();
        loadAll();
      }
    }, { rootMargin: '600px 0px' });
    near.observe(track);
  }

  function goTo(index) {
    loadAll();
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  if (dotsContainer) {
    dotsContainer.addEventListener('click', e => {
      const dot = e.target.closest('[data-index]');
      if (dot) goTo(+dot.dataset.index);
    });
  }

  // Hide arrows and dots when there is only one slide
  if (total <= 1) {
    [prevBtn, nextBtn, dotsContainer].forEach(el => { if (el) el.style.display = 'none'; });
  }
})();

/* ═══════════════════════════════════════
   HUSKY PHOTO FADE ON SCROLL
   ═══════════════════════════════════════ */
(function() {
  const huskyImg = document.querySelector('.proof-bar-photo img');
  if (!huskyImg) return;
  window.addEventListener('scroll', () => {
    if (reduceMotion.matches) {
      huskyImg.style.opacity = '';
      return;
    }
    const rect = huskyImg.getBoundingClientRect();
    const windowH = window.innerHeight;
    if (rect.top < windowH && rect.bottom > 0) {
      const scrolled = Math.max(0, windowH - rect.top);
      const progress = scrolled / (rect.height + windowH);
      huskyImg.style.opacity = Math.max(0, 1 - progress * 1.1);
    }
  }, { passive: true });
})();

/* ═══════════════════════════════════════
   COUNTDOWN TIMER
   ═══════════════════════════════════════ */
(function() {
  const fields = ['days', 'hours', 'minutes', 'seconds'].map(id => document.getElementById('cd-' + id));
  if (fields.some(el => !el)) return;
  const conferenceDate = new Date('2027-06-14T09:00:00+02:00');

  function updateCountdown() {
    const diff = Math.max(0, conferenceDate - new Date());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    fields[0].textContent = days;
    fields[1].textContent = String(hours).padStart(2, '0');
    fields[2].textContent = String(minutes).padStart(2, '0');
    fields[3].textContent = String(seconds).padStart(2, '0');
    if (diff === 0) clearInterval(timer);
  }

  const timer = setInterval(updateCountdown, 1000);
  updateCountdown();
})();

/* ═══════════════════════════════════════
   SPEAKER BIO WINDOW
   A click or tap anywhere on a card, or on its "Show bio" button, opens the bio in a
   window (#speakerDialog), filled from the card. Mouse users also see the card flip on
   hover (CSS). The `speakers-ready` class on <html> tells CSS the window works; without
   it (no JavaScript, or a browser without <dialog>) every bio stays readable on the page.
   ═══════════════════════════════════════ */
(function() {
  const cards = document.querySelectorAll('.speaker-slot');
  const dialog = document.getElementById('speakerDialog');
  if (!cards.length || !dialog || typeof dialog.showModal !== 'function') return;
  const header = dialog.querySelector('.speaker-dialog-header');
  const text = (root, selector) => (root.querySelector(selector) || {}).textContent || '';
  let opener = null;
  let byPointer = false; // last use was a tap or click, not the keyboard
  let closedAt = 0;

  function open(card) {
    const back = card.querySelector('.speaker-flip-back');
    if (!back) return;
    dialog.querySelector('.speaker-dialog-name').textContent = text(back, '.flip-name');
    dialog.querySelector('.speaker-dialog-title').textContent = text(back, '.flip-title');
    dialog.querySelector('.speaker-dialog-bio').textContent = text(back, '.flip-bio');
    const old = header && header.querySelector('.speaker-dialog-photo');
    if (old) old.remove();
    const cardPhoto = card.querySelector('.speaker-slot-photo img');
    if (header && cardPhoto) {
      const photo = document.createElement('img');
      photo.className = 'speaker-dialog-photo';
      photo.src = cardPhoto.currentSrc || cardPhoto.src;
      photo.alt = '';
      photo.width = 84;
      photo.height = 84;
      header.prepend(photo);
    }
    opener = card.querySelector('.speaker-bio-toggle');
    dialog.showModal();
    dialog.scrollTop = 0;
    document.documentElement.classList.add('dialog-open');
  }

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('dialog-open');
    closedAt = performance.now();
    // focus returns to the card's button, also when the window was opened from the photo;
    // the focus outline shows only for keyboard users
    if (opener) {
      const y = window.scrollY;
      opener.focus({ preventScroll: true, focusVisible: !byPointer });
      // seen once on an Android phone: the page still scrolled to the button; keep it in place
      if (window.scrollY !== y) window.scrollTo({ top: y, behavior: 'instant' });
    }
    opener = null;
  });
  dialog.addEventListener('pointerdown', () => { byPointer = true; });
  dialog.addEventListener('keydown', () => { byPointer = false; });
  // a click on the dimmed backdrop (outside the window's content) closes it
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  const close = dialog.querySelector('.speaker-dialog-close');
  if (close) close.addEventListener('click', () => dialog.close());

  cards.forEach(card => card.addEventListener('click', e => {
    // the tap that closed the window must not open the card that ends up under the finger
    if (performance.now() - closedAt < 400) return;
    byPointer = e.detail > 0; // 0 when "Show bio" is pressed with Enter or Space
    open(card);
  }));
  document.documentElement.classList.add('speakers-ready');
})();

/* ═══════════════════════════════════════
   ACCORDION
   One answer open at a time. In an accordion marked data-independent (the
   Call for Abstracts FAQ) each answer opens on its own; closed answers get
   `hidden` from this script, so without JavaScript they all stay readable.
   ═══════════════════════════════════════ */
(function() {
  document.querySelectorAll('.accordion[data-independent] .accordion-trigger').forEach(trigger => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;
    panel.hidden = trigger.getAttribute('aria-expanded') !== 'true';
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  });

  const items = document.querySelectorAll('.accordion:not([data-independent]) .accordion-item');
  const triggers = document.querySelectorAll('.accordion:not([data-independent]) .accordion-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      if (!item) return;
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const t = i.querySelector('.accordion-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ═══════════════════════════════════════
   STICKY CTA & BACK TO TOP
   ═══════════════════════════════════════ */
(function() {
  const stickyCta = document.getElementById('stickyCta');
  const backToTop = document.getElementById('backToTop');
  const siteFooter = document.querySelector('footer');
  if (!stickyCta && !backToTop) return;

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 600;
    if (stickyCta) {
      const footerVisible = siteFooter ? siteFooter.getBoundingClientRect().top < window.innerHeight : false;
      stickyCta.classList.toggle('visible', show && !footerVisible);
    }
    if (backToTop) backToTop.classList.toggle('visible', show);
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
    });
  }
})();

/* ═══════════════════════════════════════
   SMOOTH SCROLL
   ═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href.length < 2) return;
    const target = document.getElementById(href.slice(1));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: scrollBehavior() });
    }
  });
});

document.documentElement.classList.add('js');

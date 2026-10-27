/* Form walkthroughs – each .fd[data-demo-name] plays the steps listed in its .fd-steps
   on an HTML copy of OpenReview. The notes come from that list, so the text version and
   the animation always say the same. Screens are .fd-screen elements with data-url.
   All example data below is fictional. */
(() => {
  /* ── Submission form (section #form-demo) ── */
  const SUBMISSION = {
    title: 'Do shelter dogs follow human pointing after short training? A pilot study',
    search: 'Tomas Example',
    keywords: 'dog cognition, human-dog communication, shelter dogs',
    tldr: 'Shelter dogs used human pointing more often after five short training sessions.',
    abstract:
      'Introduction: Dogs living in shelters have limited daily contact with people, which may affect how they respond to human gestures.\n\n' +
      'Question/Hypothesis: We asked whether short daily training improves shelter dogs’ use of human pointing. We expected more correct choices after training.\n\n' +
      'Method: 24 shelter dogs completed an object-choice task before and after five 10-minute sessions. A control group of 12 dogs received the same human contact without training.\n\n' +
      'Results: Trained dogs chose the indicated bowl more often after training than before (Wilcoxon signed-rank test, p < .05); control dogs did not change.\n\n' +
      'Discussion/Conclusion: Brief training may help shelter dogs use human gestures, which could support adoption. A larger, preregistered study is planned.',
    typed: 132,
    max: 5000
  };

  const submissionSteps = ({ q, wait, focusOn, moveTo, click, type, fill, pick, tick, screen }) => ({
    async loggedout(c) {
      await focusOn(q('add'), c);
      const b = q('open');
      await moveTo(b, c);
      await click(b, c);
      q('login-flash').classList.add('is-on');
      await wait(400, c);
    },
    async login(c) {
      await focusOn(q('nav'), c);
      const l = q('login');
      await moveTo(l, c);
      await click(l, c);
      screen('login');
      await focusOn(q('login-form'), c);
      const email = q('login-email');
      await moveTo(email, c, 0.1);
      await click(email, c);
      await type(email, 'anna.example@example.org', c, 40);
      const pass = q('login-pass');
      await moveTo(pass, c, 0.1);
      await click(pass, c);
      await type(pass, '••••••••••', c, 60);
      const b = q('login-btn');
      b.classList.remove('or-btn-dim');
      await moveTo(b, c);
      await click(b, c);
      await wait(300, c);
      screen('venue');
      q('nav').classList.add('is-in');
      q('login-flash').classList.remove('is-on');
      await focusOn(q('nav'), c);
    },
    async open(c) {
      await focusOn(q('add'), c);
      const b = q('open');
      await moveTo(b, c);
      await click(b, c);
      q('editor').classList.add('is-open');
      await wait(400, c);
    },
    title: (c) => fill('title', SUBMISSION.title, c),
    async authors(c) {
      await focusOn(q('f-authors'), c);
      const s = q('search');
      await moveTo(s, c, 0.1);
      await click(s, c);
      await type(s, SUBMISSION.search, c, 60);
      const b = q('searchbtn');
      await moveTo(b, c);
      await click(b, c);
      q('results').classList.add('is-on');
      await wait(900, c);
      const plus = q('plus');
      await moveTo(plus, c);
      await click(plus, c);
      q('results').classList.remove('is-on');
      s.querySelector('.v').textContent = '';
      q('chips').insertAdjacentHTML('beforeend', '<span class="or-chip"><i>Tomas Example</i><b class="or-x">×</b></span>');
      await wait(400, c);
    },
    keywords: (c) => fill('keywords', SUBMISSION.keywords, c),
    tldr: (c) => fill('tldr', SUBMISSION.tldr, c, 35),
    async abstract(c) {
      await focusOn(q('f-abstract'), c);
      const box = q('abstract');
      await moveTo(box, c, 0.2, 0.15);
      await click(box, c);
      await type(box, SUBMISSION.abstract.slice(0, SUBMISSION.typed), c, 32);
      await wait(500, c);
      box.querySelector('.v').textContent = SUBMISSION.abstract;
      abstractCounter(q);
      await wait(900, c);
    },
    email: (c) => tick('email', c),
    data: (c) => tick('data', c),
    license: (c) => pick('f-license', 'license', 'license-menu', 'CC BY-NC-ND 4.0', c),
    signatures: (c) => pick('f-signatures', 'signature', 'signature-menu', '~Anna_Example1', c),
    async submit(c) {
      await focusOn(q('f-submit'), c);
      const b = q('submit');
      await moveTo(b, c);
      await click(b, c);
      await wait(400, c);
      q('editor').classList.remove('is-open');
      q('flash').classList.add('is-on');
      await focusOn(q('flash'), c);
    },
    async edit(c) {
      await focusOn(q('flash'), c);
    }
  });

  function abstractCounter(q) {
    const box = q('abstract');
    const n = box.querySelector('.v').textContent.length;
    const counter = q('counter');
    counter.classList.toggle('is-on', n > 0);
    counter.querySelector('span').textContent = String(SUBMISSION.max - n);
    box.scrollTop = box.scrollHeight;
  }

  /* ── Profile sign-up (section #signup-demo) ── */
  const PROFILE = {
    name: 'Anna Example',
    email: 'anna.example@example.org',
    homepage: 'https://university.example/people/anna-example',
    position: 'PhD Student',
    start: '2023',
    domain: 'university.example',
    institution: 'University of Example',
    country: 'Poland',
    expertise: 'dog cognition, human-dog communication'
  };

  const signupSteps = ({ q, all, wait, focusOn, moveTo, click, type, screen, viewport }) => {
    const reveal = (name) => q(name).classList.add('is-on');
    async function checkBox(name, c) {
      const box = q(name);
      await moveTo(box.querySelector('.or-box'), c);
      await click(box, c);
      box.classList.add('is-on');
      await wait(300, c);
    }
    async function input(name, text, c, speed) {
      const box = q(name);
      await moveTo(box, c, 0.1);
      await click(box, c);
      await type(box, text, c, speed);
    }
    function pane(i) {
      all('.or-pane').forEach((p, k) => p.classList.toggle('is-on', k === i));
      all('.or-step').forEach((s, k) => s.classList.toggle('is-on', k === i));
      q('next').classList.toggle('is-gone', i === 5);
      q('register-or').classList.toggle('is-gone', i !== 5);
      viewport.scrollTop = 0;
    }
    async function nextSection(i, c) {
      const b = q('next');
      await focusOn(q('actions'), c);
      await moveTo(b, c);
      await click(b, c);
      pane(i);
      await wait(300, c);
    }

    return {
      async open(c) {
        await focusOn(q('newuser'), c);
        const b = q('signup-btn');
        await moveTo(b, c);
        await click(b, c);
        screen('signup');
        await wait(300, c);
      },
      async name(c) {
        await focusOn(q('f-name'), c);
        await input('fullname', PROFILE.name, c, 70);
        await checkBox('name-check', c);
        reveal('f-dob');
      },
      async dob(c) {
        await focusOn(q('f-dob'), c);
        const sel = q('dob-month');
        await moveTo(sel, c, 0.3);
        await click(sel, c);
        const menu = q('month-menu');
        menu.classList.add('is-on');
        await wait(500, c);
        const opt = menu.querySelector('span');
        await moveTo(opt, c, 0.2);
        opt.classList.add('is-hover');
        await click(opt, c);
        menu.classList.remove('is-on');
        sel.textContent = 'May (5)';
        sel.classList.add('is-set');
        await input('dob-dd', '14', c, 90);
        await input('dob-yyyy', '1990', c, 90);
        reveal('f-email');
      },
      async email(c) {
        await focusOn(q('f-email'), c);
        await input('email', PROFILE.email, c, 40);
        reveal('warn');
        await wait(700, c);
        const b = q('email-btn');
        await moveTo(b, c);
        await click(b, c);
        b.classList.add('is-gone');
        q('np-title').textContent = 'Enter a password';
        reveal('f-pass');
      },
      async password(c) {
        await focusOn(q('f-pass'), c);
        await input('pass1', '••••••••••••', c, 50);
        await input('pass2', '••••••••••••', c, 50);
        const b = q('pass-btn');
        await moveTo(b, c);
        await click(b, c);
        viewport.scrollTop = 0;
        reveal('modal');
        await wait(300, c);
      },
      async confirm(c) {
        await focusOn(q('modal-box'), c);
        await checkBox('name-ok', c);
        await wait(500, c);
        reveal('captcha');
        const b = q('register');
        b.classList.remove('or-btn-dim');
        await wait(600, c);
        await moveTo(b, c);
        await click(b, c);
        screen('thanks');
        await wait(300, c);
      },
      async inbox(c) {
        await focusOn(q('thanks'), c);
      },
      async names(c) {
        screen('activate');
        pane(0);
        await focusOn(q('p-names'), c);
        await wait(600, c);
      },
      async personal(c) {
        await nextSection(1, c);
        await focusOn(q('p-personal'), c);
        await wait(600, c);
      },
      async emails(c) {
        await nextSection(2, c);
        await focusOn(q('p-emails'), c);
        await wait(600, c);
      },
      async links(c) {
        await nextSection(3, c);
        await focusOn(q('p-links'), c);
        await input('homepage', PROFILE.homepage, c, 30);
      },
      async history(c) {
        await nextSection(4, c);
        await focusOn(q('p-history'), c);
        await input('h-position', PROFILE.position, c, 50);
        await input('h-start', PROFILE.start, c, 80);
        await input('h-domain', PROFILE.domain, c, 40);
        await input('h-name', PROFILE.institution, c, 40);
        await input('h-country', PROFILE.country, c, 60);
      },
      async expertise(c) {
        await nextSection(5, c);
        await focusOn(q('p-expertise'), c);
        await input('expertise', PROFILE.expertise, c, 40);
        const b = q('register-or');
        await moveTo(b, c);
        await click(b, c);
        screen('done');
        await wait(300, c);
      },
      async wait(c) {
        await focusOn(q('done-flash'), c);
      }
    };
  };

  const DEMOS = { submission: submissionSteps, signup: signupSteps };

  document.querySelectorAll('.fd[data-demo-name]').forEach((root) => {
    const makeSteps = DEMOS[root.dataset.demoName];
    if (makeSteps && !root.closest('[data-demo="off"]')) setup(root, makeSteps);
  });

  function setup(root, makeSteps) {
    root.classList.add('fd-js');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const viewport = root.querySelector('.fd-viewport');
    const page = root.querySelector('.fd-page');
    const frame = root.querySelector('.fd-frame');
    const note = root.querySelector('.fd-note');
    const playBtn = root.querySelector('[data-act="play"]');
    const jump = root.querySelector('.fd-jump');
    const url = root.querySelector('.fd-url');
    const q = (name) => root.querySelector(`[data-fd="${name}"]`);
    const all = (sel) => root.querySelectorAll(`.fd-page ${sel}`);
    const INITIAL = page.innerHTML;
    const INITIAL_URL = url.textContent;

    root.querySelector('.fd-text').open = false;
    root.querySelector('.fd-controls').hidden = false;

    const items = [...root.querySelectorAll('.fd-steps li')].map((li) => ({
      id: li.dataset.step,
      label: li.dataset.label,
      what: li.querySelector('.fd-what').textContent.trim(),
      why: li.querySelector('.fd-why') ? li.querySelector('.fd-why').textContent.trim() : ''
    }));

    items.forEach((item, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = item.label;
      b.addEventListener('click', () => goTo(i, !userPaused && !reduce));
      jump.appendChild(b);
    });

    /* ── Playback state ── */
    const ABORT = {};
    let gen = 0;
    let cur = -1;
    let running = false;
    let finished = false;
    let started = false;
    let userPaused = false;
    let inView = false;
    let paused = false;
    let waiters = [];

    const newRun = (fast) => ({ g: ++gen, fast });
    const check = (c) => { if (c.g !== gen) throw ABORT; };

    function update() {
      paused = userPaused || !inView || document.hidden;
      if (!paused) { const w = waiters; waiters = []; w.forEach((r) => r()); }
      playBtn.textContent = finished ? 'Play again' : (running && !userPaused ? 'Pause' : 'Play');
    }

    async function wait(ms, c) {
      check(c);
      if (c.fast) return;
      let left = ms;
      while (left > 0) {
        if (paused) await new Promise((r) => waiters.push(r));
        check(c);
        const d = Math.min(60, left);
        await new Promise((r) => setTimeout(r, d));
        left -= d;
        check(c);
      }
    }

    /* ── Helpers ── */
    const pos = (el) => {
      const r = el.getBoundingClientRect();
      const p = page.getBoundingClientRect();
      return { x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height };
    };

    function placeNote(y) {
      if (getComputedStyle(note).position !== 'absolute') return;
      const chrome = root.querySelector('.fd-chrome').offsetHeight;
      const max = frame.offsetHeight - note.offsetHeight;
      note.style.top = Math.max(0, Math.min(max, chrome + y - 12)) + 'px';
    }

    async function focusOn(el, c) {
      root.querySelectorAll('.is-active').forEach((a) => a.classList.remove('is-active'));
      el.classList.add('is-active');
      const p = pos(el);
      const max = viewport.scrollHeight - viewport.clientHeight;
      const top = Math.max(0, Math.min(max, p.y - viewport.clientHeight * 0.2));
      viewport.scrollTo({ top, behavior: c.fast || reduce ? 'auto' : 'smooth' });
      placeNote(p.y - top);
      await wait(500, c);
    }

    async function moveTo(el, c, fx = 0.5, fy = 0.6) {
      const p = pos(el);
      q('cursor').style.transform = `translate(${Math.round(p.x + p.w * fx)}px, ${Math.round(p.y + p.h * fy)}px)`;
      await wait(650, c);
    }

    async function click(el, c) {
      const cursor = q('cursor');
      cursor.classList.remove('is-click');
      void cursor.offsetWidth;
      cursor.classList.add('is-click');
      el.classList.add('is-press');
      await wait(180, c);
      el.classList.remove('is-press');
      await wait(160, c);
    }

    function afterInput(box) {
      if (box.dataset.fd === 'abstract') abstractCounter(q);
    }

    async function type(box, text, c, speed = 45) {
      const v = box.querySelector('.v');
      box.classList.add('is-typing');
      if (c.fast) {
        v.textContent += text;
      } else {
        for (const ch of text) {
          v.textContent += ch;
          afterInput(box);
          await wait(speed * (0.6 + Math.random() * 0.8), c);
        }
      }
      afterInput(box);
      box.classList.remove('is-typing');
    }

    async function fill(name, text, c, speed) {
      await focusOn(q('f-' + name), c);
      const box = q(name);
      await moveTo(box, c, 0.08);
      await click(box, c);
      await type(box, text, c, speed);
    }

    async function pick(rowName, selectName, menuName, value, c) {
      await focusOn(q(rowName), c);
      const sel = q(selectName);
      await moveTo(sel, c, 0.3);
      await click(sel, c);
      const menu = q(menuName);
      menu.classList.add('is-on');
      await wait(500, c);
      const opt = menu.querySelector('span');
      await moveTo(opt, c, 0.2);
      opt.classList.add('is-hover');
      await click(opt, c);
      menu.classList.remove('is-on');
      sel.textContent = value;
      sel.classList.add('is-set');
      await wait(300, c);
    }

    async function tick(name, c) {
      await focusOn(q('f-' + name), c);
      const radio = q(name);
      await moveTo(radio.querySelector('.or-dot'), c);
      await click(radio, c);
      radio.classList.add('is-on');
      await wait(300, c);
    }

    function screen(name) {
      root.querySelectorAll('.fd-screen').forEach((s) => s.classList.toggle('is-on', s.dataset.fd === 's-' + name));
      url.textContent = q('s-' + name).dataset.url;
      viewport.scrollTop = 0;
    }

    const STEPS = makeSteps({ q, all, wait, focusOn, moveTo, click, type, fill, pick, tick, screen, viewport });

    function show(i) {
      cur = i;
      const item = items[i];
      note.querySelector('.fd-note-step').textContent = `Step ${i + 1} of ${items.length}`;
      note.querySelector('.fd-note-label').textContent = item.label;
      note.querySelector('.fd-note-what').textContent = item.what;
      note.querySelector('.fd-note-why').textContent = item.why;
      note.classList.remove('is-swap');
      void note.offsetWidth;
      note.classList.add('is-swap');
      [...jump.children].forEach((b, k) => {
        if (k === i) b.setAttribute('aria-current', 'step');
        else b.removeAttribute('aria-current');
      });
    }

    function reset() {
      page.innerHTML = INITIAL;
      url.textContent = INITIAL_URL;
      viewport.scrollTop = 0;
    }

    async function play(from, c) {
      running = true;
      finished = false;
      update();
      try {
        for (let i = from; i < items.length; i++) {
          show(i);
          await STEPS[items[i].id](c);
          await wait(2200, c);
        }
        running = false;
        finished = true;
        update();
      } catch (e) {
        if (e !== ABORT) throw e;
      }
    }

    async function goTo(i, autoplay) {
      i = Math.max(0, Math.min(items.length - 1, i));
      const c = newRun(true);
      running = false;
      finished = false;
      reset();
      try {
        for (let k = 0; k < i; k++) await STEPS[items[k].id](c);
        if (autoplay) {
          c.fast = false;
          await play(i, c);
        } else {
          show(i);
          await STEPS[items[i].id](c);
          update();
        }
      } catch (e) {
        if (e !== ABORT) throw e;
      }
    }

    /* ── Controls ── */
    playBtn.addEventListener('click', () => {
      if (finished) { userPaused = false; goTo(0, true); return; }
      if (running) { userPaused = !userPaused; update(); return; }
      userPaused = false;
      if (cur + 1 >= items.length) { goTo(0, true); return; }
      const c = newRun(false);
      play(cur + 1, c);
    });
    root.querySelector('[data-act="replay"]').addEventListener('click', () => { userPaused = false; goTo(0, true); });
    root.querySelector('[data-act="prev"]').addEventListener('click', () => goTo(cur - 1, !userPaused && running && !reduce));
    root.querySelector('[data-act="next"]').addEventListener('click', () => goTo(cur + 1, !userPaused && running && !reduce));
    document.addEventListener('visibilitychange', update);

    if (reduce) {
      inView = true;
      started = true;
      goTo(0, false);
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          inView = e.isIntersecting;
          if (inView && !started) { started = true; goTo(0, true); }
          update();
        });
      }, { threshold: 0.35 }).observe(viewport);
    } else {
      inView = true;
      started = true;
      goTo(0, true);
    }
    update();
  }
})();

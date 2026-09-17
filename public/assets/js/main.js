// Ombre nav au scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Menu hamburger
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

function startReveals() {
  // Ce qui est déjà à l'écran apparaît tout de suite, le reste au scroll
  const vh = window.innerHeight;
  revealEls.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < vh && r.bottom > 0) el.classList.add('visible');
    else revealObs.observe(el);
  });
}

// ─── Rideau d'ouverture ────────────────────────────────────────────
(function () {
  const root  = document.documentElement;
  const intro = document.getElementById('intro');

  if (!intro || !root.classList.contains('intro-on')) {
    if (intro) intro.remove();
    startReveals();
    return;
  }

  const lines = Array.from(intro.querySelectorAll('.intro-line'));
  const meta  = intro.querySelector('.intro-meta');
  const step  = 270;
  const hold  = 780;

  lines.forEach((line, i) => setTimeout(() => line.classList.add('is-in'), 140 + i * step));
  if (meta) setTimeout(() => meta.classList.add('is-in'), 140 + lines.length * step);

  setTimeout(() => {
    intro.classList.add('is-done');
    root.classList.remove('intro-on');
    startReveals();
    setTimeout(() => intro.remove(), 950);
  }, 140 + lines.length * step + hold);
})();

// ─── Récit défilant du manifeste ───────────────────────────────────
(function () {
  const track = document.getElementById('manifeste-track');
  if (!track) return;

  const beats = Array.from(track.querySelectorAll('.beat'));
  const fill  = track.querySelector('.gauge-fill');
  const count = track.querySelector('.gauge-count');
  const N     = beats.length;
  if (!N) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function flatten() {
    track.style.height = 'auto';
    const pin = track.querySelector('.manifeste-pin');
    if (pin) { pin.style.position = 'static'; pin.style.height = 'auto'; pin.style.padding = '6rem 9%'; }
    const stage = track.querySelector('.manifeste-stage');
    if (stage) { stage.style.height = 'auto'; }
    beats.forEach(b => {
      b.style.position = 'relative';
      b.style.opacity = 1;
      b.style.transform = 'none';
      b.style.marginBottom = '2.5rem';
    });
    const gauge = track.querySelector('.manifeste-gauge');
    if (gauge) gauge.style.display = 'none';
  }

  if (reduce.matches) { flatten(); return; }

  let ticking = false;

  function update() {
    ticking = false;
    const rect  = track.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) return;

    const p = Math.min(1, Math.max(0, -rect.top / total));
    // +0.30 : le premier beat est déjà en place quand la section s'épingle
    const pos = p * N + 0.30;

    beats.forEach((beat, i) => {
      const last = (i === N - 1);
      const d = pos - i;
      let o = 0, y = 34;

      if (d >= 0) {
        const inP = Math.min(1, d / 0.30);
        o = inP;
        y = 34 * (1 - inP);
        if (!last && d > 0.80) {
          const outP = Math.min(1, (d - 0.80) / 0.30);
          o = 1 - outP;
          y = -30 * outP;
        }
      }

      beat.style.opacity = o;
      beat.style.transform = 'translateY(' + y.toFixed(2) + 'px)';
    });

    if (fill) fill.style.height = (p * 100).toFixed(1) + '%';
    if (count) {
      const idx = Math.min(N, Math.floor(pos) + 1);
      count.textContent = String(idx).padStart(2, '0') + ' / ' + String(N).padStart(2, '0');
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();

// ─── Pour qui : phrase épinglée, verbe aligné sur « Vous » ─────────
(function () {
  const track = document.getElementById('zone-track');
  if (!track) return;
  const list  = track.querySelector('.zone-verbs');
  const verbs = Array.from(track.querySelectorAll('.zone-verb'));
  const N = verbs.length;
  if (!N) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    verbs.forEach(v => v.classList.add('is-active'));
    return;
  }

  let current = 0;

  // Décalage qui amène le centre du verbe i exactement au centre de « Vous »
  function shiftFor(i) {
    const word = verbs[i].querySelector('.zone-verb-word');
    return -(verbs[i].offsetTop + word.offsetHeight / 2);
  }

  function go(i, force) {
    if (i === current && !force) return;
    current = i;
    verbs.forEach((v, k) => v.classList.toggle('is-active', k === i));
    list.style.transform = 'translateY(' + shiftFor(i) + 'px)';
  }

  let ticking = false;
  function update() {
    ticking = false;
    const rect  = track.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) return;
    const p = Math.min(0.9999, Math.max(0, -rect.top / total));
    go(Math.floor(p * N));
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });

  function realign() {
    list.style.transition = 'none';
    go(current, true);
    list.getBoundingClientRect();
    list.style.transition = '';
  }
  window.addEventListener('resize', realign, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(realign);

  realign();
  update();
})();

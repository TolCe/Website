/* Revolave — scroll effects, nav and contact form. No dependencies. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  var nav = $('.nav');
  var bar = $('.progress span');
  var heroIcons = $$('.hicon');
  var features = $$('.feature-art');
  var reel = $('.reel'), track = $('.reel-track');
  var tl = $('.timeline'), tlSteps = $$('.tl-step');
  var links = $$('.nav-links a[href^="#"]');
  var sections = links.map(function (a) { return $(a.getAttribute('href')); });
  var lastY = window.scrollY, ticking = false;

  function frame() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight, doc = document.documentElement;
    var max = doc.scrollHeight - vh;

    // progress bar + nav state
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    nav.classList.toggle('scrolled', y > 20);
    if (!nav.classList.contains('open')) nav.classList.toggle('hide', y > lastY && y > vh * 0.8);
    lastY = y;

    // active nav link
    var current = null;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < vh * 0.4) current = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === current); });

    if (!reduce) {
      // hero parallax
      if (y < vh * 1.2) heroIcons.forEach(function (el) {
        el.style.setProperty('--y', (-y * parseFloat(el.style.getPropertyValue('--s'))).toFixed(1) + 'px');
      });
      // featured phones: spread out when centred, tuck in at the edges
      features.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var p = clamp(((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
        var f = 1 - Math.abs(p);
        el.style.setProperty('--p', p.toFixed(3));
        el.style.setProperty('--spread', (18 + 52 * f).toFixed(1) + '%');
        el.style.setProperty('--spread2', (2 + 12 * f).toFixed(1) + '%');
        el.style.setProperty('--k', (0.3 + 0.7 * f).toFixed(3));
      });
    }

    // horizontal reel
    if (reel && track) {
      var rr = reel.getBoundingClientRect();
      var span = rr.height - vh;
      var t = span > 0 ? clamp(-rr.top / span, 0, 1) : 0;
      var dist = track.scrollWidth - window.innerWidth;
      track.style.transform = 'translate3d(' + (-t * Math.max(0, dist)).toFixed(1) + 'px,0,0)';
    }

    // timeline fill
    if (tl) {
      var tr = tl.getBoundingClientRect();
      var tp = clamp((vh * 0.6 - tr.top) / tr.height, 0, 1);
      tl.style.setProperty('--tl', tp.toFixed(3));
      tlSteps.forEach(function (s) { s.classList.toggle('lit', s.getBoundingClientRect().top < vh * 0.6); });
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  // reveal + counters
  function count(el) {
    var end = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = end.toLocaleString('en-US') + suf; return; }
    var t0 = null;
    (function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / 1200), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
      el.textContent = v.toLocaleString('en-US') + suf;
      if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        $$('[data-count]', en.target).forEach(count);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // mobile menu
  var toggle = $('.nav-toggle');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    nav.classList.remove('hide');
    toggle.setAttribute('aria-expanded', open);
  });
  $$('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', false); }); });

  // contact form (Formspree, AJAX with normal POST fallback)
  var form = $('#contact-form'), status = $('.form-status');
  if (form && window.fetch) form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var btn = $('button', form);
    btn.disabled = true; status.className = 'form-status'; status.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.reset(); status.className = 'form-status ok'; status.textContent = 'Thanks! Your message has been sent.';
      })
      .catch(function () { status.className = 'form-status err'; status.textContent = 'Something went wrong. Please try again.'; })
      .then(function () { btn.disabled = false; });
  });

  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
})();

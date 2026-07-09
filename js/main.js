/* =========================================================
   CHECK Šlep služba — Interactions
   ========================================================= */

// --- INTRO: logo zoom transition into site ---
window.addEventListener('load', () => {
  const intro = document.getElementById('intro');
  // Let logo entrance play, then zoom out into site
  setTimeout(() => {
    intro.classList.add('zoom-out');
    document.body.classList.remove('loading');
  }, 1800);
  setTimeout(() => intro.remove(), 3400);
});

// --- YEAR ---
document.getElementById('year').textContent = new Date().getFullYear();

// --- NAV scroll state ---
const nav = document.getElementById('nav');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 40);
  // progress
  const h = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('scrollProgress').style.width = ((y / h) * 100) + '%';
  lastY = y;
}, { passive: true });

// --- MOBILE MENU ---
const burger = document.getElementById('burger');
burger?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

// --- SPLIT text into words for reveal ---
document.querySelectorAll('.split').forEach(el => {
  const html = el.innerHTML;
  // preserve <br>
  const parts = html.split(/(<br\s*\/?>)/i);
  el.innerHTML = parts.map(p => {
    if (/<br/i.test(p)) return p;
    return p.split(/\s+/).filter(Boolean)
      .map(w => `<span class="word">${w}&nbsp;</span>`).join('');
  }).join('');
});

// --- REVEAL on scroll ---
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(
  '.service, .feature, .contact-card, .about-card, .about-text, .section-head, .process-step, .split, .map-wrap, .hero-marquee'
).forEach(el => { el.classList.add('reveal'); io.observe(el); });

// --- COUNT UP for stats ---
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseFloat(el.dataset.count);
    const isFloat = target % 1 !== 0 || String(target).includes('.');
    const duration = 1400;
    const start = performance.now();
    const from = 0;
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = from + (target - from) * eased;
      el.textContent = target < 10 ? val.toFixed(1) : Math.round(val);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target < 10 ? target.toFixed(1) : Math.round(target);
    }
    requestAnimationFrame(step);
    counterIO.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterIO.observe(c));

// --- CUSTOM CURSOR ---
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let cx = 0, cy = 0, tx = 0, ty = 0;

window.addEventListener('mousemove', (e) => {
  tx = e.clientX; ty = e.clientY;
  cursorDot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
});
function animCursor() {
  cx += (tx - cx) * 0.18;
  cy += (ty - cy) * 0.18;
  cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a, button, .tilt, .service, .feature, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// --- TILT / spotlight for cards ---
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -6;
    const ry = ((x / r.width) - 0.5) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    card.style.setProperty('--mx', `${(x/r.width)*100}%`);
    card.style.setProperty('--my', `${(y/r.height)*100}%`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// --- SMOOTH SCROLL for internal anchors (softer than native) ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length <= 1) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// --- Parallax on hero background (subtle) ---
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `scale(1.1) translateY(${y * 0.15}px)`;
    }
  }, { passive: true });
}

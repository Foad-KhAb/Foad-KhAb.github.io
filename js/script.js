document.getElementById('year').textContent = new Date().getFullYear();

/* theme toggle */
const toggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === 'light' || theme === 'dark') {
    root.setAttribute('data-theme', theme);
  } else {
    root.removeAttribute('data-theme');
  }
}

let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
applyTheme(saved);

toggle.addEventListener('click', () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

/* scroll-spy nav */
const navLinks = Array.from(document.querySelectorAll('#nav-links a[data-nav]'));
const sections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function setActive(id) {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
}

if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach(section => spy.observe(section));
}

/* reveal-on-scroll */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const reveal = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => reveal.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

/* animated stat counters */
const statEls = document.querySelectorAll('.stat-num');
if ('IntersectionObserver' in window && statEls.length) {
  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statEls.forEach(el => statObserver.observe(el));
} else {
  statEls.forEach(el => { el.textContent = el.getAttribute('data-count'); });
}

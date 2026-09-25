// Ikony
if (window.lucide) lucide.createIcons();

// Nagłówek po przewinięciu
const header = document.getElementById('site-header');
const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menu mobilne
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  const setMenu = (open) => {
    mobileMenu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('is-open')));
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
}

// Pasek etapów budowy zawsze od pozycji startowej
const resetStages = () => document.querySelectorAll('.stages').forEach((el) => { el.scrollLeft = 0; });
resetStages();
window.addEventListener('load', resetStages);
window.addEventListener('pageshow', resetStages);

// Pojawianie się elementów
const revealEls = document.querySelectorAll('.reveal, .stage');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Rok w stopce
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

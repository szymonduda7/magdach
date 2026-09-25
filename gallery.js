// Galeria realizacji: filtry + lightbox
const chips = document.querySelectorAll('[data-filter]');
const items = [...document.querySelectorAll('.gallery-item')];
const valid = new Set([...chips].map((c) => c.dataset.filter));

const applyFilter = (cat, updateHash = true) => {
  if (!valid.has(cat)) cat = 'wszystkie';
  chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === cat)));
  items.forEach((li) => { li.hidden = cat !== 'wszystkie' && li.dataset.cat !== cat; });
  if (updateHash) history.replaceState(null, '', cat === 'wszystkie' ? location.pathname : `#${cat}`);
};
chips.forEach((c) => c.addEventListener('click', () => applyFilter(c.dataset.filter)));
applyFilter(location.hash.slice(1) || 'wszystkie', false);
window.addEventListener('hashchange', () => applyFilter(location.hash.slice(1), false));

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbCat = document.getElementById('lb-cat');
const lbCount = document.getElementById('lb-count');
let visible = [];
let index = 0;
let lastFocus = null;

const show = (i) => {
  index = (i + visible.length) % visible.length;
  const btn = visible[index].querySelector('.gallery-btn');
  lbImg.style.opacity = '0';
  lbImg.onload = () => { lbImg.style.opacity = '1'; };
  lbImg.src = btn.dataset.full;
  lbImg.alt = btn.dataset.caption;
  lbCaption.textContent = btn.dataset.caption;
  lbCat.textContent = btn.dataset.catName;
  lbCount.textContent = `${index + 1} / ${visible.length}`;
};

const open = (li) => {
  visible = items.filter((x) => !x.hidden);
  lastFocus = document.activeElement;
  show(visible.indexOf(li));
  lb.classList.add('is-open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('lb-close').focus();
};

const close = () => {
  lb.classList.remove('is-open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
};

items.forEach((li) => li.querySelector('.gallery-btn').addEventListener('click', () => open(li)));
document.getElementById('lb-close').addEventListener('click', close);
document.getElementById('lb-prev').addEventListener('click', () => show(index - 1));
document.getElementById('lb-next').addEventListener('click', () => show(index + 1));
lb.addEventListener('click', (e) => { if (e.target === lb || e.target.parentElement === lb) close(); });

document.addEventListener('keydown', (e) => {
  if (!lb.classList.contains('is-open')) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') show(index - 1);
  if (e.key === 'ArrowRight') show(index + 1);
  if (e.key === 'Tab') {
    const f = [...lb.querySelectorAll('button')];
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

// Przesunięcie palcem
let startX = null;
lb.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', (e) => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  startX = null;
});

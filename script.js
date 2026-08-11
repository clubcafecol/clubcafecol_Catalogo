// ── NAV SCROLL ──────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── BURGER MENU ─────────────────────────────────────────────
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  burger.textContent = mobileMenu.classList.contains('open') ? '✕' : '☰';
});

function closeMobile() {
  mobileMenu.classList.remove('open');
  burger.textContent = '☰';
}

// Close on outside click
document.addEventListener('click', e => {
  if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
    burger.textContent = '☰';
  }
});

// ── COLECCIONES TABS + FILTER ────────────────────────────────
const tabs = document.querySelectorAll('.col-tab');
const cards = document.querySelectorAll('.producto-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const col = tab.dataset.col;

    // Update active tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Filter cards
    cards.forEach(card => {
      if (col === 'all' || card.dataset.col === col) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn .3s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });

    // Scroll to catalog
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── SMOOTH NAV LINKS ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── LAZY LOAD IMAGES ─────────────────────────────────────────
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          imgObserver.unobserve(img);
        }
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

// ── FADE-IN ON SCROLL ────────────────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.producto-card, .valor-card, .club-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  fadeObserver.observe(el);
});

// ── CSS ANIMATION FOR FILTER ──────────────────────────────────
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(style);

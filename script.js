/**
 * Harel & Associés — Main Script
 * Vanilla JS · No dependencies
 */

'use strict';

/* ================================================================
   1. HEADER — scroll state & burger menu
   ================================================================ */

const header = document.getElementById('header');
const burgerBtn = document.getElementById('burger-btn');
const mainNav = document.getElementById('main-nav');

// Sticky header shadow on scroll
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // initial call

// Mobile menu toggle
burgerBtn.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  burgerBtn.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu on nav link click
mainNav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (
    mainNav.classList.contains('is-open') &&
    !mainNav.contains(e.target) &&
    !burgerBtn.contains(e.target)
  ) {
    mainNav.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ================================================================
   2. SCROLL REVEAL — Intersection Observer
   ================================================================ */

const revealTargets = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealTargets.forEach(el => revealObserver.observe(el));

/* ================================================================
   3. ANIMATED COUNTERS
   ================================================================ */

/**
 * Easing function — ease out cubic
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animate a numeric counter from 0 to target
 * @param {HTMLElement} el  — the element to animate
 * @param {number} target   — final value
 * @param {string} suffix   — appended after number (e.g. "+")
 * @param {number} duration — ms
 */
function animateCounter(el, target, suffix, duration = 1600) {
  const start = performance.now();
  const isDecimal = !Number.isInteger(target);

  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const current = eased * target;
    el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + suffix;
    }
  };

  requestAnimationFrame(step);
}

// Observe reassurance section and fire counters
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix ?? '';
        animateCounter(el, target, suffix);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach(el => counterObserver.observe(el));

/* ================================================================
   4. HERO SVG BARS — grow up animation
   ================================================================ */

const heroBars = document.querySelectorAll('.hero-bar');

heroBars.forEach((bar, i) => {
  const targetH = parseFloat(bar.dataset.h);
  const y0 = parseFloat(bar.getAttribute('y'));
  const delay = 1800 + i * 180; // ms, after page load

  setTimeout(() => {
    const start = performance.now();
    const duration = 800;

    const grow = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutCubic(progress);
      const h = eased * targetH;
      bar.setAttribute('height', h);
      bar.setAttribute('y', y0 - h);
      if (progress < 1) requestAnimationFrame(grow);
    };

    requestAnimationFrame(grow);
  }, delay);
});

/* ================================================================
   5. MEMBRE CARD — bio slide-in on avatar click
   ================================================================ */

const membreCards = document.querySelectorAll('.membre-card');

function openCard(card) {
  const avatar = card.querySelector('.membre-card__avatar');
  const bio    = card.querySelector('.membre-card__bio');
  card.classList.add('is-open');
  avatar.setAttribute('aria-expanded', 'true');
  if (bio) bio.setAttribute('aria-hidden', 'false');
}

function closeCard(card) {
  const avatar = card.querySelector('.membre-card__avatar');
  const bio    = card.querySelector('.membre-card__bio');
  card.classList.remove('is-open');
  avatar.setAttribute('aria-expanded', 'false');
  if (bio) bio.setAttribute('aria-hidden', 'true');
}

membreCards.forEach(card => {
  const avatar = card.querySelector('.membre-card__avatar');
  if (!avatar) return;

  const toggle = () => {
    const isOpen = card.classList.contains('is-open');
    // Fermer toutes les autres cartes
    membreCards.forEach(other => { if (other !== card) closeCard(other); });
    // Basculer la carte courante
    isOpen ? closeCard(card) : openCard(card);
  };

  avatar.addEventListener('click', toggle);

  // Support clavier (Enter / Space)
  avatar.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
});

/* ================================================================
   6. ACTIVE NAV LINK — highlight current section
   ================================================================ */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'nav__link--active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  {
    threshold: 0.35,
    rootMargin: '-95px 0px -30% 0px',
  }
);

sections.forEach(s => activeSectionObserver.observe(s));

/* ================================================================
   7. FILE INPUT — display filename
   ================================================================ */

const cvInput = document.getElementById('cand-cv');
const cvLabelText = document.getElementById('cv-label-text');

if (cvInput && cvLabelText) {
  cvInput.addEventListener('change', () => {
    const file = cvInput.files[0];
    if (file) {
      cvLabelText.textContent = file.name;
      cvLabelText.style.color = 'var(--color-navy)';
    } else {
      cvLabelText.textContent = 'Choisir un fichier PDF…';
      cvLabelText.style.removeProperty('color');
    }
  });
}

/* ================================================================
   7. FORM VALIDATION & SUBMIT — demo (no backend)
   ================================================================ */

/**
 * Show a transient toast notification
 * @param {string} message
 * @param {'success'|'error'} type
 */
function showToast(message, type = 'success') {
  // Remove any existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('toast--visible'));
  });

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

/**
 * Validate a single form element
 * @param {HTMLElement} input
 * @returns {boolean}
 */
function validateField(input) {
  const isSelect = input.tagName === 'SELECT';
  const isEmpty = isSelect
    ? input.value === ''
    : input.value.trim() === '';

  if (input.required && isEmpty) {
    input.style.borderColor = '#c53030';
    return false;
  }

  if (input.type === 'email' && input.value.trim()) {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    input.style.borderColor = valid ? '' : '#c53030';
    return valid;
  }

  input.style.borderColor = '';
  return true;
}

function handleFormSubmit(form, successMessage) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = form.querySelectorAll('[required]');
    let valid = true;

    fields.forEach(field => {
      if (!validateField(field)) valid = false;
    });

    if (!valid) {
      showToast('Veuillez remplir tous les champs obligatoires.', 'error');
      // Focus first invalid field
      const firstInvalid = form.querySelector('[required]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate submission
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Envoi en cours…';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      form.reset();
      if (cvLabelText && form.contains(cvInput)) {
        cvLabelText.textContent = 'Choisir un fichier PDF…';
        cvLabelText.style.removeProperty('color');
      }
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '';
      showToast(successMessage, 'success');
    }, 1200);
  });

  // Live validation on blur
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.style.borderColor === 'rgb(197, 48, 48)') validateField(field);
    });
  });
}

const candidatureForm = document.getElementById('candidature-form');
const contactForm = document.getElementById('contact-form');

if (candidatureForm) {
  handleFormSubmit(
    candidatureForm,
    'Candidature envoyée ! Nous vous répondrons dans les meilleurs délais.'
  );
}

if (contactForm) {
  handleFormSubmit(
    contactForm,
    'Message envoyé ! Un associé vous contactera très prochainement.'
  );
}

/* ================================================================
   8. SMOOTH ANCHOR SCROLL with header offset
   ================================================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    const headerH = header.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerH - 8;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ================================================================
   9. PDF DOWNLOAD — HAA-bareme-honoraires.pdf
   ================================================================ */
// Aucun intercepteur : le lien <a href download> gère nativement le téléchargement.

/* ================================================================
   10. REDUCED MOTION SUPPORT
   ================================================================ */

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Immediately reveal all hidden elements
  revealTargets.forEach(el => el.classList.add('is-visible'));

  // Stop SVG animations by converting them to static
  document.querySelectorAll('.grid-v, .grid-h, .hero-curve').forEach(el => {
    el.style.strokeDashoffset = '0';
    el.style.animationDuration = '0.001s';
  });
  document.querySelectorAll('.hero-dot').forEach(el => {
    el.style.opacity = '1';
    el.style.animationDuration = '0.001s';
  });
}

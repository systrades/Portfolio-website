/* =====================================================
   SISON ASALU — Portfolio JavaScript
   Author: Sison Asalu
   Description: Handles all interactivity including:
   - Navbar scroll behaviour
   - Mobile hamburger menu
   - Typed text animation
   - Scroll-triggered entry animations
   - Skill bar animations
   - Stat counter animations
   - Contact form handling
   - Back-to-top button
   ===================================================== */

/* ─── DOM references ──────────────────────────────── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
const backToTop  = document.getElementById('back-to-top');
const navItems   = document.querySelectorAll('.nav-link');
const sections   = document.querySelectorAll('section[id]');
const contactForm = document.getElementById('contact-form');
const submitBtn  = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');

/* ─── 1. Navbar: scroll class + active link ──────── */
function onScroll() {
  // Add scrolled style after 40px
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Back-to-top visibility
  backToTop.classList.toggle('visible', window.scrollY > 500);

  // Highlight active nav link
  let currentSection = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) currentSection = section.id;
  });

  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ─── 2. Hamburger menu ──────────────────────────── */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is tapped on mobile
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ─── 3. Typed text animation ────────────────────── */
const typedEl   = document.getElementById('typed');
const phrases   = [
  'Software Developer',
  'Problem Solver',
  'Clean Code Advocate',
  'Always Learning'
];
let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
const typeSpeed  = 80;
const deleteSpeed = 45;
const pauseEnd   = 1800;

function type() {
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    // Typing forward
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === current.length) {
      // Pause then start deleting
      isDeleting = true;
      setTimeout(type, pauseEnd);
      return;
    }
  } else {
    // Deleting
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
}

// Start after a short delay so hero has loaded
setTimeout(type, 800);

/* ─── 4. Intersection Observer: entry animations ─── */
const animateEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target); // animate once
    }
  });
}, {
  threshold: 0.15,   // trigger when 15% is visible
  rootMargin: '0px 0px -50px 0px'
});

animateEls.forEach(el => observer.observe(el));

/* ─── 5. Skill bars: animate width on scroll ──────── */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const width  = target.dataset.width || 0;
      // Small delay so the bar is visible first
      setTimeout(() => {
        target.style.width = width + '%';
      }, 200);
      skillObserver.unobserve(target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

/* ─── 6. Stat counters: count up on scroll ─────────── */
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

/**
 * Animates a number from 0 to its target value.
 * @param {HTMLElement} el  – the element to update
 * @param {number}      end – target number
 */
function countUp(el, end) {
  const duration = 1800;        // total animation time in ms
  const step     = 16;          // ~60fps tick
  const increment = end / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      el.textContent = end;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      countUp(el, end);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

/* ─── 7. Contact form handling ───────────────────── */
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = contactForm.name.value.trim();
  const email   = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  // Basic validation
  if (!name || !email || !message) {
    shakeForm();
    return;
  }
  if (!isValidEmail(email)) {
    contactForm.email.focus();
    contactForm.email.style.borderColor = '#ff4d6a';
    setTimeout(() => contactForm.email.style.borderColor = '', 2000);
    return;
  }

  // Simulate sending (replace with your backend or EmailJS integration)
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  btnText.style.display    = 'none';
  btnLoading.style.display = 'flex';
  submitBtn.disabled       = true;

  setTimeout(() => {
    btnText.style.display    = 'inline-flex';
    btnLoading.style.display = 'none';
    submitBtn.disabled       = false;

    formSuccess.style.display = 'flex';
    contactForm.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
      formSuccess.style.display = 'none';
    }, 5000);
  }, 1500);
});

/**
 * Simple email format check.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Briefly shakes the form to indicate an error.
 */
function shakeForm() {
  const form = contactForm;
  form.style.animation = 'none';
  form.style.transform = 'translateX(-8px)';
  setTimeout(() => { form.style.transform = 'translateX(8px)'; }, 80);
  setTimeout(() => { form.style.transform = 'translateX(-5px)'; }, 160);
  setTimeout(() => { form.style.transform = 'translateX(5px)'; }, 240);
  setTimeout(() => { form.style.transform = 'translateX(0)';    }, 320);
}

/* ─── 8. Back to top ─────────────────────────────── */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── 9. Smooth reveal for hero on page load ──────── */
window.addEventListener('load', () => {
  document.querySelectorAll('.hero [data-animate]').forEach((el, i) => {
    setTimeout(() => el.classList.add('in-view'), 200 + i * 180);
  });
});

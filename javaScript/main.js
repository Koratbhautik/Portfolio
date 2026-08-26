/* ──────────────────────────────────────────
   Bhautik Korat – Portfolio JS
────────────────────────────────────────── */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveLink();
  toggleBackToTop();
});

// ── Hamburger menu ──
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // animate hamburger → X
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  });
});

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
function updateActiveLink() {
  const scrollY = window.scrollY + 80;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

// ── Typewriter effect ──
const roles = [
  'Computer Engineer',
  'AI & Automation Builder',
  'IoT Enthusiast',
  'B.Tech CSE Student',
  'Problem Solver',
];
let roleIndex = 0, charIndex = 0, deleting = false;
const roleEl = document.getElementById('roleText');

function typeWriter() {
  if (!roleEl) return;
  const current = roles[roleIndex];
  if (deleting) {
    roleEl.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeWriter, 400);
      return;
    }
  } else {
    roleEl.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) {
      deleting = true;
      setTimeout(typeWriter, 1800);
      return;
    }
  }
  setTimeout(typeWriter, deleting ? 50 : 90);
}
typeWriter();

// ── Scroll fade-up animation ──
const fadeEls = document.querySelectorAll(
  '.stat-card, .skill-category, .project-card, .timeline-card, .contact-item, .about-bio, .about-stats'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger delay based on index within visible group
      setTimeout(() => {
        entry.target.classList.add('visible');
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity .55s ease, transform .55s ease';
  observer.observe(el);
});

// ── Back to top ──
const backToTopBtn = document.getElementById('backToTop');
function toggleBackToTop() {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Contact form (FormSubmit AJAX — message goes directly to email) ──
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim() || 'Portfolio Message';
    const message = document.getElementById('message').value.trim();

    submitBtn.disabled  = true;
    submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending…';

    // Build the email body so the full message lands in the inbox
    const payload = new FormData();
    payload.append('name',    name);
    payload.append('email',   email);
    payload.append('_subject', `[Portfolio] ${subject} — from ${name}`);
    payload.append('message', `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`);
    payload.append('_captcha', 'false');
    payload.append('_template', 'box');

    try {
      await fetch('https://formsubmit.co/ajax/officialbhautikkorat@gmail.com', {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    payload,
      });
      contactForm.reset();
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    } catch (_) {
      contactForm.reset();
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    } finally {
      submitBtn.disabled  = false;
      submitBtn.innerHTML = 'Send Message <i class="bx bx-send"></i>';
    }
  });
}

// ── Smooth scroll for internal anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

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

    if (!name || !email || !message) return;

    submitBtn.disabled  = true;
    submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending…';

    const payload = new FormData();
    payload.append('fullname',  name);
    payload.append('email',     email);
    payload.append('subject',   subject);
    payload.append('message',   message);
    payload.append('_subject',  `[Portfolio] ${subject} — from ${name}`);
    payload.append('_captcha',  'false');
    payload.append('_template', 'box');

    try {
      const res = await fetch('https://formsubmit.co/ajax/officialbhautikkorat@gmail.com', {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    payload,
      });

      const data = await res.json();

      if (res.ok && data.success === 'true') {
        contactForm.reset();
        formSuccess.querySelector('span').textContent = 'Message sent! I\'ll get back to you soon.';
        formSuccess.style.background = '#dcfce7';
        formSuccess.style.color      = '#166534';
        formSuccess.style.border     = '1px solid #86efac';
      } else {
        formSuccess.querySelector('span').textContent = 'Something went wrong. Please email directly!';
        formSuccess.style.background = '#fef3c7';
        formSuccess.style.color      = '#92400e';
        formSuccess.style.border     = '1px solid #f59e0b';
      }
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);

    } catch (_) {
      formSuccess.querySelector('span').textContent = 'Network error. Try emailing directly!';
      formSuccess.style.background = '#fee2e2';
      formSuccess.style.color      = '#991b1b';
      formSuccess.style.border     = '1px solid #fca5a5';
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

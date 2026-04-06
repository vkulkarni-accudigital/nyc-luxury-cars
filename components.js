/* =========================================================================
   NYC. EXOTIC — Shared Components
   Injects nav and footer into every page
   ========================================================================= */

const SERVICES = [
  { label: 'Exotic Rental',       href: 'rental.html',       desc: 'Drive the world\'s finest machines' },
  { label: 'White-Glove Delivery',href: 'delivery.html',     desc: 'Your vehicle, delivered in style'   },
  { label: 'Pre-Owned Vehicles',  href: 'acquisition.html',  desc: 'Authenticated luxury collection'    },
  { label: 'Auto Repair',         href: 'repair.html',       desc: 'Specialist exotic technicians'      },
  { label: 'GPS & Dash Cam',      href: 'intelligence.html', desc: 'Certified, discreet installations'  },
  { label: 'Emergency Towing',    href: 'towing.html',       desc: '24/7 citywide response'             },
];

function buildNav() {
  const dropdownLinks = SERVICES.map(s =>
    `<a href="${s.href}" class="dropdown-link" data-page="${s.href}">${s.label}</a>`
  ).join('');

  return `
<nav class="nav" id="main-nav">
  <div class="nav-container">
    <a class="nav-logo" href="index.html" data-page="index.html">NYC. EXOTIC</a>

    <div class="nav-center">
      <div class="nav-dropdown">
        <button class="nav-link nav-dropdown-trigger" id="dropdown-trigger"
                aria-haspopup="true" aria-expanded="false">
          Services <span class="arrow">&#9660;</span>
        </button>
        <div class="dropdown-panel" id="dropdown-panel" role="menu">
          ${dropdownLinks}
        </div>
      </div>
      <a class="nav-link" href="rental.html"      data-page="rental.html">Fleet</a>
      <a class="nav-link" href="acquisition.html" data-page="acquisition.html">Acquire</a>
      <a class="nav-link" href="contact.html"     data-page="contact.html">Contact</a>
    </div>

    <div class="nav-right">
      <a class="btn btn-gold" href="contact.html">Book Now</a>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>

<div class="mobile-nav" id="mobile-nav" aria-hidden="true">
  <a href="index.html">Home</a>
  ${SERVICES.map(s => `<a href="${s.href}">${s.label}</a>`).join('')}
  <a href="contact.html">Contact</a>
  <a class="btn btn-gold" href="contact.html">Book Now</a>
</div>
  `.trim();
}

function buildFooter() {
  const serviceLinks = SERVICES.map(s =>
    `<a href="${s.href}">${s.label}</a>`
  ).join('');

  return `
<div class="container">
  <div class="footer-grid">
    <div class="footer-brand-col">
      <div class="footer-logo">NYC. EXOTIC</div>
      <p class="footer-tagline">New York's complete automotive atelier. Six disciplines. One uncompromising standard.</p>
    </div>
    <div class="footer-col">
      <div class="footer-col-title">Services</div>
      ${serviceLinks}
    </div>
    <div class="footer-col">
      <div class="footer-col-title">Company</div>
      <a href="index.html">Home</a>
      <a href="acquisition.html">Inventory</a>
      <a href="contact.html">Contact</a>
    </div>
    <div class="footer-col">
      <div class="footer-col-title">Contact</div>
      <address>
        <p>New York City, NY</p>
        <p>+1 (212) 000-0000</p>
        <p>hello@nycexotic.com</p>
        <p style="margin-top:1rem;font-size:0.78rem;opacity:0.6">Available 24 / 7</p>
      </address>
    </div>
  </div>
  <div class="footer-bottom">
    <span class="footer-copyright">&copy; 2025 NYC. EXOTIC. All rights reserved.</span>
    <div class="footer-social">
      <a href="#">Instagram</a>
      <a href="#">LinkedIn</a>
    </div>
  </div>
</div>
  `.trim();
}

/* ---- Inject + initialise ---- */
document.addEventListener('DOMContentLoaded', () => {
  const navSlot    = document.getElementById('site-nav');
  const footerSlot = document.getElementById('site-footer');

  if (navSlot)    navSlot.innerHTML    = buildNav();
  if (footerSlot) footerSlot.innerHTML = buildFooter();

  // ---- Active page highlighting ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(el => {
    if (el.getAttribute('data-page') === currentPage) {
      el.classList.add('is-active');
    }
  });

  // ---- Nav scroll state ----
  const nav = document.getElementById('main-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // ---- Hamburger / mobile nav ----
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', open);
      mobileNav.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Services dropdown (click on mobile / keyboard) ----
  const trigger = document.getElementById('dropdown-trigger');
  const panel   = document.getElementById('dropdown-panel');

  if (trigger && panel) {
    // Toggle on click (keyboard & touch)
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!open));
      trigger.closest('.nav-dropdown').classList.toggle('is-open', !open);
    });

    // Close when clicking outside
    document.addEventListener('click', () => {
      trigger.setAttribute('aria-expanded', 'false');
      trigger.closest('.nav-dropdown')?.classList.remove('is-open');
    });
  }

  // ---- Smooth scroll for on-page anchors ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

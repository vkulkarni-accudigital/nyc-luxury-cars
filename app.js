/* =========================================================================
   NYC. EXOTIC — App JS
   GSAP scroll reveals + form handling
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Services accordion (no GSAP dependency) ----
  const accItems = document.querySelectorAll('[data-acc]');
  accItems.forEach(item => {
    const trigger = item.querySelector('.acc-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      accItems.forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.acc-trigger')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });

  // ---- Hero entrance (homepage only) ----
  const heroImg  = document.querySelector('.hero-img-col img');
  const heroText = document.querySelector('.hero-text-col');

  if (heroImg && heroText) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(heroImg,
      { scale: 1.08, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.6 }
    )
    .fromTo(heroText.querySelectorAll('.hero-eyebrow, .hero-title, .hero-desc, .hero-ctas, .hero-label'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
      '-=1.0'
    );
  }

  // ---- Page hero entrance (service pages) ----
  const pageHero = document.querySelector('.page-hero');
  if (pageHero) {
    gsap.fromTo(
      pageHero.querySelectorAll('.page-hero-breadcrumb, .page-hero h1, .page-hero-tagline'),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.3 }
    );
  }

  // ---- Generic scroll reveals ([data-reveal]) ----
  document.querySelectorAll('[data-reveal]').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 84%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ---- Staggered child reveals ([data-reveal-stagger]) ----
  document.querySelectorAll('[data-reveal-stagger]').forEach(parent => {
    const children = parent.querySelectorAll(':scope > *');
    gsap.fromTo(children,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: parent,
          start: 'top 82%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ---- Feature cards, process steps, other cards ----
  ['.features-grid', '.process-steps', '.other-cards', '.fleet-grid',
   '.inventory-grid', '.why-grid', '.packages-grid',
   '.marques-grid', '.coverage-grid', '.response-stats'
  ].forEach(selector => {
    document.querySelectorAll(selector).forEach(grid => {
      const items = grid.querySelectorAll(':scope > *');
      if (!items.length) return;
      gsap.fromTo(items,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  });

  // ---- Fleet featured image parallax ----
  const featuredImg = document.querySelector('.fleet-featured-img img');
  if (featuredImg) {
    gsap.to(featuredImg, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.fleet-featured',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

  // ---- Stats strip counter animation ----
  document.querySelectorAll('.stat-num').forEach(el => {
    const text = el.textContent.trim();
    // Only animate purely numeric values
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || text.includes('/') || text.includes('<')) return;

    const suffix = text.replace(/[0-9.]/g, '');
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: num,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = (Number.isInteger(num) ? Math.round(obj.val) : obj.val.toFixed(1)) + suffix;
          }
        });
      }
    });
  });

  // ---- Emergency phone link pulse (towing page) ----
  const emergencyPhone = document.querySelector('.emergency-phone');
  if (emergencyPhone) {
    gsap.fromTo(emergencyPhone,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.4)', delay: 0.5 }
    );
  }

  // ---- Basic form submit handler ----
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const required = form.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderBottomColor = '#e05050';
          field.addEventListener('input', () => {
            field.style.borderBottomColor = '';
          }, { once: true });
        }
      });

      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.textContent = 'Sent. We will be in touch.';
          btn.disabled = true;
          btn.style.background = '#3a8a5a';
          btn.style.color = '#fff';
        }
      }
    });
  });

});

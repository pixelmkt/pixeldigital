// main.js — PIXEL Premium Interactions & Animations
document.addEventListener('DOMContentLoaded', () => {

  /* ========== Floating Dots Background ========== */
  const floatingDotsHTML = document.querySelector('.floating-dots');
  if (!floatingDotsHTML) {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'floating-dots';
    dotsContainer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement('div');
      dot.className = 'floating-dot';
      dotsContainer.appendChild(dot);
    }
    document.body.prepend(dotsContainer);
  }

  /* ========== Header Scroll Effect ========== */
  const header = document.querySelector('header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  /* ========== Mobile Menu (Animated) ========== */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    // Remove the 'hidden' class so CSS max-height animation controls visibility
    mobileMenu.classList.remove('hidden');

    mobileMenuBtn.onclick = () => {
      const isOpen = mobileMenu.classList.toggle('menu-open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);

      // Animate hamburger icon
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      }
    };
  }

  /* ========== GSAP Animations (Premium) ========== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance timeline
    const heroHeadline = document.querySelector('.hero-headline, section:first-of-type .headline');
    const heroSubtext = document.querySelector('.hero-subtext, section:first-of-type p');
    const heroCTA = document.querySelector('.hero-cta, section:first-of-type .btn');

    if (heroHeadline) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(heroHeadline, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
        .fromTo(heroSubtext, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
        .fromTo(heroCTA, { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.6 }, '-=0.3');
    }

    // Service cards stagger
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length) {
      gsap.fromTo(serviceCards,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: serviceCards[0]?.closest('section') || serviceCards[0],
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Process cards stagger
    const processCards = document.querySelectorAll('.process-card');
    if (processCards.length) {
      gsap.fromTo(processCards,
        { y: 40, opacity: 0, rotateX: 10 },
        {
          y: 0, opacity: 1, rotateX: 0, duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: processCards[0]?.closest('section') || processCards[0],
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // KPI cards
    const kpiCards = document.querySelectorAll('.kpi-card');
    if (kpiCards.length) {
      gsap.fromTo(kpiCards,
        { y: 35, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: kpiCards[0]?.closest('section') || kpiCards[0],
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Project sections
    const projectSections = document.querySelectorAll('.space-y-24 > section');
    projectSections.forEach(sec => {
      const img = sec.querySelector('.project-img-wrap, img');
      const text = sec.querySelector('div:not(.project-img-wrap)');

      if (img && text) {
        gsap.fromTo(img,
          { x: -60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: sec, start: 'top 75%', toggleActions: 'play none none none' }
          }
        );
        gsap.fromTo(text,
          { x: 60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: sec, start: 'top 75%', toggleActions: 'play none none none' }
          }
        );
      }
    });

    // Generic scroll-reveal with GSAP
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      if (!el.closest('.space-y-24') && !el.classList.contains('service-card') && !el.classList.contains('process-card') && !el.classList.contains('kpi-card')) {
        gsap.fromTo(el, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
      }
    });

  } else {
    // Fallback: IntersectionObserver
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible'));
    }, { threshold: 0.1 });
    document.querySelectorAll('.scroll-reveal').forEach(el => io.observe(el));
  }

  /* ========== Animated Number Counters ========== */
  const animateCounter = (element) => {
    const target = element.getAttribute('data-count');
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const decimals = (target.includes('.')) ? target.split('.')[1].length : 0;
    const targetNum = parseFloat(target);
    const duration = 2000;
    const startTime = performance.now();

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = (targetNum * easedProgress).toFixed(decimals);
      element.textContent = prefix + currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
  };

  const counterElements = document.querySelectorAll('[data-count]');
  if (counterElements.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  /* ========== Google Drive Image Loading (Enhanced) ========== */
  const loadDriveImage = (img, id) => {
    // Show loading state
    img.style.background = 'linear-gradient(135deg, #E8E4DB 0%, #D4CFBF 100%)';
    img.style.minHeight = '200px';
    img.alt = img.alt || 'Proyecto';

    const candidates = [
      `https://lh3.googleusercontent.com/d/${id}=w1200`,
      `https://drive.google.com/thumbnail?id=${id}&sz=w1200`,
      `https://drive.google.com/uc?export=view&id=${id}`,
      `https://drive.google.com/uc?export=download&id=${id}`,
      `https://lh3.googleusercontent.com/d/${id}=w2000`,
      `https://drive.google.com/thumbnail?id=${id}&sz=w2000`
    ];
    let i = 0;
    const tryNext = () => {
      if (i < candidates.length) {
        img.src = candidates[i++];
      } else {
        // All failed — show a styled fallback
        img.removeEventListener('error', tryNext);
        img.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.style.cssText = `
          width:100%;min-height:${img.classList.contains('carousel-img') ? '22rem' : '24rem'};
          background:linear-gradient(135deg,#2D1B16 0%,#1E1E1E 100%);
          border-radius:12px;display:flex;align-items:center;justify-content:center;
          color:rgba(245,241,232,0.4);font-family:'IBM Plex Mono',monospace;font-size:0.85rem;
          text-align:center;padding:2rem;letter-spacing:0.05em;
        `;
        fallback.innerHTML = `<div><i class="fas fa-image" style="font-size:2rem;margin-bottom:0.75rem;display:block;opacity:0.3;"></i>${img.alt}</div>`;
        img.parentNode.insertBefore(fallback, img);
      }
    };
    img.addEventListener('error', tryNext);
    img.onload = () => { img.style.background = 'none'; };
    tryNext();
  };

  document.querySelectorAll('img[data-drive-id]').forEach(img => {
    const id = img.getAttribute('data-drive-id');
    if (id) loadDriveImage(img, id);
  });

  /* ========== Carousel with Auto-play & Dots ========== */
  const viewport = document.querySelector('[data-carousel]');
  if (viewport) {
    const leftBtn = document.querySelector('[data-carousel-left]');
    const rightBtn = document.querySelector('[data-carousel-right]');
    const items = viewport.querySelectorAll('.carousel-item');
    const scrollAmount = () => Math.max(320, Math.floor(viewport.clientWidth * 0.9));

    if (leftBtn) leftBtn.addEventListener('click', () => viewport.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    if (rightBtn) rightBtn.addEventListener('click', () => viewport.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));

    // Create dots
    const dotsContainer = document.querySelector('.carousel-dots');
    if (dotsContainer && items.length > 0) {
      items.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Ir al slide ${idx + 1}`);
        dot.addEventListener('click', () => {
          items[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
        dotsContainer.appendChild(dot);
      });
    }

    // Update active dot on scroll
    const dots = document.querySelectorAll('.carousel-dot');
    if (dots.length) {
      viewport.addEventListener('scroll', () => {
        const scrollLeft = viewport.scrollLeft;
        const itemWidth = items[0]?.offsetWidth || 300;
        const activeIndex = Math.round(scrollLeft / (itemWidth + 16)); // 16 = gap
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === activeIndex);
        });
      }, { passive: true });
    }

    // Auto-play
    let autoPlayInterval;
    const startAutoPlay = () => {
      autoPlayInterval = setInterval(() => {
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        if (viewport.scrollLeft >= maxScroll - 10) {
          viewport.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          viewport.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
        }
      }, 5000);
    };
    const stopAutoPlay = () => clearInterval(autoPlayInterval);

    startAutoPlay();
    viewport.addEventListener('mouseenter', stopAutoPlay);
    viewport.addEventListener('mouseleave', startAutoPlay);
    viewport.addEventListener('touchstart', stopAutoPlay, { passive: true });
    viewport.addEventListener('touchend', () => setTimeout(startAutoPlay, 3000), { passive: true });

    // Drag with mouse
    let isDown = false, startX = 0, startLeft = 0;
    viewport.addEventListener('mousedown', (e) => {
      isDown = true; startX = e.pageX; startLeft = viewport.scrollLeft;
      viewport.classList.add('dragging');
      stopAutoPlay();
    });
    window.addEventListener('mouseup', () => {
      if (isDown) { isDown = false; viewport.classList.remove('dragging'); }
    });
    viewport.addEventListener('mouseleave', () => { isDown = false; viewport.classList.remove('dragging'); });
    viewport.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      viewport.scrollLeft = startLeft - (e.pageX - startX) * 1.2;
    });
    viewport.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        viewport.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }

  /* ========== Contact Form ========== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formStatus = document.getElementById('form-status');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      // Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      }
      formStatus.textContent = '';

      const formData = new FormData(contactForm);
      try {
        const res = await fetch(contactForm.action, {
          method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          formStatus.style.color = 'var(--verde-feedback)';
          formStatus.innerHTML = '<i class="fas fa-check-circle"></i> ¡Mensaje enviado con éxito!';
          contactForm.reset();

          // Success animation
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(formStatus, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
          }
        } else {
          formStatus.style.color = 'var(--rojo-feedback)';
          formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Hubo un error al enviar.';
        }
      } catch (err) {
        formStatus.style.color = 'var(--rojo-feedback)';
        formStatus.innerHTML = '<i class="fas fa-wifi"></i> Error de red.';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar Mensaje';
        }
      }
    });
  }

  /* ========== Smooth Scroll for Anchor Links ========== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
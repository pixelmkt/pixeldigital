// main.js — PIXEL Premium Interactions, 3D Effects & Code Rain
document.addEventListener('DOMContentLoaded', () => {

  /* ========== CODE RAIN (Matrix Effect) ========== */
  const initCodeRain = () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'code-rain-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.random() * -100);

    // Characters: binary + code symbols
    const chars = '01{}[]<>/\\;:=+-*&|!@#$%^~`const let var function return if else for while async await import export class new this void null undefined true false'.split('');

    const draw = () => {
      // Semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(245, 241, 232, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'IBM Plex Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Gradient from red to orange to faded
        const progress = (drops[i] % 30) / 30;
        if (progress < 0.3) {
          ctx.fillStyle = 'rgba(198, 52, 30, 0.9)';  // Bright red head
        } else if (progress < 0.6) {
          ctx.fillStyle = 'rgba(255, 77, 0, 0.6)';   // Orange mid
        } else {
          ctx.fillStyle = 'rgba(198, 52, 30, 0.25)';  // Faded tail
        }

        ctx.fillText(char, x, y);

        // Reset drop when it reaches bottom + random delay
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
      }

      requestAnimationFrame(draw);
    };

    draw();
  };

  initCodeRain();

  /* ========== 3D FLOATING SHAPES ========== */
  const initShapes3D = () => {
    const existing = document.querySelector('.shapes-3d');
    if (existing) return;

    const container = document.createElement('div');
    container.className = 'shapes-3d';
    container.setAttribute('aria-hidden', 'true');

    const shapes = [
      // Cubes
      { type: 'cube' },
      { type: 'cube' },
      // Diamonds
      { type: 'diamond' },
      { type: 'diamond' },
      // Rings
      { type: 'ring' },
      { type: 'ring' },
      // More cubes
      { type: 'cube' },
      { type: 'diamond' },
    ];

    shapes.forEach(s => {
      const el = document.createElement('div');
      el.className = 'shape-3d';

      if (s.type === 'cube') {
        const cube = document.createElement('div');
        cube.className = 'shape-cube';
        ['front', 'back', 'right', 'left', 'top', 'bottom'].forEach(face => {
          const f = document.createElement('div');
          f.className = `face face-${face}`;
          cube.appendChild(f);
        });
        el.appendChild(cube);
      } else if (s.type === 'diamond') {
        const diamond = document.createElement('div');
        diamond.className = 'shape-diamond';
        for (let i = 0; i < 4; i++) {
          const f = document.createElement('div');
          f.className = 'face';
          diamond.appendChild(f);
        }
        el.appendChild(diamond);
      } else {
        const ring = document.createElement('div');
        ring.className = 'shape-ring';
        el.appendChild(ring);
      }

      container.appendChild(el);
    });

    document.body.prepend(container);
  };

  initShapes3D();

  /* ========== 3D TILT CARD SYSTEM ========== */
  const initTilt = () => {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    if (!tiltElements.length) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile) return;

    tiltElements.forEach(el => {
      let rafId = null;

      el.addEventListener('mousemove', (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const maxTilt = parseFloat(el.getAttribute('data-tilt-max') || '8');
          const rotateX = ((centerY - y) / centerY) * maxTilt;
          const rotateY = ((x - centerX) / centerX) * maxTilt;

          el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
      });

      el.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        el.style.transition = 'transform 0.5s ease-out';
        setTimeout(() => { el.style.transition = 'transform 0.15s ease-out'; }, 500);
      });

      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.15s ease-out';
      });
    });
  };

  initTilt();

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
    mobileMenu.classList.remove('hidden');
    
    mobileMenuBtn.onclick = () => {
      const isOpen = mobileMenu.classList.toggle('menu-open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      }
    };
  }

  /* ========== GSAP Animations (Premium 3D) ========== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance timeline with 3D
    const heroHeadline = document.querySelector('.hero-headline, section:first-of-type .headline');
    const heroSubtext = document.querySelector('.hero-subtext, section:first-of-type p');
    const heroCTA = document.querySelector('.hero-cta, section:first-of-type .btn');
    
    if (heroHeadline) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(heroHeadline, 
        { y: 80, opacity: 0, rotateX: 15 }, 
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, transformPerspective: 1000 }
      )
      .fromTo(heroSubtext, 
        { y: 50, opacity: 0, rotateX: 10 }, 
        { y: 0, opacity: 1, rotateX: 0, duration: 0.9, transformPerspective: 1000 }, '-=0.6'
      )
      .fromTo(heroCTA, 
        { y: 40, opacity: 0, scale: 0.9 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.7 }, '-=0.4'
      );
    }

    // Service cards stagger with 3D
    const serviceCards = document.querySelectorAll('.service-card, .service-card-extended');
    if (serviceCards.length) {
      gsap.fromTo(serviceCards, 
        { y: 60, opacity: 0, rotateX: 12, transformPerspective: 1000 }, 
        {
          y: 0, opacity: 1, rotateX: 0, duration: 0.8,
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

    // Process cards stagger with 3D flip
    const processCards = document.querySelectorAll('.process-card');
    if (processCards.length) {
      gsap.fromTo(processCards, 
        { y: 50, opacity: 0, rotateY: 15, transformPerspective: 1200 }, 
        {
          y: 0, opacity: 1, rotateY: 0, duration: 0.7,
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

    // KPI cards with 3D scale pop
    const kpiCards = document.querySelectorAll('.kpi-card');
    if (kpiCards.length) {
      gsap.fromTo(kpiCards, 
        { y: 40, opacity: 0, scale: 0.85, rotateX: 20, transformPerspective: 800 }, 
        {
          y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: kpiCards[0]?.closest('section') || kpiCards[0],
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Industry cards with 3D
    const industryCards = document.querySelectorAll('.industry-card');
    if (industryCards.length) {
      gsap.fromTo(industryCards,
        { y: 60, opacity: 0, rotateY: -20, transformPerspective: 1200 },
        {
          y: 0, opacity: 1, rotateY: 0, duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: industryCards[0]?.closest('section') || industryCards[0],
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Testimonial cards with 3D
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length) {
      gsap.fromTo(testimonialCards,
        { y: 50, opacity: 0, rotateX: 10, transformPerspective: 1000 },
        {
          y: 0, opacity: 1, rotateX: 0, duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: testimonialCards[0]?.closest('section') || testimonialCards[0],
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Project sections with 3D slide
    const projectSections = document.querySelectorAll('.space-y-24 > section');
    projectSections.forEach(sec => {
      const img = sec.querySelector('.project-img-wrap, img, a.block');
      const text = sec.querySelector('div:not(.project-img-wrap):not(a)');
      
      if (img && text) {
        gsap.fromTo(img, 
          { x: -80, opacity: 0, rotateY: 8, transformPerspective: 1200 }, 
          {
            x: 0, opacity: 1, rotateY: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: sec, start: 'top 75%', toggleActions: 'play none none none' }
          }
        );
        gsap.fromTo(text, 
          { x: 80, opacity: 0, rotateY: -8, transformPerspective: 1200 }, 
          {
            x: 0, opacity: 1, rotateY: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: sec, start: 'top 75%', toggleActions: 'play none none none' }
          }
        );
      }
    });

    // Portfolio cards with 3D
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    if (portfolioCards.length) {
      gsap.fromTo(portfolioCards,
        { y: 50, opacity: 0, rotateX: 8, scale: 0.95, transformPerspective: 1000 },
        {
          y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: portfolioCards[0]?.closest('.portfolio-grid') || portfolioCards[0],
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Generic scroll-reveal with GSAP 3D
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      if (!el.closest('.space-y-24') && !el.classList.contains('service-card') && !el.classList.contains('process-card') && !el.classList.contains('kpi-card')) {
        gsap.fromTo(el, { y: 45, opacity: 0 }, {
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

  /* ========== Google Drive Image Loading ========== */
  const loadDriveImage = (img, id) => {
    const candidates = [
      `https://drive.google.com/uc?export=download&id=${id}`,
      `https://drive.google.com/uc?export=view&id=${id}`,
      `https://drive.google.com/thumbnail?id=${id}&sz=w2000`,
      `https://lh3.googleusercontent.com/d/${id}=w2000`
    ];
    let i = 0;
    const tryNext = () => {
      if (i < candidates.length) {
        img.src = candidates[i++];
      } else {
        img.removeEventListener('error', tryNext);
      }
    };
    img.addEventListener('error', tryNext);
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
        const activeIndex = Math.round(scrollLeft / (itemWidth + 16));
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
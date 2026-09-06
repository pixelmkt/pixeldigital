// main.js — Pixel Digital
// Motor de movimiento. Tres caminos, y el CSS sabe cuál corre:
//   html.gsap  -> GSAP anima con estilos en línea (texto enmascarado, barridos,
//                 parallax con scrub, inercia de scroll con Lenis).
//   html.io    -> sin GSAP: IntersectionObserver + clase is-visible.
//   ninguno    -> sin JS o con "menos movimiento" pedido: todo visible, quieto.
// Regla: nada de lo que se anima puede quedar invisible si algo falla.

document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  // ?motion=1 fuerza la ruta con movimiento (solo para probar en paneles que
  // tienen "reducir movimiento" activo). ?motion=0 fuerza la estática.
  const forzar = new URLSearchParams(location.search).get('motion');
  const menosMovimiento = forzar === '1' ? false : forzar === '0' ? true
    : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hayGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  /* ========== Cabecera: filete al hacer scroll ========== */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ========== Menú móvil a pantalla completa ========== */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenu.classList.remove('hidden');
    const icon = mobileMenuBtn.querySelector('i');
    const cerrar = () => {
      mobileMenu.classList.remove('menu-open');
      html.classList.remove('menu-abierto');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      if (icon) icon.className = 'fas fa-bars';
    };
    mobileMenuBtn.onclick = () => {
      const abierto = mobileMenu.classList.toggle('menu-open');
      html.classList.toggle('menu-abierto', abierto);
      mobileMenuBtn.setAttribute('aria-expanded', String(abierto));
      if (icon) icon.className = abierto ? 'fas fa-times' : 'fas fa-bars';
    };
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrar));
    // Cierra con Escape, o tocando el fondo del menú (fuera de los enlaces).
    window.addEventListener('keydown', e => { if (e.key === 'Escape' || e.keyCode === 27) cerrar(); }, true);
    mobileMenu.addEventListener('click', e => { if (e.target === mobileMenu) cerrar(); });
  }

  /* ========== Línea de progreso de lectura ========== */
  const leido = document.createElement('div');
  leido.className = 'leido';
  leido.setAttribute('aria-hidden', 'true');
  document.body.prepend(leido);
  const pintarProgreso = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    leido.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
  };
  window.addEventListener('scroll', pintarProgreso, { passive: true });
  pintarProgreso();

  /* ========== Partir el titular en palabras enmascaradas ========== */
  // Devuelve los .w-in creados. Respeta los <span> (p. ej. .text-highlight)
  // como una sola unidad, y deja los <br> donde están.
  function enmascarar(el) {
    if (!el || el.dataset.enmascarado) return [];
    const original = el.textContent.replace(/\s+/g, ' ').trim();
    const partes = [];
    const envolver = (nodo) => {
      const w = document.createElement('span'); w.className = 'w';
      const inn = document.createElement('span'); inn.className = 'w-in';
      inn.appendChild(nodo); w.appendChild(inn); partes.push(inn); return w;
    };
    const hijos = Array.from(el.childNodes);
    el.textContent = '';
    hijos.forEach(n => {
      if (n.nodeType === Node.TEXT_NODE) {
        n.textContent.split(/(\s+)/).forEach(tok => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { el.appendChild(document.createTextNode(' ')); return; }
          el.appendChild(envolver(document.createTextNode(tok)));
        });
      } else if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'BR') {
        el.appendChild(n);
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        el.appendChild(envolver(n));
      }
    });
    el.setAttribute('aria-label', original);
    el.querySelectorAll('.w').forEach(w => w.setAttribute('aria-hidden', 'true'));
    el.dataset.enmascarado = '1';
    return partes;
  }

  if (menosMovimiento) {
    // Nada se mueve. El CSS ya deja todo visible.
  } else if (hayGsap) {
    html.classList.add('gsap');
    gsap.registerPlugin(ScrollTrigger);

    /* ---- Inercia de scroll (Lenis) — opcional, si cargó ---- */
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      html.classList.add('lenis');
      // Los anclas internas pasan por Lenis para que no salten.
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
          const t = document.querySelector(a.getAttribute('href'));
          if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80 }); }
        });
      });
    }

    const EASE = 'expo.out';

    /* ---- Portada: eyebrow → titular por palabras → bajada → botones ---- */
    const hero = document.querySelector('main > section:first-of-type, .lp-hero');
    if (hero) {
      const h1 = hero.querySelector('h1');
      const eyebrow = hero.querySelector('.k, .eyebrow, .sus-eyebrow, .ad-eyebrow, .lp-badge');
      const bajada = hero.querySelector('p:not(.k):not(.eyebrow):not(.sus-eyebrow):not(.ad-eyebrow)');
      const botones = hero.querySelectorAll('.btn');
      const visual = hero.querySelector('.fono, .wdg, .photo, .hero-visual');
      const palabras = enmascarar(h1);

      const tl = gsap.timeline({ defaults: { ease: EASE } });
      if (eyebrow) tl.fromTo(eyebrow, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }, 0);
      if (palabras.length) tl.to(palabras, { y: 0, duration: 1.1, stagger: .045 }, .1);
      if (bajada) tl.fromTo(bajada, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, '-=.7');
      if (botones.length) tl.fromTo(botones, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .08 }, '-=.55');
      if (visual) tl.fromTo(visual, { y: 30, opacity: 0, scale: .98 }, { y: 0, opacity: 1, scale: 1, duration: 1 }, '-=.9');

      // Parallax leve del titular al bajar (solo escritorio).
      ScrollTrigger.matchMedia({
        '(min-width: 1024px)': () => {
          if (h1) gsap.to(h1, { y: -60, ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
        }
      });
    }

    /* ---- Títulos de sección: por palabras al entrar ---- */
    document.querySelectorAll('main h2.headline, .lp-section-title, .lp-hero-title, .cta-section .headline')
      .forEach(h => {
        if (hero && hero.contains(h)) return;
        const palabras = enmascarar(h);
        if (!palabras.length) return;
        gsap.to(palabras, { y: 0, duration: .9, ease: EASE, stagger: .035,
          scrollTrigger: { trigger: h, start: 'top 88%', toggleActions: 'play none none none' } });
      });

    /* ---- Imágenes: barrido de izquierda a derecha + zoom que se asienta ---- */
    document.querySelectorAll('.carousel-item, .project-img-wrap, .case-img-wrap, .abre-img')
      .forEach((box, i) => {
        box.classList.add('abre');
        const img = box.querySelector('img');
        gsap.to(box, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: EASE, delay: (i % 4) * .08,
          scrollTrigger: { trigger: box, start: 'top 88%', toggleActions: 'play none none none' } });
        if (img) gsap.to(img, { scale: 1, duration: 1.4, ease: EASE, delay: (i % 4) * .08,
          scrollTrigger: { trigger: box, start: 'top 88%', toggleActions: 'play none none none' } });
      });

    /* ---- Filas y bloques: entran en escalera ---- */
    const grupos = [
      '.kpi-card', '.idx li', '.process-card', '.service-card', '.service-card-extended',
      '.testimonial-card', '.lp-metric-card', '.lp-diff-card', '.ad-block', '.sus-block',
      '.paso', '.gate', '.faq details', '.precio-fila', '.fila', '.portfolio-card'
    ];
    grupos.forEach(sel => {
      const els = Array.from(document.querySelectorAll(sel));
      if (!els.length) return;
      // Agrupar por padre para que la escalera sea por bloque, no global.
      const porPadre = new Map();
      els.forEach(el => { const p = el.parentElement; if (!porPadre.has(p)) porPadre.set(p, []); porPadre.get(p).push(el); });
      porPadre.forEach(lista => {
        gsap.fromTo(lista, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .75, ease: EASE, stagger: .07,
          scrollTrigger: { trigger: lista[0], start: 'top 90%', toggleActions: 'play none none none' } });
      });
    });

    /* ---- Lo demás con scroll-reveal: sutil ---- */
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      if (el.matches(grupos.join(',')) || el.querySelector('h1, h2.headline')) return;
      if (hero && hero.contains(el)) return;
      gsap.fromTo(el, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' } });
    });

    /* ---- La cinta tipográfica acelera con la velocidad del scroll ---- */
    const cinta = document.querySelector('.cinta__t');
    if (cinta) {
      let vel = 0;
      const fuente = lenis ? (cb) => lenis.on('scroll', ({ velocity }) => cb(velocity)) :
        (cb) => { let ult = window.scrollY; window.addEventListener('scroll', () => { cb(window.scrollY - ult); ult = window.scrollY; }, { passive: true }); };
      fuente(v => { vel = Math.min(6, Math.abs(v) / 12); });
      gsap.ticker.add(() => {
        const rate = 1 + vel;
        cinta.style.animationDuration = (34 / rate) + 's';
        vel *= .92;
      });
    }

    /* ---- Barras de métrica (caso de estudio) ---- */
    document.querySelectorAll('.lp-metric-bar-fill[data-width]').forEach(bar => {
      gsap.to(bar, { width: bar.dataset.width, duration: 1.3, ease: EASE,
        scrollTrigger: { trigger: bar, start: 'top 92%', toggleActions: 'play none none none' } });
    });

  } else {
    html.classList.add('io');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible'));
    }, { threshold: 0.1 });
    document.querySelectorAll('.scroll-reveal').forEach(el => io.observe(el));
  }

  /* ========== Contadores ========== */
  const pageLoadTs = performance.now();
  const formatCount = (el) => {
    const t = el.getAttribute('data-count'), pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    const dec = t.includes('.') ? t.split('.')[1].length : 0;
    return pre + parseFloat(t).toFixed(dec) + suf;
  };
  const animateCounter = (el) => {
    const t = el.getAttribute('data-count'), pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    const dec = t.includes('.') ? t.split('.')[1].length : 0, num = parseFloat(t), dur = 1600, t0 = performance.now();
    const ease = (x) => 1 - Math.pow(1 - x, 4);
    const paso = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = pre + (num * ease(p)).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };
  const contadores = document.querySelectorAll('[data-count]');
  if (contadores.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          const visibleAlCargar = (performance.now() - pageLoadTs) < 200;
          if (menosMovimiento || visibleAlCargar) entry.target.textContent = formatCount(entry.target);
          else animateCounter(entry.target);
        }
      });
    }, { threshold: 0.3 });
    contadores.forEach(el => obs.observe(el));
  }

  /* ========== Carrusel ========== */
  const viewport = document.querySelector('[data-carousel]');
  if (viewport) {
    const leftBtn = document.querySelector('[data-carousel-left]');
    const rightBtn = document.querySelector('[data-carousel-right]');
    const items = viewport.querySelectorAll('.carousel-item');
    const paso = () => Math.max(320, Math.floor(viewport.clientWidth * 0.9));
    if (leftBtn) leftBtn.addEventListener('click', () => viewport.scrollBy({ left: -paso(), behavior: 'smooth' }));
    if (rightBtn) rightBtn.addEventListener('click', () => viewport.scrollBy({ left: paso(), behavior: 'smooth' }));

    const dotsContainer = document.querySelector('.carousel-dots');
    if (dotsContainer && items.length) {
      items.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Ir al trabajo ' + (idx + 1));
        dot.addEventListener('click', () => items[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }));
        dotsContainer.appendChild(dot);
      });
    }
    const dots = document.querySelectorAll('.carousel-dot');
    if (dots.length) {
      viewport.addEventListener('scroll', () => {
        const w = items[0]?.offsetWidth || 300;
        const i = Math.round(viewport.scrollLeft / (w + 16));
        dots.forEach((d, k) => d.classList.toggle('active', k === i));
      }, { passive: true });
    }

    let auto;
    const start = () => { if (menosMovimiento) return; auto = setInterval(() => {
      const max = viewport.scrollWidth - viewport.clientWidth;
      if (viewport.scrollLeft >= max - 10) viewport.scrollTo({ left: 0, behavior: 'smooth' });
      else viewport.scrollBy({ left: paso(), behavior: 'smooth' });
    }, 5000); };
    const stop = () => clearInterval(auto);
    start();
    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', start);
    viewport.addEventListener('touchstart', stop, { passive: true });
    viewport.addEventListener('touchend', () => setTimeout(start, 3000), { passive: true });

    let down = false, x0 = 0, l0 = 0;
    viewport.addEventListener('mousedown', (e) => { down = true; x0 = e.pageX; l0 = viewport.scrollLeft; viewport.classList.add('dragging'); stop(); });
    window.addEventListener('mouseup', () => { if (down) { down = false; viewport.classList.remove('dragging'); } });
    viewport.addEventListener('mouseleave', () => { down = false; viewport.classList.remove('dragging'); });
    viewport.addEventListener('mousemove', (e) => { if (!down) return; e.preventDefault(); viewport.scrollLeft = l0 - (e.pageX - x0) * 1.2; });
    viewport.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { viewport.scrollLeft += e.deltaY; e.preventDefault(); }
    }, { passive: false });
  }

  /* ========== Formulario de contacto ========== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formStatus = document.getElementById('form-status');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando…'; }
      if (formStatus) formStatus.textContent = '';
      try {
        const res = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm), headers: { 'Accept': 'application/json' } });
        if (formStatus) {
          formStatus.style.color = res.ok ? 'var(--verde-feedback)' : 'var(--rojo-feedback)';
          formStatus.textContent = res.ok ? 'Mensaje enviado. Te respondemos hoy.' : 'Hubo un error al enviar. Escríbenos por WhatsApp.';
        }
        if (res.ok) contactForm.reset();
      } catch (err) {
        if (formStatus) { formStatus.style.color = 'var(--rojo-feedback)'; formStatus.textContent = 'Error de red. Escríbenos por WhatsApp.'; }
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Enviar mensaje'; }
      }
    });
  }

  /* ========== Anclas (sin Lenis) ========== */
  if (!html.classList.contains('lenis')) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const t = document.querySelector(link.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: menosMovimiento ? 'auto' : 'smooth' }); }
      });
    });
  }
});

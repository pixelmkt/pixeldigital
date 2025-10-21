// main.js — Menú, animaciones, slider con flechas y carga robusta de imágenes de Google Drive
document.addEventListener('DOMContentLoaded', () => {
  /* ========== Menú móvil (MEJORADO CON ACCESIBILIDAD) ========== */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.onclick = () => {
      // Alternar la clase 'hidden'
      const isHidden = mobileMenu.classList.toggle('hidden');
      
      // (MEJORA A11y) Alternar el atributo aria-expanded para lectores de pantalla
      // 'true' significa que está expandido (visible), 'false' que está colapsado (oculto)
      mobileMenuBtn.setAttribute('aria-expanded', !isHidden);
    };
  }

  /* ========== Animaciones (GSAP si disponible; si no, IntersectionObserver) ========== */
  const runIO = () => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible'));
    }, { threshold: 0.1 });
    document.querySelectorAll('.scroll-reveal').forEach(el => io.observe(el));
  };
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      gsap.fromTo(el, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });
  } else {
    runIO();
  }

  /* ========== Carga robusta de imágenes de Google Drive ========== */
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

  /* ========== Slider con flechas (Home) ========== */
  const viewport = document.querySelector('[data-carousel]');
  if (viewport) {
    const leftBtn = document.querySelector('[data-carousel-left]');
    const rightBtn = document.querySelector('[data-carousel-right]');
    const scrollBy = () => Math.max(320, Math.floor(viewport.clientWidth * 0.9));

    if (leftBtn) leftBtn.addEventListener('click', () => viewport.scrollBy({ left: -scrollBy(), behavior: 'smooth' }));
    if (rightBtn) rightBtn.addEventListener('click', () => viewport.scrollBy({ left:  scrollBy(), behavior: 'smooth' }));

    // Drag con mouse/rueda
    let isDown = false, startX = 0, startLeft = 0;
    viewport.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX; startLeft = viewport.scrollLeft; viewport.classList.add('dragging'); });
    window.addEventListener('mouseup', () => { isDown = false; viewport.classList.remove('dragging'); });
    viewport.addEventListener('mouseleave', () => { isDown = false; viewport.classList.remove('dragging'); });
    viewport.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const walk = (e.pageX - startX) * 1.2;
      viewport.scrollLeft = startLeft - walk;
    });
    viewport.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        viewport.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }

  /* ========== Formulario de contacto (si existe) ========== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formStatus = document.getElementById('form-status');
      formStatus.textContent = 'Enviando...';
      const formData = new FormData(contactForm);
      try {
        const res = await fetch(contactForm.action, {
          method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          formStatus.style.color = 'var(--verde-feedback)';
          formStatus.textContent = '¡Mensaje enviado!';
          contactForm.reset();
        } else {
          formStatus.style.color = 'var(--rojo-feedback)';
          formStatus.textContent = 'Hubo un error al enviar.';
        }
      } catch (err) {
        formStatus.style.color = 'var(--rojo-feedback)';
        formStatus.textContent = 'Error de red.';
      }
    });
  }
});
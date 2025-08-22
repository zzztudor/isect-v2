

// js/faq.js
// Acordion FAQ cu ARIA + animație înălțime

(function () {
  const SELECTOR_Q = '.faq-q';
  const SELECTOR_A = '.faq-a';

  // Helper: animare height auto
  function animateHeight(el, open = true, duration = 200) {
    const start = el.offsetHeight;
    // Pregătește state-ul final pentru măsurare
    if (open) {
      el.style.display = 'block';
      el.style.height = 'auto';
    }
    const end = open ? el.offsetHeight : 0;

    // Setează înapoi height-ul inițial înainte de animare
    el.style.height = `${start}px`;
    el.offsetHeight; // reflow

    // Rulează tranziția
    el.style.transition = `height ${duration}ms ease`;
    el.style.height = `${end}px`;

    // Cleanup după tranziție
    const done = () => {
      el.style.transition = '';
      el.style.height = '';
      if (!open) el.style.display = 'none';
      el.removeEventListener('transitionend', done);
    };
    el.addEventListener('transitionend', done);
  }

  function closeAll(container, except = null) {
    container.querySelectorAll(SELECTOR_Q).forEach(q => {
      if (q === except) return;
      const a = q.nextElementSibling;
      if (!a || !a.matches(SELECTOR_A)) return;
      if (q.getAttribute('aria-expanded') === 'true') {
        q.setAttribute('aria-expanded', 'false');
        a.setAttribute('aria-hidden', 'true');
        a.classList.remove('open');
        animateHeight(a, false);
      }
    });
  }

  function initFAQ() {
    const containers = document.querySelectorAll('.faq');
    containers.forEach(faq => {
      faq.querySelectorAll(SELECTOR_Q).forEach((q, idx) => {
        const a = q.nextElementSibling;
        if (!a || !a.matches(SELECTOR_A)) return;

        // ARIA set-up
        const qId = q.id || `faq-q-${idx}`;
        const aId = a.id || `faq-a-${idx}`;
        q.id = qId;
        a.id = aId;
        q.setAttribute('role', 'button');
        q.setAttribute('aria-controls', aId);
        q.setAttribute('aria-expanded', a.classList.contains('open') ? 'true' : 'false');
        a.setAttribute('role', 'region');
        a.setAttribute('aria-labelledby', qId);
        a.setAttribute('aria-hidden', a.classList.contains('open') ? 'false' : 'true');

        // Stare inițială (ascuns dacă nu are .open)
        if (!a.classList.contains('open')) {
          a.style.display = 'none';
        }

        // Click handler
        q.addEventListener('click', () => {
          const isOpen = q.getAttribute('aria-expanded') === 'true';
          // Opțional: un singur item deschis – închide restul
          closeAll(faq, q);

          q.setAttribute('aria-expanded', String(!isOpen));
          a.setAttribute('aria-hidden', String(isOpen));
          a.classList.toggle('open', !isOpen);
          animateHeight(a, !isOpen);
        });

        // Toggle cu Enter/Space
        q.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            q.click();
          }
        });
        // Asigură focusabil
        if (!q.hasAttribute('tabindex')) q.setAttribute('tabindex', '0');
      });
    });
  }

  // Auto-init când DOM e gata
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
})();
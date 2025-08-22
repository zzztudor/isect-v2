// Injectează partials (header, footer, partners) + execută scripturile din ele
document.addEventListener('DOMContentLoaded', async () => {
  const nodes = document.querySelectorAll('[data-include]');
  await Promise.all([...nodes].map(async el => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url, { credentials: 'same-origin' });
      if (!res.ok) {
        console.error('Include failed (HTTP)', url, res.status, res.statusText);
        return;
      }
      const html = await res.text();
      el.innerHTML = html;

      // Rulează eventualele <script> din partial-ul încărcat
      const scripts = el.querySelectorAll('script');
      scripts.forEach(old => {
        const s = document.createElement('script');
        // Copiem tipul (ex: module)
        if (old.type) s.type = old.type;
        // Copiem orice atribut data-*
        [...old.attributes].forEach(attr => {
          if (!['type'].includes(attr.name)) s.setAttribute(attr.name, attr.value);
        });

        if (old.src) {
          // script extern - îl reatașăm în <head> pentru a se executa
          s.src = old.src;
          s.defer = true;
          document.head.appendChild(s);
        } else {
          // script inline - copiem conținutul
          s.textContent = old.textContent || '';
          document.head.appendChild(s);
        }
        // Eliminăm originalul (neexecutat)
        old.parentNode && old.parentNode.removeChild(old);
      });

      console.log('[include] loaded:', url);
    } catch (err) {
      console.error('Include failed for', url, err);
    }
  }));
});

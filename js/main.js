// Init AOS, dark mode, FAQ, year
function initAOS() {
  if (window.AOS) AOS.init({ once: true, duration: 600 });
}

function restoreTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.documentElement.classList.add("dark");
}

function bindThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      root.classList.contains("dark") ? "dark" : "light"
    );
  });
}

// function bindFAQ removed to avoid duplicating FAQ logic; use faq.js for all FAQ interactions.

function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

// Simple debounce helper for scroll events
function debounce(fn, delay = 100) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(null, args), delay);
  };
}

// Mobile menu: expects a button with id="menuToggle" and a nav with class="nav-links"
function bindMobileMenu() {
  const btn = document.getElementById("menuToggle");
  const nav = document.querySelector(".nav .nav-links");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    nav.classList.toggle("open");
    btn.setAttribute(
      "aria-expanded",
      nav.classList.contains("open") ? "true" : "false"
    );
  });
  // Close menu when clicking a link (useful on mobile)
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

// Smooth scroll for on-page anchors
function bindSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });
}

// Highlight active section in nav on scroll (for sections with id)
function bindActiveSectionOnScroll() {
  const sections = [...document.querySelectorAll("section[id]")];
  const navLinks = [
    ...document.querySelectorAll('.nav .nav-links a[href^="#"]'),
  ];
  if (!sections.length || !navLinks.length) return;

  const map = new Map();
  navLinks.forEach((a) => {
    const id = a.getAttribute("href");
    const sec = document.querySelector(id);
    if (sec) map.set(sec, a);
  });

  const onScroll = () => {
    let current = null;
    const scrollY = window.scrollY + 120; // offset for sticky header
    for (const sec of sections) {
      const top = sec.offsetTop;
      if (top <= scrollY) current = sec;
    }
    navLinks.forEach((a) => a.classList.remove("active"));
    if (current && map.get(current)) {
      map.get(current).classList.add("active");
    }
  };

  window.addEventListener("scroll", debounce(onScroll, 50));
  onScroll();
}

document.addEventListener("DOMContentLoaded", () => {
  restoreTheme();
  initAOS();
  bindThemeToggle();
  // bindFAQ(); // removed; now handled by faq.js only
  setYear();
  bindMobileMenu();
  bindSmoothScroll();
  bindActiveSectionOnScroll();
});
// Slider echipă – scroll cu butoane
document.querySelectorAll(".team-slider").forEach((sl) => {
  const vp = sl.querySelector(".ts-viewport");
  const prev = sl.querySelector(".ts-prev");
  const next = sl.querySelector(".ts-next");
  const step = () => Math.max(260, Math.floor(vp.clientWidth * 0.9));

  prev?.addEventListener("click", () =>
    vp.scrollBy({ left: -step(), behavior: "smooth" })
  );
  next?.addEventListener("click", () =>
    vp.scrollBy({ left: step(), behavior: "smooth" })
  );

  // drag to scroll pe desktop
  let isDown = false,
    startX = 0,
    startLeft = 0;
  vp.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX;
    startLeft = vp.scrollLeft;
    vp.classList.add("drag");
  });
  window.addEventListener("mouseup", () => {
    isDown = false;
    vp.classList.remove("drag");
  });
  vp.addEventListener("mouseleave", () => {
    isDown = false;
    vp.classList.remove("drag");
  });
  vp.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    vp.scrollLeft = startLeft - (e.pageX - startX);
  });
}); // Slider Servicii – butoane și drag desktop
document.querySelectorAll(".srv-slider").forEach((sl) => {
  const vp = sl.querySelector(".srv-viewport");
  const prev = sl.querySelector(".srv-prev");
  const next = sl.querySelector(".srv-next");
  const step = () => Math.max(280, Math.floor(vp.clientWidth * 0.9));

  prev?.addEventListener("click", () =>
    vp.scrollBy({ left: -step(), behavior: "smooth" })
  );
  next?.addEventListener("click", () =>
    vp.scrollBy({ left: step(), behavior: "smooth" })
  );

  // drag to scroll (desktop)
  let down = false,
    sx = 0,
    sl0 = 0;
  vp.addEventListener("mousedown", (e) => {
    down = true;
    sx = e.pageX;
    sl0 = vp.scrollLeft;
    vp.classList.add("drag");
  });
  window.addEventListener("mouseup", () => {
    down = false;
    vp.classList.remove("drag");
  });
  vp.addEventListener("mouseleave", () => {
    down = false;
    vp.classList.remove("drag");
  });
  vp.addEventListener("mousemove", (e) => {
    if (!down) return;
    vp.scrollLeft = sl0 - (e.pageX - sx);
  });
});
function setWaveColor() {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue("--wave")
    .trim();
  const hex = color.startsWith("#") ? color.slice(1) : color; // transformă #rrggbb → rrggbb
  document.querySelectorAll(".footer-wave").forEach((el) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 100'><path fill='#${hex}' d='M0,32L120,42C240,52,480,72,720,72C960,72,1200,52,1440,32V100H0Z'/></svg>`;
    el.style.backgroundImage = `url("data:image/svg+xml;utf8,${svg}")`;
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundPosition = "center bottom";
    el.style.backgroundSize = "cover";
  });
}
setWaveColor();
const mql = window.matchMedia("(prefers-color-scheme: dark)");
if (mql.addEventListener) {
  mql.addEventListener("change", setWaveColor);
} else if (mql.addListener) {
  // Safari/old Chrome
  mql.addListener(setWaveColor);
}
(function () {
  "use strict";

  var FORM_ID = "contactForm";
  var NOTE_ID = "formNote";

  function $(id) {
    return document.getElementById(id);
  }

  function isEmail(v) {
    return /^\S+@\S+\.\S+$/.test(v);
  }

  function setNote(el, msg, cls) {
    if (!el) return;
    el.textContent = msg || "";
    el.className = "form-note" + (cls ? " " + cls : "");
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    var form = $(FORM_ID);
    if (!form) return;

    var note = $(NOTE_ID);

    var f = {
      name: form.elements["name"],
      email: form.elements["email"],
      message: form.elements["message"],
    };

    if (!f.name || !f.email || !f.message) {
      setNote(note, "Formularul nu are câmpurile necesare.", "err");
      return;
    }

    ["input", "change"].forEach(function (ev) {
      form.addEventListener(ev, function () {
        if (note && note.textContent) setNote(note, "");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameVal = (f.name.value || "").trim();
      var emailVal = (f.email.value || "").trim();
      var msgVal = (f.message.value || "").trim();
      var subjectVal = "";

      var subjectField = form.elements["subject"];
      if (subjectField) {
        subjectVal = (subjectField.value || "").trim();
      }

      if (!nameVal || !emailVal || !msgVal) {
        setNote(note, "Completează toate câmpurile, te rog.", "err");
        return;
      }

      if (!isEmail(emailVal)) {
        setNote(note, "Adresa de email pare invalidă.", "err");
        f.email.focus();
        return;
      }

      var formData = {
        name: nameVal,
        email: emailVal,
        subject: subjectVal,
        message: msgVal,
        timestamp: new Date().toISOString(),
        source: "contact-form",
      };

      setNote(note, "Se trimite mesajul...", "");

      fetch(
        "https://automation.webrest.net/webhook/c4867d45-8174-4939-bef0-889560ae1339",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      )
        .then(function (response) {
          if (response.ok) {
            setNote(
              note,
              "Mulțumim! Ți-am primit mesajul și revenim în scurt timp.",
              "ok"
            );
            form.reset();
          } else {
            throw new Error("Server error: " + response.status);
          }
        })
        .catch(function (error) {
          console.error("Form submission error:", error);
          setNote(
            note,
            "A apărut o eroare la trimitere. Încearcă din nou sau scrie-ne direct pe email.",
            "err"
          );
        });
    });
  });
})();

// === Slider Servicii (desktop-first) ===
(function () {
  const viewport = document.querySelector(".srv-viewport");
  const row = document.querySelector(".srv-row");
  const prev = document.querySelector(".srv-prev");
  const next = document.querySelector(".srv-next");

  // Rulează doar pe paginile care au slider
  if (!viewport || !row || !prev || !next) return;

  let x = 0; // poziția curentă
  let step = 0; // pasul la click
  let gapPx = 24; // fallback pentru gap

  function measure() {
    const firstCard = row.querySelector(".srv-card");
    if (firstCard) {
      const csRow = getComputedStyle(row);
      const cg = csRow.columnGap || csRow.gap || "24px";
      gapPx = parseFloat(cg) || 24;

      const cardW = firstCard.offsetWidth || 0;
      step = Math.max(cardW + gapPx, viewport.clientWidth * 0.6);
    } else {
      step = viewport.clientWidth * 0.6;
    }
  }

  function maxScroll() {
    return Math.max(0, row.scrollWidth - viewport.clientWidth);
  }

  function setX(value) {
    const m = maxScroll();
    x = Math.min(Math.max(0, value), m);
    row.style.transform = "translateX(" + -Math.round(x) + "px)";
  }

  function toggleNoScroll() {
    if (row.scrollWidth <= viewport.clientWidth + 1) {
      row.classList.add("no-scroll");
      setX(0);
    } else {
      row.classList.remove("no-scroll");
    }
  }

  function centerStart() {
    const m = maxScroll();
    if (m > 0) setX(m / 2);
    else setX(0);
  }

  function go(dir) {
    setX(x + dir * step);
  }

  function init() {
    measure();
    toggleNoScroll();
    centerStart();
  }

  prev.addEventListener("click", function () {
    go(-1);
  });
  next.addEventListener("click", function () {
    go(1);
  });

  let rAF;
  window.addEventListener("resize", function () {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(function () {
      measure();
      toggleNoScroll();
      setX(Math.min(x, maxScroll()));
    });
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(); // === Toggle meniu mobil pentru header-ul din partial (siteHeader/burger/mobileNav) ===
(function attachHeaderToggle() {
  function bind() {
    var header = document.getElementById("siteHeader");
    var burger = document.getElementById("burger");
    var mobileNav = document.getElementById("mobileNav");
    if (!header || !burger || !mobileNav) return false;

    function setOpen(open) {
      header.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      mobileNav.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.classList.toggle("nav-open", open);
    }

    burger.addEventListener("click", function (e) {
      e.stopPropagation(); // ca să nu-l închidă handlerul de "click în afară"
      setOpen(!header.classList.contains("is-open"));
    });

    // Închide când se apasă pe un link din meniu
    mobileNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });

    // Închide cu Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    // Închide la click în afara header-ului (backdrop / pagină)
    document.addEventListener(
      "click",
      function (e) {
        if (!header.classList.contains("is-open")) return;
        if (!header.contains(e.target)) setOpen(false);
      },
      true
    );

    return true;
  }

  // headerul vine din partial (include.js) — atașăm când apare
  if (!bind()) {
    var mo = new MutationObserver(function () {
      if (bind()) mo.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
})();

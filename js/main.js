/* ================================================
   main.js — Portfolio Interactivity
   Suwaphat Lamaisakun
   ================================================ */

(function () {
  "use strict";

  /* -----------------------------------------------
     1. THEME TOGGLE (dark / light / system)
        Now uses a checkbox switcher — checked = dark
  ----------------------------------------------- */
  const html = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const STORAGE_KEY = "portfolio-theme";

  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    html.classList.toggle("dark", isDark);
    themeToggle.checked = isDark;
    themeToggle.setAttribute("aria-checked", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  };

  // Init: load from storage or use system preference
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  applyTheme(savedTheme || getSystemTheme());

  // Toggle on switch change
  themeToggle.addEventListener("change", () => {
    const newTheme = themeToggle.checked ? "dark" : "light";
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  });

  // Sync with system changes (only if no manual preference saved)
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });

  /* -----------------------------------------------
     2. MOBILE HAMBURGER MENU
  ----------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");

  hamburger.addEventListener("click", () => {
    navbar.classList.toggle("menu-open");
    const isOpen = navbar.classList.contains("menu-open");
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when a nav link is clicked
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("menu-open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  /* -----------------------------------------------
     3. SMOOTH SCROLL (for anchor links)
  ----------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* -----------------------------------------------
     4. ACTIVE NAV LINK ON SCROLL
  ----------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const highlightNav = () => {
    const scrollY = window.scrollY + navbar.offsetHeight + 40;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav();

  /* -----------------------------------------------
     5. FADE-IN ON SCROLL (IntersectionObserver)
  ----------------------------------------------- */
  const fadeEls = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  fadeEls.forEach((el) => observer.observe(el));

  /* -----------------------------------------------
     6. CONTACT FORM — Formspree AJAX submission
     !! Replace YOUR_FORM_ID below with your actual
        Formspree form ID from formspree.io !!
  ----------------------------------------------- */
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      formStatus.className = "form-status";
      formStatus.textContent = "";

      try {
        const data = new FormData(form);
        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          formStatus.className = "form-status success";
          formStatus.textContent = "✓ Message sent! I'll get back to you soon.";
          form.reset();
        } else {
          const json = await response.json();
          throw new Error(json?.errors?.map((e) => e.message).join(", ") || "Error");
        }
      } catch (err) {
        formStatus.className = "form-status error";
        formStatus.textContent = "✗ Something went wrong. Please try again or email me directly.";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    });
  }

  /* -----------------------------------------------
     7. MULTILINGUAL GREETING SHUFFLER
        Cycles: English → Thai → Japanese → Korean
  ----------------------------------------------- */
  const greetingEl = document.getElementById("greeting-text");

  if (greetingEl) {
    const greetings = [
      { text: "Hello",   lang: "en" },
      { text: "สวัสดี",   lang: "th" },   // Thai
      { text: "こんにちは", lang: "ja" },   // Japanese
      { text: "안녕하세요", lang: "ko" },   // Korean
      { text: "Buenos", lang: "es" },   // Spanish
      { text: "Bonjour", lang: "fr" },    // French
      { text: "Guten", lang: "de" },    // German
      { text: "您好", lang: "cn"}        // Chinese
    ];

    let currentIndex = 0;

    // Animate: fade out → swap text → fade in
    const cycleGreeting = () => {
      greetingEl.style.opacity = "0";
      greetingEl.style.transform = "translateY(-8px)";

      setTimeout(() => {
        currentIndex = (currentIndex + 1) % greetings.length;
        const { text, lang } = greetings[currentIndex];
        greetingEl.textContent = text;
        greetingEl.setAttribute("lang", lang);

        greetingEl.style.opacity = "1";
        greetingEl.style.transform = "translateY(0)";
      }, 300); // Wait for fade-out (matches CSS transition duration)
    };

    setInterval(cycleGreeting, 4000); // Change every 5 seconds
  }

})();

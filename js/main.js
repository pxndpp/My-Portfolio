(function () {
  "use strict";
  /* Mobile menu */
  const header = document.getElementById("top");
  const menu = document.getElementById("menu");
  const setMenu = (open) => {
    header.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
  };
  menu.addEventListener("click", () => setMenu(!header.classList.contains("open")));
  document.querySelectorAll("#nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Name types out like a console, cursor stays and blinks */
  const h1 = document.querySelector("h1");
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  const name = h1.innerText.replace(/\s+/g, " ").trim();
  h1.setAttribute("aria-label", name);
  h1.textContent = "";
  const chars = [...name].map((ch) => {
    if (ch === " ") { h1.appendChild(document.createElement("br")); return null; }
    const s = document.createElement("span");
    s.className = "c";
    s.setAttribute("aria-hidden", "true");
    s.textContent = ch;
    h1.appendChild(s);
    return s;
  }).filter(Boolean);
  h1.insertBefore(cursor, h1.firstChild);
  const show = (n) => { chars[n].classList.add("on"); chars[n].after(cursor); };
  let n = 0;
  setTimeout(function type() {
    show(n);
    if (++n < chars.length) setTimeout(type, 90);
  }, 400);

  /* Sections fade in once */
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll(".sec").forEach((s) => io.observe(s));
  }

  /* Greeting cycles through languages */
  const greet = document.getElementById("greeting-text");
  const words = [["Hello", "en"], ["สวัสดี", "th"], ["こんにちは", "ja"], ["안녕하세요", "ko"], ["Bonjour", "fr"], ["你好", "zh"]];
  let i = 0;
  if (greet) {
    setInterval(() => {
      greet.style.opacity = "0";
      if (!calm) greet.style.transform = "translateY(-6px)";
      setTimeout(() => {
        i = (i + 1) % words.length;
        greet.textContent = words[i][0];
        greet.lang = words[i][1];
        greet.style.opacity = "1";
        greet.style.transform = "none";
      }, 300);
    }, 4000);
  }

  /* Contact form (Formspree) */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("submit-btn");
    if (!form.checkValidity()) {
      status.className = "status error";
      status.textContent = "Fill in your name, a valid email and a message.";
      return;
    }
    btn.disabled = true;
    btn.textContent = "Sending";
    status.className = "status";
    status.textContent = "";
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error();
      status.className = "status success";
      status.textContent = "Sent. I'll reply soon.";
      form.reset();
    } catch (err) {
      status.className = "status error";
      status.textContent = "Message not sent. Try again, or email me directly.";
    } finally {
      btn.disabled = false;
      btn.textContent = "Send message";
    }
  });
})();

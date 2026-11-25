(() => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav-links");
  const navigationLinks = [...document.querySelectorAll(".nav-links a")];
  const sections = [...document.querySelectorAll("main section[id], footer[id]")];
  const backToTop = document.querySelector(".back-to-top");
  const themeToggle = document.querySelector(".theme-toggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function closeNavigation() {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  }

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.setAttribute("aria-label", open ? "Open navigation menu" : "Close navigation menu");
    menuButton.querySelector("span").textContent = open ? "☰" : "×";
    navigation.classList.toggle("is-open", !open);
  });
  navigationLinks.forEach(link => link.addEventListener("click", closeNavigation));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeNavigation();
      menuButton.focus();
    }
  });

  function updatePageState() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 20);
    backToTop.classList.toggle("is-visible", y > 500);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, y / max * 100) : 0}%`;

    let activeId = "home";
    const marker = y + header.offsetHeight + 120;
    sections.forEach(section => {
      if (section.offsetTop <= marker) activeId = section.id;
    });
    navigationLinks.forEach(link => {
      if (link.getAttribute("href") === `#${activeId}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", updatePageState, { passive: true });
  window.addEventListener("resize", updatePageState);
  updatePageState();

  const savedTheme = localStorage.getItem("dijitha-theme");
  if (savedTheme === "light") body.classList.add("light-theme");
  function syncThemeButton() {
    const light = body.classList.contains("light-theme");
    themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    themeToggle.querySelector("span").textContent = light ? "☀" : "☾";
  }
  syncThemeButton();
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    const theme = body.classList.contains("light-theme") ? "light" : "dark";
    localStorage.setItem("dijitha-theme", theme);
    syncThemeButton();
  });

  if (!reduceMotion) {
    const revealObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        }), { threshold: 0.11 })
      : null;
    document.querySelectorAll(".reveal").forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
      if (revealObserver) revealObserver.observe(item);
      else item.classList.add("is-visible");
    });
  } else {
    document.querySelectorAll(".reveal").forEach(item => item.classList.add("is-visible"));
  }

  const typedElement = document.querySelector("#typed-text");
  const phrases = ["B.Tech Student", "Future Developer", "Creative Thinker", "Technology Explorer", "Lifelong Learner"];
  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let deleting = true;
  function typePhrase() {
    if (reduceMotion) return;
    const phrase = phrases[phraseIndex];
    typedElement.textContent = phrase.slice(0, charIndex);
    if (!deleting) {
      charIndex++;
      if (charIndex > phrase.length) {
        deleting = true;
        setTimeout(typePhrase, 1350);
        return;
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
      }
    }
    setTimeout(typePhrase, deleting ? 34 : 70);
  }
  setTimeout(typePhrase, 900);

  const particleHost = document.querySelector(".particles");
  if (!reduceMotion) {
    for (let i = 0; i < 28; i++) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.setProperty("--duration", `${12 + Math.random() * 18}s`);
      particle.style.setProperty("--delay", `${Math.random() * -20}s`);
      particle.style.setProperty("--drift", `${-35 + Math.random() * 70}px`);
      particleHost.appendChild(particle);
    }
  }

  const cursorGlow = document.querySelector(".cursor-glow");
  if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
    window.addEventListener("pointermove", event => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
      cursorGlow.style.opacity = "1";
    }, { passive: true });
  }

  document.querySelector("#follow-journey").addEventListener("click", () => {
    document.querySelector("#goals").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  const form = document.querySelector("#contact-form");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const fields = ["name", "email", "subject", "message"];
    let valid = true;
    fields.forEach(fieldName => {
      const field = form.elements[fieldName];
      const error = document.querySelector(`#${fieldName}-error`);
      let message = "";
      if (!field.value.trim()) message = `Please enter ${fieldName === "message" ? "a message" : `your ${fieldName}`}.`;
      if (fieldName === "email" && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) message = "Please enter a valid email address.";
      error.textContent = message;
      if (message) valid = false;
    });
    const status = document.querySelector("#form-status");
    if (!valid) {
      status.textContent = "Please check the highlighted fields.";
      return;
    }
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const subject = form.elements.subject.value.trim();
    const message = form.elements.message.value.trim();
    const mailto = `mailto:dijithaharshitha1823@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Dijitha,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
    status.textContent = "Opening your email app…";
    window.location.href = mailto;
  });

  document.querySelector("#current-year").textContent = new Date().getFullYear();

  const loadingScreen = document.querySelector(".loading-screen");
  window.addEventListener("load", () => {
    setTimeout(() => loadingScreen.classList.add("is-hidden"), reduceMotion ? 0 : 550);
  });
})();

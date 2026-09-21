/* =========================================================
   Hariram C — Portfolio Script
   Handles: nav scroll state, mobile menu, active-link
   highlighting, scroll reveal, hero role typing effect,
   animated evaluation bars, back-to-top, contact form
   validation.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initNavScrollState();
  initMobileNav();
  initSmoothNavClicks();
  initActiveNavHighlight();
  initScrollReveal();
  initRoleTyping();
  initEvalBars();
  initBackToTop();
  initContactForm();
});

/* ---------- Footer year ---------- */
function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Navbar background on scroll ---------- */
function initNavScrollState() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const toggle = () => {
    if (window.scrollY > 12) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}

/* ---------- Mobile navigation menu ---------- */
function initMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("mobile-open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close mobile menu after a link is tapped
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("mobile-open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Smooth scrolling for in-page links ---------- */
function initSmoothNavClicks() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
}

/* ---------- Active nav-link highlighting on scroll ---------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll("main section[id], main[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Scroll reveal animations ---------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ---------- Hero role typing effect ---------- */
function initRoleTyping() {
  const el = document.getElementById("typedRole");
  if (!el) return;

  const roles = [
    "Software Developer",
    "Machine Learning Enthusiast",
    "Python Developer",
    "Cloud Enthusiast",
  ];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    el.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = false;

  const TYPE_SPEED = 55;
  const DELETE_SPEED = 30;
  const HOLD_TIME = 1600;

  function tick() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = currentRole.slice(0, charIndex);
      if (charIndex >= currentRole.length) {
        isDeleting = true;
        setTimeout(tick, HOLD_TIME);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      el.textContent = currentRole.slice(0, charIndex);
      if (charIndex <= 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  el.textContent = roles[0];
  setTimeout(() => {
    isDeleting = true;
    tick();
  }, HOLD_TIME);
}

/* ---------- Animate the hero "model evaluation" bars once visible ---------- */
function initEvalBars() {
  const panel = document.querySelector(".hero-panel");
  if (!panel) return;

  const animate = () => {
    document.querySelectorAll(".eval-bar-fill").forEach((bar) => {
      const target = bar.getAttribute("data-target") || "0";
      bar.style.width = target + "%";
    });
    document.querySelectorAll(".eval-metric-value").forEach((val) => {
      const target = parseInt(val.getAttribute("data-target") || "0", 10);
      animateCount(val, target);
    });
  };

  if (!("IntersectionObserver" in window)) {
    animate();
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate();
          obs.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(panel);
}

function animateCount(el, target) {
  const duration = 1200;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(progress * target);
    el.textContent = value + "%";
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------- Back to top button ---------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle("visible", window.scrollY > 480);
  };
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Contact form validation ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const status = document.getElementById("formStatus");

  const fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("nameError"),
      validate: (v) => v.trim().length >= 2,
      message: "Enter your name (at least 2 characters).",
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("emailError"),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: "Enter a valid email address.",
    },
    subject: {
      input: document.getElementById("subject"),
      error: document.getElementById("subjectError"),
      validate: (v) => v.trim().length >= 3,
      message: "Add a short subject line.",
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("messageError"),
      validate: (v) => v.trim().length >= 10,
      message: "Your message should be at least 10 characters.",
    },
  };

  Object.values(fields).forEach(({ input, error, validate, message }) => {
    input.addEventListener("blur", () => validateField(input, error, validate, message));
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid")) {
        validateField(input, error, validate, message);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let allValid = true;

    Object.values(fields).forEach(({ input, error, validate, message }) => {
      const valid = validateField(input, error, validate, message);
      if (!valid) allValid = false;
    });

    if (!allValid) {
      status.textContent = "Please fix the highlighted fields before sending.";
      status.classList.remove("success");
      return;
    }

    // Front-end only: no backend is connected. In a real deployment, replace
    // this block with a fetch() call to your backend or a form service
    // (Formspree, EmailJS, Netlify Forms, etc.).
    status.textContent = "Message ready to send. Connect a backend or form service to deliver it.";
    status.classList.add("success");
    form.reset();
  });

  function validateField(input, errorEl, validate, message) {
    const isValid = validate(input.value);
    input.classList.toggle("invalid", !isValid);
    errorEl.textContent = isValid ? "" : message;
    return isValid;
  }
}

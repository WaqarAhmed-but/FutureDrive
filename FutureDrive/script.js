// FutureDrive — interactive front-end features

const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Reveal content as it enters the viewport.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Highlight the navigation link for the section currently in view.
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));
}

// Vehicle detail buttons are wired to the refined showroom selector below.

// Simple vehicle-card controls for smaller screens: reveal all cards.
const vehicleGrid = document.querySelector("#vehicleGrid");
document.querySelector("#vehicleNext")?.addEventListener("click", () => {
  vehicleGrid?.classList.toggle("show-all");
});
document.querySelector("#vehiclePrev")?.addEventListener("click", () => {
  vehicleGrid?.classList.remove("show-all");
});

// Count-up performance stats when the section becomes visible.
const stats = document.querySelectorAll("[data-count]");
let statsStarted = false;

function animateStats() {
  if (statsStarted) return;
  statsStarted = true;

  stats.forEach((stat) => {
    const target = Number(stat.dataset.count);
    const isDecimal = String(stat.dataset.count).includes(".");
    const duration = 1300;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      stat.textContent = isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

const performanceSection = document.querySelector("#performance");
if ("IntersectionObserver" in window && performanceSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      animateStats();
      statsObserver.disconnect();
    }
  }, { threshold: 0.25 });
  statsObserver.observe(performanceSection);
} else {
  animateStats();
}

// Front-end demo form: validate input and show a local confirmation.
// No data is sent to a server or stored.
const contactForm = document.querySelector("#contactForm");
const formNote = document.querySelector("#formNote");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const visitorName = document.querySelector("#visitorName").value.trim();
  formNote.textContent = `Thanks, ${visitorName}! This demo form is working. No information was sent or stored.`;
  formNote.classList.add("form-success");
  contactForm.reset();
});




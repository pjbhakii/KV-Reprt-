const FEATURES = [
  { category: "Intelligence", title: "AI Crop Doctor", impact: "Instant disease diagnosis", tech: "Gemini 1.5 Flash" },
  { category: "Search", title: "Predictive Search + Spell", impact: "Typo-tolerant discovery", tech: "Levenshtein · Shopify API" },
  { category: "Logistics", title: "Track Order Page", impact: "Self-service tracking", tech: "Delhivery · CF Worker" },
  { category: "UX", title: "Track Package Spinner", impact: "Contextual loading feedback", tech: "CSS animation · SVG" },
  { category: "Authentication", title: "Phone OTP Login", impact: "Password-free account access", tech: "MSG91 · KV · GraphQL" },
  { category: "Authentication", title: "Google OAuth", impact: "Alternative login route", tech: "Google Identity Services" },
  { category: "Account", title: "My Account Dashboard", impact: "Orders, tracking and returns", tech: "Worker · Admin API" },
  { category: "Commerce", title: "Custom Checkout Flow", impact: "Guided step-by-step checkout", tech: "State machine" },
  { category: "Commerce", title: "Product Card System", impact: "Trust-led product browsing", tech: "Liquid · CSS · SVG" },
  { category: "UX", title: "Cart Haptic Feedback", impact: "Multi-sensory confirmation", tech: "navigator.vibrate · fetch" },
  { category: "Merchandising", title: "Hero Banner Carousel", impact: "Seasonal campaign showcase", tech: "Visibility API · CSS" },
  { category: "Merchandising", title: "Floating Brand Strip", impact: "Brand trust at a glance", tech: "CSS infinite marquee" },
  { category: "Merchandising", title: "Promotional Banners", impact: "Mid-page re-engagement", tech: "Shopify schema · lazy load" },
  { category: "Trust", title: "Testimonials Carousel", impact: "Farmer social proof", tech: "Liquid blocks · CSS" },
  { category: "Commerce", title: "Related Products", impact: "Focused cross-sell and AOV", tech: "Recommendations API" },
  { category: "Accessibility", title: "Voice Search / Mic", impact: "Voice-led discovery", tech: "Web Speech API" },
  { category: "Accessibility", title: "Language Toggle", impact: "Regional market access", tech: "13 locales" },
  { category: "Navigation", title: "Sticky Navbar", impact: "Always-on product access", tech: "CSS sticky · spacer" },
  { category: "Trust", title: "Footer Design", impact: "Confidence and navigation", tech: "Desktop grid · mobile tabs" },
  { category: "Discoverability", title: "SEO Improvements", impact: "Search visibility", tech: "JSON-LD · OG · metadata" },
  { category: "Infrastructure", title: "Cloudflare Workers", impact: "Secure serverless edge layer", tech: "Workers · KV" },
  { category: "Logistics", title: "Delhivery Integration", impact: "Real-time order status", tech: "REST proxy" },
  { category: "Communication", title: "MSG91 SMS", impact: "Reliable OTP delivery", tech: "SMS API" },
  { category: "Commerce", title: "Shopify GraphQL", impact: "Customer and order operations", tech: "Admin API 2025-10" }
];

const topbar = document.querySelector(".topbar");
const navLinks = [...document.querySelectorAll(".desktop-nav a")];
const mobileLinks = [...document.querySelectorAll(".mobile-menu a")];
const sectionNodes = [...document.querySelectorAll("[data-section]")];
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const backToTop = document.querySelector(".back-to-top");
const featureDashboard = document.querySelector("#feature-dashboard");

const escapeHTML = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function buildFeatureDashboard() {
  featureDashboard.innerHTML = FEATURES.map((feature, index) => `
    <article class="delivery-card reveal" data-delay="${(index % 4) * 35}">
      <header>
        <span>${escapeHTML(feature.category)}</span>
        <b>${String(index + 1).padStart(2, "0")}</b>
      </header>
      <h3>${escapeHTML(feature.title)}</h3>
      <p>${escapeHTML(feature.impact)}</p>
      <footer>${escapeHTML(feature.tech)}</footer>
    </article>
  `).join("");
}

function setMenu(open) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  mobileMenu.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
}

function updateChrome() {
  const scrolled = window.scrollY > 32;
  if (topbar) topbar.classList.toggle("scrolled", scrolled);
  backToTop.classList.toggle("visible", window.scrollY > 700);
}

function updateActiveNavigation() {
  const threshold = window.scrollY + window.innerHeight * 0.35;
  let activeSection = sectionNodes[0]?.id || "overview";

  sectionNodes.forEach((section) => {
    if (section.offsetTop <= threshold) activeSection = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeSection}`);
  });
}

function revealElements() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealNodes = [...document.querySelectorAll(".reveal")];

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      window.setTimeout(() => entry.target.classList.add("visible"), delay);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  revealNodes.forEach((node) => observer.observe(node));
}

function countUpMetrics() {
  const metricNodes = [...document.querySelectorAll("[data-count]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animate = (node) => {
    const value = Number(node.dataset.count);
    const suffix = node.dataset.suffix || "";
    if (reduceMotion) {
      node.textContent = `${value}${suffix}`;
      return;
    }

    const duration = 1050;
    const startedAt = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = `${Math.round(value * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    metricNodes.forEach(animate);
    return;
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.counted) return;
      entry.target.dataset.counted = "true";
      animate(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.85 });

  metricNodes.forEach((node) => counterObserver.observe(node));
}

function bindNavigation() {
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });
  }

  mobileLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  document.addEventListener("click", (event) => {
    if (!mobileMenu || !mobileMenu.classList.contains("open")) return;
    if (mobileMenu.contains(event.target) || (menuToggle && menuToggle.contains(event.target))) return;
    setMenu(false);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function bindScroll() {
  let scheduled = false;
  const handleScroll = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      updateChrome();
      updateActiveNavigation();
      scheduled = false;
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

function initialize() {
  buildFeatureDashboard();
  bindNavigation();
  bindScroll();
  revealElements();
  countUpMetrics();
}

initialize();

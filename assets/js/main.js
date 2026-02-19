(() => {
  document.documentElement.classList.add("js");

  const nav = document.getElementById("siteNav");
  const hero = document.getElementById("hero");
  const navLinks = Array.from(document.querySelectorAll(".links a"));
  const allAnchors = Array.from(document.querySelectorAll('a[href^="#"]'));

  // --- Smooth scroll with sticky offset ---
  function getNavOffset() {
    const navH = nav ? nav.getBoundingClientRect().height : 0;
    const strip = document.querySelector(".mini-strip");
    const stripH = strip ? strip.getBoundingClientRect().height : 0;
    return navH + stripH + 10;
  }

  allAnchors.forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - getNavOffset();
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // --- Nav grow/shrink after hero ---
  function getHeroThreshold() {
    if (!hero) return 280;
    return hero.offsetHeight * 0.70;
  }

  function updateNavSize() {
    if (!nav) return;
    const y = window.scrollY || document.documentElement.scrollTop;
    if (y > getHeroThreshold()) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }

  // --- Active nav link ---
  const sectionIds = navLinks
    .map(a => a.getAttribute("href"))
    .filter(h => h && h.startsWith("#"))
    .map(h => h.slice(1));

  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach(a => {
      const href = a.getAttribute("href");
      a.classList.toggle("active", href === `#${id}`);
    });
  }

  function updateActiveNav() {
    const y = window.scrollY + getNavOffset() + 40;
    let current = sections[0]?.id || "";
    for (const s of sections) {
      if (s.offsetTop <= y) current = s.id;
    }
    if (current) setActiveLink(current);
  }

  // --- Continuous reveal (in/out) with stagger delays ---
  const allReveal = Array.from(document.querySelectorAll(".reveal, .reveal-item"));

  const staggers = Array.from(document.querySelectorAll(".reveal-stagger"));
  staggers.forEach(container => {
    const kids = Array.from(container.querySelectorAll(".reveal-item"));
    kids.forEach((k, i) => k.style.setProperty("--d", `${i * 80}ms`));
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) el.classList.add("is-revealed");
      else el.classList.remove("is-revealed");
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -12% 0px" });

  allReveal.forEach(el => io.observe(el));

  // --- Ticket form (static site mailto builder) ---
  const form = document.getElementById("ticketForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("t_name")?.value?.trim() || "";
      const email = document.getElementById("t_email")?.value?.trim() || "";
      const device = document.getElementById("t_device")?.value?.trim() || "";
      const issue = document.getElementById("t_issue")?.value?.trim() || "";

      const to = "talon.wilson@outlook.com";
      const subject = encodeURIComponent(`Cape Revive Tech Inquiry — ${name || "New Customer"}`);
      const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Device: ${device}

Issue:
${issue}

Service Area: Upper Cape → Mid Cape
Preferred contact: Email or text`
      );

      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }

  // --- Tick handlers ---
  function onScroll() {
    updateNavSize();
    updateActiveNav();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();

/* Shared behaviour: language switch, header, menu, footer, cursor, transitions,
   reveals, home scroll gallery, work grid and case-study "next" links.

   Bilingual text: every translatable element exists twice, as lang="vi" and
   lang="en"; CSS hides the one that does not match <html data-lang>. */
(function () {
  const S = window.SITE;
  const P = window.PROJECTS;
  const root = document.documentElement;
  const page = document.body.dataset.page || "";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const isBi = (x) => x && typeof x === "object";
  const lang = () => (root.dataset.lang === "vi" ? "vi" : "en"); // English is the default
  const pick = (x) => (isBi(x) ? x[lang()] : x);
  // Render a value that may be { vi, en } as two language spans (or plain text).
  const L = (x, wrap = (t) => esc(t)) =>
    isBi(x) ? `<span lang="vi">${wrap(x.vi)}</span><span lang="en">${wrap(x.en)}</span>` : wrap(x);
  const rollOne = (text) =>
    `<span class="roll" aria-hidden="true">${[...text]
      .map((c, i) => `<span class="ch" style="--i:${i}"><span>${esc(c)}</span><span>${esc(c)}</span></span>`)
      .join("")}</span><span class="sr-only">${esc(text)}</span>`;
  const roll = (x) => L(x, rollOne);
  const pad = (n) => String(n).padStart(2, "0");
  const bySlug = (s) => P.find((p) => p.slug === s);

  function cover(p) {
    if (!p.cover) {
      return `<div class="ai-cover" aria-hidden="true"><i></i><i></i><i></i><div class="ai-wave">${"<b></b>".repeat(28)}</div><span>SPACE<br>AI</span></div>`;
    }
    return `<img src="${p.cover}" alt="${esc(p.title)} — ${esc(pick(p.client))}" loading="lazy">`;
  }

  /* ---------- header ---------- */
  const navItems = [
    { href: "index.html", label: { vi: "Trang chủ", en: "Home" }, id: "home" },
    { href: "work.html", label: { vi: "Dự án", en: "My Work" }, id: "work" },
    { href: "#contact", label: { vi: "Liên hệ", en: "Contact" }, id: "contact" },
  ];
  const langSwitch = `
    <div class="lang-switch" role="group" aria-label="Language">
      <button type="button" data-set-lang="vi">VI</button><span class="dim">/</span><button type="button" data-set-lang="en">EN</button>
    </div>`;
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a href="index.html" class="micro">${esc(S.name)}</a>
    <div class="micro hide-sm">${esc(S.role)}</div>
    <div class="micro hide-md">${L(S.location)}</div>
    <div class="head-right">
      ${langSwitch}
      <nav class="nav" aria-label="Main">
        ${navItems.map((n) => `<a href="${n.href}" ${n.id === page ? 'aria-current="page"' : ""}>${roll(n.label)}</a>`).join("")}
      </nav>
      <button class="menu-btn" aria-expanded="false" aria-controls="menu">${roll("Menu")}</button>
    </div>`;
  document.body.prepend(header);

  /* ---------- menu overlay ---------- */
  const menu = document.createElement("div");
  menu.className = "menu";
  menu.id = "menu";
  menu.setAttribute("role", "dialog");
  menu.setAttribute("aria-modal", "true");
  menu.setAttribute("aria-label", "Menu");
  menu.innerHTML = `
    <div class="menu-top">
      <span class="micro">${esc(S.name)}</span>
      <button class="micro menu-close">${roll({ vi: "Đóng", en: "Close" })}</button>
    </div>
    <nav class="menu-links">
      ${navItems.map((n, i) => `<a href="${n.href}">${L(n.label)}<sup>${pad(i + 1)}</sup></a>`).join("")}
    </nav>
    <div class="menu-bottom">
      ${langSwitch}
      ${P.filter((p) => p.page).slice(0, 5).map((p) => `<a class="micro dim" href="${p.page}">${esc(p.title)}</a>`).join("")}
    </div>`;
  document.body.append(menu);
  const menuBtn = header.querySelector(".menu-btn");
  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    root.style.overflow = open ? "hidden" : "";
    if (open) menu.querySelector(".menu-close").focus();
  };
  menuBtn.addEventListener("click", () => setMenu(true));
  menu.querySelector(".menu-close").addEventListener("click", () => setMenu(false));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- footer ---------- */
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.id = "contact";
  footer.innerHTML = `
    <div class="footer-top">
      <div>
        <span class="label">Contact / Availability</span>
        <h2 class="footer-cta" lang="vi" data-split>Cùng biến ý tưởng thành trải nghiệm.</h2>
        <h2 class="footer-cta" lang="en" data-split>Let’s turn ideas into experiences.</h2>
        <a class="footer-mail" href="mailto:${S.email}">${esc(S.email)} ↗</a>
      </div>
      <div class="footer-nav">
        <div>
          <span class="label">Navigation</span>
          <ul>${navItems.map((n) => `<li><a href="${n.href}" ${n.id === page ? 'aria-current="page"' : ""}>${roll(n.label)}</a></li>`).join("")}</ul>
        </div>
        <div>
          <span class="label">Socials</span>
          <ul>
            <li><a href="${S.linkedin}" target="_blank" rel="noopener">${roll("LinkedIn")}</a></li>
            <li><a href="${S.facebook}" target="_blank" rel="noopener">${roll("Facebook")}</a></li>
            <li><a data-cv href="${S.cv.vi}" target="_blank" rel="noopener">${roll("CV")}</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div><span class="label">Design / Code</span><span class="micro">${esc(S.name)} Studio</span></div>
      <div><span class="label">Copyright</span><span class="micro">© ${S.year} All rights reserved</span></div>
      <div><span class="label">Phone</span><a class="micro" href="tel:${S.phone.replace(/\s/g, "")}">${esc(S.phone)}</a></div>
      <div><span class="label">Location</span><span class="micro">${L(S.location)}</span></div>
    </div>`;
  document.body.append(footer);

  /* ---------- clock ---------- */
  const tick = () => {
    const t = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
    document.querySelectorAll("[data-clock]").forEach((el) => (el.textContent = `${t} ICT`));
  };
  tick();
  setInterval(tick, 15000);

  /* ---------- page-specific rendering ---------- */
  if (page === "home") renderHome();
  if (page === "work" && document.querySelector(".grid")) renderWork();
  if (document.body.dataset.slug) renderProject(document.body.dataset.slug);

  /* ---------- split text (after rendering so generated markup is included) ---------- */
  document.querySelectorAll("[data-split]").forEach((el) => {
    let i = 0;
    el.innerHTML = el.textContent
      .trim()
      .split(/\s+/)
      .map((w) => `<span class="w"><span style="--i:${i++}">${esc(w)}</span></span>`)
      .join(" ");
    el.classList.add("split");
  });

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal, .split").forEach((el) => io.observe(el));

  /* ---------- language switch ---------- */
  function applyLang(l) {
    root.dataset.lang = l;
    root.lang = l;
    try { localStorage.setItem("lang", l); } catch (e) { /* storage unavailable */ }
    document.querySelectorAll("[data-set-lang]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.setLang === l));
    document.querySelectorAll("[data-cv]").forEach((a) => (a.href = S.cv[l]));
    if (page === "work" && window.__setWorkCount) window.__setWorkCount();
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-set-lang]");
    if (b) applyLang(b.dataset.setLang);
  });
  applyLang(lang());

  /* ---------- experience accordion ---------- */
  document.querySelectorAll(".xp-row").forEach((btn) => {
    btn.addEventListener("click", () => {
      const li = btn.closest("li");
      const open = !li.classList.contains("open");
      li.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open);
    });
  });

  /* ---------- lightbox: click a case-study image to see it full size ---------- */
  const figImgs = document.querySelectorAll(".figure img, .p-hero img, .as-panel img[data-zoomable], .resp img[data-zoomable]");
  if (figImgs.length) {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML = `<button class="lightbox-close micro">${L({ vi: "Đóng ✕", en: "Close ✕" })}</button><div class="lightbox-scroll"><img alt=""></div>`;
    document.body.append(box);
    const big = box.querySelector("img");
    const close = () => { box.classList.remove("open"); root.style.overflow = ""; };
    figImgs.forEach((img) => {
      img.setAttribute("data-zoom", "");
      img.addEventListener("click", () => {
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        box.classList.add("open");
        root.style.overflow = "hidden";
        box.querySelector(".lightbox-close").focus();
      });
    });
    box.addEventListener("click", (e) => { if (e.target === box || e.target.closest(".lightbox-close")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ---------- demo password field (Techcombank system tile) ---------- */
  document.querySelectorAll("[data-toggle-pass]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const input = btn.parentElement.querySelector("input");
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.setAttribute("aria-pressed", show);
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  /* ---------- cursor ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const cur = document.createElement("div");
    cur.className = "cursor";
    cur.innerHTML = "<span>VIEW</span>";
    document.body.append(cur);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; cur.style.opacity = 1; });
    document.addEventListener("mouseleave", () => (cur.style.opacity = 0));
    document.addEventListener("mouseover", (e) => {
      cur.classList.toggle("is-view", !!e.target.closest("[data-view]"));
      cur.classList.toggle("is-hidden", !!e.target.closest(".slide")); // slides show their own View badge
    });
    const loop = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- page transitions ---------- */
  const curtain = document.createElement("div");
  curtain.className = "curtain";
  document.body.append(curtain);
  setTimeout(() => curtain.classList.add("out"), 60);
  addEventListener("pageshow", (e) => { if (e.persisted) { curtain.className = "curtain out"; } });
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || reduce || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || /^https?:/.test(href) || href.endsWith(".pdf")) return;
    e.preventDefault();
    curtain.className = "curtain in";
    setTimeout(() => (location.href = href), 560);
  });

  /* ---------- smooth scroll ---------- */
  if (window.Lenis && !reduce) {
    const lenis = new window.Lenis({ lerp: 0.1 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", (e) => {
        const t = document.querySelector(a.getAttribute("href"));
        if (t) { e.preventDefault(); lenis.scrollTo(t); }
      })
    );
  }

  /* ======================================================
     HOME — scroll-driven 3D gallery
     ====================================================== */
  function renderHome() {
    const track = document.querySelector(".track");
    const slides = [
      `<div class="slide portrait"><div class="frame"><img src="assets/img/avatar.jpg" alt="${esc(S.name)}" style="object-position:50% 68%"></div></div>`,
      ...P.map((p) =>
        `<div class="slide ${p.paper ? "paper" : ""}" style="--tint:${p.tint}">
          <div class="frame">${cover(p)}<span class="view" aria-hidden="true">${L({ vi: "Xem", en: "View" })} →</span></div>
          <span class="tag">${esc(p.title)}</span>
          ${p.page ? `<a href="${p.page}" aria-label="${esc(p.title)}"></a>` : ""}
        </div>`),
    ];
    track.innerHTML = slides.join("");


    const hero = document.querySelector(".hero");
    const items = [...track.children];
    const title = document.querySelector(".hero-title");

    const update = () => {
      const r = hero.getBoundingClientRect();
      const total = hero.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const first = items[0], last = items[items.length - 1];
      const span = last.offsetLeft + last.offsetWidth / 2 - (first.offsetLeft + first.offsetWidth / 2);
      const x = -(first.offsetLeft + first.offsetWidth / 2) - span * p;
      track.style.transform = `translate3d(${x}px, -50%, 0)`;
      const vw = innerWidth;
      items.forEach((el) => {
        const b = el.getBoundingClientRect();
        const d = (b.left + b.width / 2 - vw / 2) / vw;
        const rot = Math.max(-60, Math.min(60, -d * 70));
        const z = -Math.abs(d) * 260;
        const lift = Math.abs(d) * 40;
        el.style.transform = `translateZ(${z}px) translateY(${lift}px) rotateY(${rot}deg)`;
        if (!el.classList.contains("portrait")) el.style.opacity = String(Math.min(1, p * 14));
        el.classList.toggle("active", Math.abs(d) < 0.12 && !el.classList.contains("portrait"));
      });
      if (title) title.style.opacity = String(Math.max(0, 1 - p * 14));
    };
    const onScroll = () => requestAnimationFrame(update);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    window.addEventListener("load", update);
    update();
  }

  /* ======================================================
     WORK — grid + filters
     ====================================================== */
  function renderWork() {
    const grid = document.querySelector(".grid");
    const filters = document.querySelector(".filters");
    const count = document.querySelector(".work-count");
    grid.innerHTML = P.map((p, i) => {
      const thumb = `<div class="thumb ${p.paper ? "paper" : ""}" style="--tint:${p.tint}">${cover(p)}</div>`;
      const meta = `<div class="meta"><span class="no">${pad(i + 1)}</span><h3>${esc(p.title)}</h3><p>${p.tags.map((t) => L(t)).join(" · ")} · ${L(p.year)}</p></div>`;
      return `<a class="card reveal" href="${p.page}" data-cats="${p.cats.join(" ")}" data-view>${thumb}${meta}</a>`;
    }).join("");
    filters.innerHTML = FILTERS.map((f) => `<button type="button" data-f="${f.id}" aria-pressed="${f.id === "all"}">${L(f.label)}</button>`).join("");
    const setCount = () => {
      const n = grid.querySelectorAll(".card:not(.hidden)").length;
      count.textContent = `${pad(n)} / ${pad(P.length)} ${lang() === "en" ? "Projects" : "Dự án"}`;
    };
    window.__setWorkCount = setCount;
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      filters.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
      grid.querySelectorAll(".card").forEach((c) => {
        const show = b.dataset.f === "all" || c.dataset.cats.split(" ").includes(b.dataset.f);
        c.classList.toggle("hidden", !show);
        if (show) c.classList.add("in");
      });
      setCount();
    });
    setCount();
  }

  /* ======================================================
     PROJECT — breadcrumb + next project
     ====================================================== */
  function renderProject(slug) {
    const i = P.findIndex((p) => p.slug === slug);
    const cur = P[i];
    const nextP = P.slice(i + 1).concat(P.slice(0, i)).find((p) => p.page);
    const crumb = document.createElement("div");
    crumb.className = "crumb micro";
    crumb.innerHTML = `<i></i>${esc(cur.title)}`;
    document.body.append(crumb);
    const next = document.querySelector(".next");
    if (next && nextP) {
      next.href = nextP.page;
      next.innerHTML = `<span class="label">${L({ vi: "Dự án tiếp theo", en: "Next project" })} — ${L(nextP.client)}</span><b><span>${esc(nextP.title)} →</span></b>`;
    }
  }
})();

/* ==========================================================================
   ZoekJeWerk.nl — Interactie & animaties
   ========================================================================== */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Web-app-URL van het Google Apps Script dat formulieren naar contact@zoekjewerk.nl mailt.
     Zie apps-script/INSTALLATIE.md. Leeg = formulieren tonen een foutmelding. */
  const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbwDJf2HgNy6QlmNHOzBo8RSpXkNGoJzFufssFdrBq9MvvhxNyYfbsmocxRtBqIOPCtNCA/exec";

  const ICON_ARROW ='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const ICON_PIN = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';

  /* ---------- Page curtain ---------- */
  const curtain = $(".curtain");
  if (curtain) {
    if (sessionStorageGet("zjw-visited")) curtain.remove();
    else {
      sessionStorageSet("zjw-visited", "1");
      setTimeout(() => curtain.remove(), 1500);
    }
  }
  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch { /* ignore */ } }

  /* ---------- Header ---------- */
  const header = $(".header");
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    header?.classList.toggle("is-scrolled", y > 20);
    if (!document.body.classList.contains("menu-open")) {
      header?.classList.toggle("is-hidden", y > 400 && y > lastY + 4);
      if (y < lastY - 4) header?.classList.remove("is-hidden");
    }
    lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  $(".menu-toggle")?.addEventListener("click", (e) => {
    const open = document.body.classList.toggle("menu-open");
    e.currentTarget.setAttribute("aria-expanded", String(open));
    header?.classList.remove("is-hidden");
  });
  $$(".mobile-menu a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

  /* ---------- Split headlines ---------- */
  $$("[data-split]").forEach((el) => {
    let i = 0;
    const base = parseFloat(el.dataset.splitDelay || 0);
    const wrap = (word) => {
      const outer = document.createElement("span");
      outer.className = "split-line";
      const inner = document.createElement("span");
      inner.style.setProperty("--d", `${base + i++ * 0.06}s`);
      inner.textContent = word;
      outer.appendChild(inner);
      return outer;
    };
    const walk = (node, target) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === 3) {
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) target.appendChild(document.createTextNode(" "));
            else target.appendChild(wrap(part));
          });
        } else if (child.nodeName === "BR") {
          target.appendChild(document.createElement("br"));
        } else {
          const clone = child.cloneNode(false);
          walk(child, clone);
          target.appendChild(clone);
        }
      });
    };
    const frag = document.createElement(el.tagName);
    walk(el, frag);
    el.innerHTML = frag.innerHTML;
    el.classList.add("is-split");
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal, .reveal-scale, .is-split, .bento__cell").forEach((el) => io.observe(el));

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      countIO.unobserve(el);
      const to = parseFloat(el.dataset.count);
      const dec = (el.dataset.count.split(".")[1] || "").length;
      const fmt = (v) => v.toLocaleString("nl-NL", { minimumFractionDigits: dec, maximumFractionDigits: dec });
      if (reduced) { el.textContent = fmt(to); return; }
      const dur = 1800;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 4);
        el.textContent = fmt(to * e);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------- Statement: words light up on scroll ---------- */
  const statements = $$("[data-highlight]");
  statements.forEach((el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(" "));
            else {
              const s = document.createElement("span");
              s.className = "w";
              s.textContent = part;
              frag.appendChild(s);
            }
          });
          child.replaceWith(frag);
        } else walk(child);
      });
    };
    walk(el);
  });

  /* ---------- Process steps progress ---------- */
  const stepsWrap = $(".steps");
  const steps = $$(".step");
  const stepsLine = $(".steps__line i");

  const onScrollFx = () => {
    const vh = innerHeight;
    statements.forEach((el) => {
      const words = $$(".w", el);
      const r = el.getBoundingClientRect();
      const p = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1);
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
    });
    if (stepsWrap) {
      const r = stepsWrap.getBoundingClientRect();
      const p = Math.min(Math.max((vh * 0.6 - r.top) / r.height, 0), 1);
      stepsLine?.style.setProperty("--p", `${p * 100}%`);
      steps.forEach((s) => {
        const sr = s.getBoundingClientRect();
        s.classList.toggle("is-active", sr.top < vh * 0.6);
      });
    }
  };
  if (reduced) {
    $$(".w").forEach((w) => w.classList.add("on"));
    steps.forEach((s) => s.classList.add("is-active"));
    stepsLine?.style.setProperty("--p", "100%");
  } else {
    let ticking = false;
    addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { onScrollFx(); ticking = false; });
    }, { passive: true });
    addEventListener("resize", onScrollFx);
    onScrollFx();
  }

  /* ---------- Spotlight (mouse position) on cards ---------- */
  const SPOT = ".btn, .route, .job-card, .job-row, .bento__cell, .feature";
  document.addEventListener("pointermove", (e) => {
    const el = e.target.closest?.(SPOT);
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, { passive: true });

  /* ---------- Cursor follower ---------- */
  if (finePointer && !reduced) {
    const c = document.createElement("div");
    c.className = "cursor";
    document.body.appendChild(c);
    let x = 0, y = 0, cx = 0, cy = 0;
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; c.classList.add("is-visible"); }, { passive: true });
    document.addEventListener("pointerleave", () => c.classList.remove("is-visible"));
    document.addEventListener("pointerover", (e) => {
      c.classList.toggle("is-hover", !!e.target.closest?.("a, button, label, summary, .job-card, .job-row, .route"));
    });
    const loop = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Hero parallax / tilt ---------- */
  const hero = $(".hero");
  const match = $(".match");
  if (hero && finePointer && !reduced) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      if (match) {
        $(".match__card--talent", match).style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 8}deg) translate3d(${px * -18}px, ${py * -14}px, 0)`;
        $(".match__card--org", match).style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 8}deg) translate3d(${px * 18}px, ${py * 14}px, 0)`;
      }
      $$(".orb", hero).forEach((o, i) => { o.style.translate = `${px * (30 + i * 20)}px ${py * (30 + i * 20)}px`; });
    });
  }

  /* ---------- Forms → e-mail (via Google Apps Script, zie apps-script/) ---------- */
  const MAX_FILE_MB = 5;
  const fieldLabel = (form, el) => {
    const own = el.id && el.type !== "radio" && form.querySelector(`label[for="${el.id}"]`);
    const label = own || el.closest(".field")?.querySelector(":scope > label");
    if (label) return label.textContent.replace(/\(optioneel\)/i, "").trim();
    return el.name.charAt(0).toUpperCase() + el.name.slice(1);
  };
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const collectForm = async (form) => {
    const velden = [], bestanden = [];
    for (const el of form.elements) {
      if (!el.name || el.disabled || el.name === "website") continue;
      if ((el.type === "radio" || el.type === "checkbox") && !el.checked) continue;
      if (el.type === "file") {
        for (const f of el.files) bestanden.push({ naam: f.name, type: f.type, data: await toBase64(f) });
        continue;
      }
      const waarde = el.value.trim();
      velden.push({ naam: el.name, label: fieldLabel(form, el), waarde: waarde === "Maak een keuze" ? "" : waarde });
    }
    const vacature = form.elements.vacature?.value;
    return {
      formulier: (form.dataset.form || "Formulier") + (vacature ? `: ${vacature}` : ""),
      pagina: location.origin + location.pathname,
      website: form.elements.website?.value || "",
      velden,
      bestanden,
    };
  };
  const showFormError = (form, msg) => {
    let el = $(".form-error", form);
    if (!el) {
      el = document.createElement("p");
      el.className = "form-error";
      el.setAttribute("role", "alert");
      form.querySelector("[type=submit]").before(el);
    }
    el.innerHTML = msg;
  };
  const bindForm = (form) => {
    // Onzichtbaar veld tegen spam-bots
    form.insertAdjacentHTML("beforeend", '<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">');
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const tooBig = [...form.querySelectorAll("input[type=file]")].find((i) => [...i.files].some((f) => f.size > MAX_FILE_MB * 1024 * 1024));
      if (tooBig) { tooBig.setCustomValidity(`Je bestand is groter dan ${MAX_FILE_MB} MB.`); tooBig.reportValidity(); tooBig.setCustomValidity(""); return; }
      if (!form.reportValidity()) return;
      const wrap = form.closest("[data-form-wrap]");
      const btn = form.querySelector("[type=submit]");
      const label = btn.firstChild.textContent;
      btn.disabled = true; btn.style.opacity = ".7"; btn.firstChild.textContent = "Versturen… ";
      $(".form-error", form)?.remove();
      try {
        if (!FORM_ENDPOINT) throw new Error("FORM_ENDPOINT is nog niet ingesteld in assets/js/main.js");
        const res = await fetch(FORM_ENDPOINT, { method: "POST", body: JSON.stringify(await collectForm(form)) });
        const json = await res.json();
        if (!json.ok) throw new Error(json.fout || "Onbekende fout");
        wrap?.classList.add("is-sent");
        wrap?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      } catch (err) {
        console.error("Formulier versturen mislukt:", err);
        btn.disabled = false; btn.style.opacity = ""; btn.firstChild.textContent = label;
        showFormError(form, 'Versturen is helaas niet gelukt. Probeer het opnieuw of mail ons via <a href="mailto:contact@zoekjewerk.nl">contact@zoekjewerk.nl</a>.');
      }
    });
  };
  $$("[data-form]").forEach(bindForm);
  const bindFileDrops = (root = document) => {
    $$(".file-drop", root).forEach((drop) => {
      const input = $("input[type=file]", drop);
      const label = $("b", drop);
      const hint = $("span", drop);
      input?.addEventListener("change", () => {
        if (input.files?.length) { label.textContent = input.files[0].name; hint.textContent = "Klik om een ander bestand te kiezen"; }
      });
      ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("is-drag"); }));
      ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("is-drag")));
      drop.addEventListener("drop", (e) => {
        e.preventDefault();
        if (e.dataTransfer?.files?.length && input) { input.files = e.dataTransfer.files; input.dispatchEvent(new Event("change")); }
      });
    });
  };
  bindFileDrops();

  /* ---------- Year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ======================================================================
     Vacatures
     ====================================================================== */
  const JOBS = window.ZJW_JOBS || [];
  const initials = (s) => s.split(/\s+/).filter((w) => /^[A-Za-zÀ-ÿ]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const LOGO_COLORS = ["#040B1C", "#0B2A5E", "#1467D6", "#133062", "#0B5FC7", "#1D3B6E"];
  const logoColor = (s) => LOGO_COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % LOGO_COLORS.length];
  const postedLabel = (d) => (d <= 1 ? "Vandaag" : d === 2 ? "Gisteren" : `${d} dagen geleden`);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const cardHTML = (j, i) => `
    <button class="job-card reveal" style="--d:${i * 0.08}s" data-job="${j.id}" aria-label="Bekijk vacature ${esc(j.title)}">
      <div class="job-card__top">
        <div class="job-logo" style="background:${logoColor(j.company)}">${initials(j.company)}</div>
        ${j.posted <= 3 ? '<span class="tag tag--new">Nieuw</span>' : `<span class="tag">${postedLabel(j.posted)}</span>`}
      </div>
      <div>
        <h3 class="job-card__title">${esc(j.title)}</h3>
        <p class="job-card__company">${esc(j.company)} · ${esc(j.sector)}</p>
      </div>
      <div class="job-card__meta">
        <span class="tag">${ICON_PIN}${esc(j.location)}</span>
        <span class="tag tag--accent">${esc(j.type)}</span>
        <span class="tag">${esc(j.level)}</span>
      </div>
      <div class="job-card__foot">
        <div class="job-card__salary">${esc(j.salary)}<small>${esc(j.period)}</small></div>
        <span class="job-card__go">${ICON_ARROW}</span>
      </div>
    </button>`;

  const rowHTML = (j, i) => `
    <button class="job-row" style="animation-delay:${Math.min(i, 8) * 0.05}s" data-job="${j.id}" aria-label="Bekijk vacature ${esc(j.title)}">
      <div class="job-logo" style="background:${logoColor(j.company)}">${initials(j.company)}</div>
      <div>
        <h3 class="job-row__title">${esc(j.title)}</h3>
        <p class="job-row__sub">${esc(j.company)} · ${esc(j.sector)}</p>
        <div class="job-card__meta">
          <span class="tag">${ICON_PIN}${esc(j.location)}</span>
          <span class="tag tag--accent">${esc(j.type)}</span>
          <span class="tag">${esc(j.hours)}</span>
          <span class="tag">${esc(j.level)}</span>
        </div>
      </div>
      <div class="job-row__right">
        <div class="job-card__salary">${esc(j.salary)}<small>${esc(j.period)}</small></div>
        <span class="job-card__go">${ICON_ARROW}</span>
      </div>
    </button>`;

  // Homepage featured
  const featured = $("#featured-jobs");
  if (featured) {
    const list = JOBS.filter((j) => j.featured).concat(JOBS.filter((j) => !j.featured)).slice(0, 3);
    featured.innerHTML = list.map(cardHTML).join("");
    $$(".reveal", featured).forEach((el) => io.observe(el));
  }

  // Vacatures page
  const listEl = $("#jobs-list");
  if (listEl) {
    const params = new URLSearchParams(location.search);
    const state = {
      q: params.get("q") || "",
      loc: params.get("locatie") || "",
      sector: new Set(params.getAll("sector")),
      type: new Set(params.getAll("type")),
      level: new Set(params.getAll("niveau")),
      sort: "new",
    };
    const qInput = $("#q");
    const locSelect = $("#loc");
    qInput.value = state.q;

    const unique = (k) => [...new Set(JOBS.map((j) => j[k]))].sort((a, b) => a.localeCompare(b, "nl"));
    const cities = [...new Set(JOBS.flatMap((j) => j.location.split(" / ").filter((c) => c !== "Remote")))].sort((a, b) => a.localeCompare(b, "nl"));
    locSelect.innerHTML = '<option value="">Alle locaties</option>' + cities.map((c) => `<option ${c === state.loc ? "selected" : ""}>${esc(c)}</option>`).join("") + `<option value="Remote" ${state.loc === "Remote" ? "selected" : ""}>Remote</option>`;

    const buildFilter = (el, key, name) => {
      el.innerHTML = unique(key).map((v, i) => {
        const id = `${name}-${i}`;
        const n = JOBS.filter((j) => j[key] === v).length;
        return `<input type="checkbox" id="${id}" value="${esc(v)}" ${state[name].has(v) ? "checked" : ""}><label for="${id}"><span>${esc(v)}</span><em>${n}</em></label>`;
      }).join("");
      el.addEventListener("change", (e) => {
        e.target.checked ? state[name].add(e.target.value) : state[name].delete(e.target.value);
        render();
      });
    };
    buildFilter($("#f-sector"), "sector", "sector");
    buildFilter($("#f-type"), "type", "type");
    buildFilter($("#f-level"), "level", "level");

    const salaryMin = (j) => parseInt(j.salary.replace(/\./g, "").match(/\d+/)?.[0] || "0", 10) * (j.period.includes("uur") ? 160 : 1);

    function render() {
      const q = state.q.trim().toLowerCase();
      let res = JOBS.filter((j) =>
        (!q || [j.title, j.company, j.sector, j.summary, j.location].join(" ").toLowerCase().includes(q)) &&
        (!state.loc || j.location.includes(state.loc)) &&
        (!state.sector.size || state.sector.has(j.sector)) &&
        (!state.type.size || state.type.has(j.type)) &&
        (!state.level.size || state.level.has(j.level))
      );
      res.sort(state.sort === "salary" ? (a, b) => salaryMin(b) - salaryMin(a) : state.sort === "az" ? (a, b) => a.title.localeCompare(b.title, "nl") : (a, b) => a.posted - b.posted);
      $("#jobs-count").innerHTML = `<b>${res.length}</b> ${res.length === 1 ? "vacature" : "vacatures"} gevonden`;
      listEl.innerHTML = res.length ? res.map(rowHTML).join("") : `
        <div class="empty">
          <h3>Geen vacatures gevonden</h3>
          <p>Probeer andere filters — of laat je CV achter, dan zoeken wij actief met je mee.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:8px">
            <button class="btn btn--ghost btn--sm" data-reset>Filters wissen</button>
            <a class="btn btn--sm" href="voor-kandidaten.html#aanmelden">Open sollicitatie</a>
          </div>
        </div>`;
      const url = new URL(location.href);
      url.search = "";
      if (state.q) url.searchParams.set("q", state.q);
      if (state.loc) url.searchParams.set("locatie", state.loc);
      state.sector.forEach((v) => url.searchParams.append("sector", v));
      state.type.forEach((v) => url.searchParams.append("type", v));
      state.level.forEach((v) => url.searchParams.append("niveau", v));
      history.replaceState(null, "", url);
    }

    qInput.addEventListener("input", () => { state.q = qInput.value; render(); });
    locSelect.addEventListener("change", () => { state.loc = locSelect.value; render(); });
    $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
    $("#search-form").addEventListener("submit", (e) => { e.preventDefault(); $("#results")?.scrollIntoView({ behavior: "smooth" }); });
    $(".filters-toggle")?.addEventListener("click", () => $(".filters").classList.toggle("is-open"));
    document.addEventListener("click", (e) => {
      if (!e.target.closest("[data-reset]")) return;
      state.q = ""; state.loc = ""; state.sector.clear(); state.type.clear(); state.level.clear();
      qInput.value = ""; locSelect.value = "";
      $$(".filters input").forEach((i) => (i.checked = false));
      render();
    });
    render();
  }

  // Detail modal
  const modal = $("#job-modal");
  if (modal) {
    const panel = $(".modal__panel", modal);
    let lastFocus = null;
    const list = (arr) => `<ul class="checklist">${arr.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
    const open = (id) => {
      const j = JOBS.find((x) => x.id === id);
      if (!j) return;
      lastFocus = document.activeElement;
      $("[data-modal-content]", modal).innerHTML = `
        <div class="modal__head">
          <div class="orb orb--gold"></div>
          <div class="modal__head-inner">
            <div class="job-card__meta">
              <span class="tag tag--accent">${esc(j.type)}</span>
              <span class="tag">${esc(j.level)}</span>
              <span class="tag">${postedLabel(j.posted)}</span>
            </div>
            <h2 id="modal-title">${esc(j.title)}</h2>
            <p style="color:var(--on-dark-muted)">${esc(j.company)} · ${esc(j.sector)}</p>
          </div>
        </div>
        <div class="modal__facts">
          <div><span>Locatie</span><b>${esc(j.location)}</b></div>
          <div><span>Uren</span><b>${esc(j.hours)}</b></div>
          <div><span>Salaris</span><b>${esc(j.salary)}</b></div>
        </div>
        <div class="modal__body">
          <div><h3>Over de functie</h3><p>${esc(j.summary)}</p></div>
          <div><h3>Wat ga je doen?</h3>${list(j.tasks)}</div>
          <div><h3>Wie ben jij?</h3>${list(j.profile)}</div>
          <div><h3>Wat bieden ze?</h3>${list(j.offer)}</div>
          <div class="form-card" data-form-wrap id="apply">
            <form class="form" data-form="Sollicitatie">
              <div>
                <h3 style="font-size:24px;letter-spacing:-.03em;margin-bottom:6px">Solliciteer direct</h3>
                <p style="font-size:15px">Binnen 2 werkdagen heb je een persoonlijke reactie van je recruiter.</p>
              </div>
              <input type="hidden" name="vacature" value="${esc(j.title)}">
              <div class="form__row">
                <div class="field"><label for="a-name">Naam</label><input id="a-name" name="naam" required autocomplete="name" placeholder="Voor- en achternaam"></div>
                <div class="field"><label for="a-mail">E-mail</label><input id="a-mail" name="email" type="email" required autocomplete="email" placeholder="naam@voorbeeld.nl"></div>
              </div>
              <div class="field"><label for="a-tel">Telefoon</label><input id="a-tel" name="telefoon" type="tel" autocomplete="tel" placeholder="06 12345678"></div>
              <label class="file-drop">
                <input type="file" name="cv" accept=".pdf,.doc,.docx" required>
                <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></svg></i>
                <div><b>Upload je CV</b><span>PDF of Word, max. 5 MB</span></div>
              </label>
              <div class="field"><label for="a-mot">Korte motivatie <span class="muted">(optioneel)</span></label><textarea id="a-mot" name="motivatie" placeholder="Wat spreekt je aan in deze rol?"></textarea></div>
              <label class="consent"><input type="checkbox" required> <span>Ik ga akkoord met de verwerking van mijn gegevens volgens de <a href="#">privacyverklaring</a>.</span></label>
              <button class="btn btn--accent btn--block" type="submit">Verstuur sollicitatie ${ICON_ARROW.replace("<svg", '<svg class="arrow"')}</button>
            </form>
            <div class="form-success">
              <i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i>
              <h3>Sollicitatie ontvangen</h3>
              <p>Bedankt! Je recruiter neemt binnen 2 werkdagen persoonlijk contact met je op.</p>
            </div>
          </div>
        </div>`;
      bindForm($("[data-form]", modal));
      bindFileDrops(modal);
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      panel.scrollTop = 0;
      setTimeout(() => $(".modal__close", modal).focus(), 50);
    };
    const close = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lastFocus?.focus();
    };
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-job]");
      if (t) open(t.dataset.job);
      if (e.target.closest("[data-close]")) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
      if (e.key === "Tab" && modal.classList.contains("is-open")) {
        const f = $$('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])', panel).filter((x) => !x.disabled && x.offsetParent);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
        else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
      }
    });
  }
})();

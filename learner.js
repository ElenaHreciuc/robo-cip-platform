/* public/js/learner.js */
(function () {
  "use strict";

  // =========================================================
  // Registry complet – TOATE modulele + TOATE paginile tale
  // pageHref = /resources/<fisier>.html
  // =========================================================
  const MODULES = {
    "algoritmi-lingvistici": {
      title: "Algoritmi lingvistici și emoții",
      subtitle: "Mesaje „buguite”, reguli și excepții, etichetare (ML simplificat) și discuții despre emoții.",
      heroTag: "Limbaj · ML · mesaje",
      heroImage: "/assets/img/robo_algoritmi.png",
      cardClass: "module-algoritmi-card",
      items: [
        {
          missionId: "parser-propozitii",
          pill: "Parser de propoziții",
          miniLabel: "Subiect · predicat · sens",
          image: "/assets/img/robo_algoritmi.png",
          tagline: "Împarți propoziții pe părți și verifici dacă sensul rămâne clar.",
          bullets: ["Subliniezi verbele și subiectele.", "Arăți cum se schimbă sensul când schimbi ordinea.", "Clarifici propoziții ambigue."],
          creative: "Provocare: găsește o propoziție cu 2 sensuri și repar-o.",
          pageHref: "/resources/parser-propozitii.html",
          resources: []
        },
        {
          missionId: "eticheteaza-lumea",
          pill: "Etichetează lumea",
          miniLabel: "ML simplificat · categorii",
          image: "/assets/img/robo_algoritmi.png",
          tagline: "Înveți un „model” simplu să grupeze obiecte după criterii.",
          bullets: ["Alegi 3 criterii.", "Etichetezi 10 obiecte.", "Discuți despre criterii nedrepte."],
          creative: "Provocare: schimbă criteriul și compară deciziile.",
          pageHref: "/resources/eticheteaza-lumea.html",
          resources: []
        },
        {
          missionId: "clinica-mesaje",
          pill: "Clinica de mesaje",
          miniLabel: "Empatie · ton · claritate",
          image: "/assets/img/robo_algoritmi.png",
          tagline: "Rescrii mesaje astfel încât să fie clare, respectuoase și utile.",
          bullets: ["Identifici un mesaj care poate răni.", "Îl rescrii empatic.", "Explici schimbările."],
          creative: "Provocare: propune 2 variante – una scurtă și una super clară.",
          pageHref: "/resources/clinica-mesaje.html",
          resources: []
        },
        {
          missionId: "laborator-emotii",
          pill: "Laborator emoții",
          miniLabel: "Emoții · context · nuanțe",
          image: "/assets/img/robo_algoritmi.png",
          tagline: "Explorezi cum se schimbă emoția în funcție de context și cuvinte.",
          bullets: ["Asociezi emoții cu situații.", "Compari 2 contexte.", "Găsești cuvinte care schimbă tonul."],
          creative: "Provocare: rescrie aceeași propoziție în 3 tonuri diferite.",
          pageHref: "/resources/laborator-emotii.html",
          resources: []
        },
        {
          missionId: "reflection-talk",
          pill: "Reflection Talk",
          miniLabel: "Metacogniție · explicații",
          image: "/assets/img/robo_algoritmi.png",
          tagline: "Reflectezi asupra a ce ai învățat și cum ai explica altcuiva.",
          bullets: ["Ce a fost ușor și greu?", "Dă un exemplu de regulă/excepție.", "Cum îmbunătățești data viitoare?"],
          creative: "Provocare: explică în 30 secunde ce e o excepție.",
          pageHref: "/resources/reflection-talk.html",
          resources: []
        }
      ]
    },

    "cartografie-digitala": {
      title: "Hărți și Sateliți",
      subtitle: "Lucrezi cu hărți 5×5, trasee de robot, misiuni și decizii responsabile.",
      heroTag: "Trasee · mediu · reciclare",
      heroImage: "/assets/img/robo_cartografie.png",
      cardClass: "module-cartografie-card",
      items: [
        {
          missionId: "harta-grid",
          pill: "Harta Grid 5×5",
          miniLabel: "Trasee · coordonate",
          image: "/assets/img/robo_cartografie.png",
          tagline: "Robot navigator pe hartă grilă – planifici trasee și verifici reguli.",
          bullets: ["Start și destinație.", "Scrii pași (sus/jos/stânga/dreapta).", "Corectezi traseul."],
          creative: "Provocare: creează o hartă cu obstacole.",
          pageHref: "/resources/harta-grid.html",
          resources: []
        },
        {
          missionId: "sateliti-pamant",
          pill: "Sateliți și Pământul",
          miniLabel: "Observații · imagini",
          image: "/assets/img/robo_cartografie.png",
          tagline: "Explorezi planeta și interpretezi imaginile satelitare.",
          bullets: ["Descoperă.", "Experimentează.", "Explică."],
          creative: "Provocare: formulează o întrebare de cercetare.",
          pageHref: "/resources/sateliti-pamant.html",
          resources: []
        },
        {
          missionId: "jurnal-meteo",
          pill: "Vremea și observațiile",
          miniLabel: "Meteo · măsurători",
          image: "/assets/img/robo_cartografie.png",
          tagline: "Observi fenomenele meteo și interpretezi date.",
          bullets: ["Descoperă.", "Experimentează.", "Explică."],
          creative: "Provocare: formulează o întrebare de cercetare.",
          pageHref: "/resources/jurnal-meteo.html",
          resources: []
        },
        {
          missionId: "ecosisteme",
          pill: "Ecosisteme și biodiversitate",
          miniLabel: "Plante · viețuitoare",
          image: "/assets/img/robo_cartografie.png",
          tagline: "Investighezi organismele și habitatele.",
          bullets: ["Descoperă.", "Experimentează.", "Explică."],
          creative: "Provocare: formulează o întrebare de cercetare.",
          pageHref: "/resources/ecosisteme.html",
          resources: []
        },
        {
          missionId: "reciclare-materiale",
          pill: "Reciclare și materiale",
          miniLabel: "Resurse · deșeuri",
          image: "/assets/img/robo_cartografie.png",
          tagline: "Investighezi materialele și reducerea deșeurilor.",
          bullets: ["Descoperă.", "Experimentează.", "Explică."],
          creative: "Provocare: formulează o întrebare de cercetare.",
          pageHref: "/resources/reciclare-materiale.html",
          resources: []
        },
        {
          missionId: "module-report",
          pill: "Module Report",
          miniLabel: "Raport progres",
          image: "/assets/img/robo_cartografie.png",
          tagline: "Completezi raportul modulului și sumarizezi progresul.",
          bullets: ["Verifici activitățile.", "Notezi observații.", "Salvezi raportul."],
          creative: "",
          pageHref: "/resources/module-report.html",
          resources: []
        }
      ]
    },

    "proiectare-3d": {
      title: "Orașe și Poduri 3D",
      subtitle: "Construiești în 3D: orașe, poduri, transformări și gândire spațială.",
      heroTag: "Forme · stabilitate · origami",
      heroImage: "/assets/img/robo_3d.png",
      cardClass: "module-proiectare-card",
      items: [
        {
          missionId: "constructor-3d",
          pill: "Constructor 3D",
          miniLabel: "Niveluri · volum",
          image: "/assets/img/robo_3d.png",
          tagline: "Construiești un oraș 3D pe niveluri și explici alegerile.",
          bullets: ["Alegi elemente.", "Le plasezi pe niveluri.", "Testezi stabilitatea."],
          creative: "Provocare: proiectează un mini-oraș cu 3 zone.",
          pageHref: "/resources/constructor-3d.html",
          resources: []
        },
        {
          missionId: "pod-inteligent",
          pill: "Podul Inteligent",
          miniLabel: "Inginerie · structuri",
          image: "/assets/img/robo_3d.png",
          tagline: "Proiectezi un pod, reglezi susținerile și compari solicitări într-un model educațional.",
          bullets: ["Ajustezi parametrii.", "Observi și calculezi.", "Verifici obiectivul."],
          creative: "Provocare: explică și îmbunătățește soluția.",
          pageHref: "/resources/pod-inteligent.html",
          resources: []
        },
        {
          missionId: "parghii-echilibru",
          pill: "Pârghii și echilibru",
          miniLabel: "Fizică · mecanică",
          image: "/assets/img/robo_3d.png",
          tagline: "Experimentezi cu forțe, brațe și echilibru folosind un model de pârghie.",
          bullets: ["Ajustezi parametrii.", "Observi și calculezi.", "Verifici obiectivul."],
          creative: "Provocare: explică și îmbunătățește soluția.",
          pageHref: "/resources/parghii-echilibru.html",
          resources: []
        },
        {
          missionId: "lumina-umbre",
          pill: "Lumina și umbrele",
          miniLabel: "Optică · geometrie",
          image: "/assets/img/robo_3d.png",
          tagline: "Modifici sursa și obiectul, apoi estimezi matematic lungimea umbrei.",
          bullets: ["Ajustezi parametrii.", "Observi și calculezi.", "Verifici obiectivul."],
          creative: "Provocare: explică și îmbunătățește soluția.",
          pageHref: "/resources/lumina-umbre.html",
          resources: []
        },
        {
          missionId: "corpuri-geometrice",
          pill: "Atelierul corpurilor",
          miniLabel: "Volum · arii",
          image: "/assets/img/robo_3d.png",
          tagline: "Construiești corpuri geometrice și calculezi volumul și aria totală.",
          bullets: ["Ajustezi parametrii.", "Observi și calculezi.", "Verifici obiectivul."],
          creative: "Provocare: explică și îmbunătățește soluția.",
          pageHref: "/resources/corpuri-geometrice.html",
          resources: []
        },
        {
          missionId: "masina-transformari",
          pill: "Mașina transformări",
          miniLabel: "2D → 3D · forme",
          image: "/assets/img/robo_3d.png",
          tagline: "Transformi forme și înțelegi cum apar volumele.",
          bullets: ["Alegi o formă 2D.", "Aplici transformări.", "Obții un volum 3D."],
          creative: "Provocare: creează 2 obiecte din aceeași formă.",
          pageHref: "/resources/masina-transformari.html",
          resources: []
        }
      ]
    },

    "programare-vizuala": {
      title: "Sunete și Animații",
      subtitle: "Sunete, animații și misiuni STEAM inspirate din viața reală.",
      heroTag: "Tipare · STEAM · animații",
      heroImage: "/assets/img/robo_programare.png",
      cardClass: "module-programare-card",
      items: [
        {
          missionId: "laborator-ritmuri",
          pill: "Laborator ritmuri",
          miniLabel: "Tipare · secvențe",
          image: "/assets/img/robo_programare.png",
          tagline: "Construiești tipare de ritm și înțelegi repetițiile.",
          bullets: ["Alegi un pattern.", "Rulezi secvența.", "Compari 2 tipare."],
          creative: "Provocare: creează un ritm care exprimă o emoție.",
          pageHref: "/resources/laborator-ritmuri.html",
          resources: []
        },
        {
          missionId: "constructor-povesti",
          pill: "Constructor povești",
          miniLabel: "Narațiune · structură",
          image: "/assets/img/robo_programare.png",
          tagline: "Construiești o poveste (scene/secvențe) – util pentru animații.",
          bullets: ["Alegi personaje.", "Setezi scene.", "Generezi structură."],
          creative: "",
          pageHref: "/resources/constructor-povesti.html",
          resources: []
        },
        {
          missionId: "semafor-sonor",
          pill: "Semaforul sonor",
          miniLabel: "Siguranță · algoritmi",
          image: "/assets/img/robo_programare.png",
          tagline: "Programezi timpii unui semafor într-o situație de educație rutieră.",
          bullets: ["Modifici valorile.", "Observi și calculezi.", "Construiești un mesaj STEAM."],
          creative: "Provocare: explică regula și rezultatul colegilor.",
          pageHref: "/resources/semafor-sonor.html",
          resources: []
        },
        {
          missionId: "alerta-meteo-steam",
          pill: "Alerta meteo",
          miniLabel: "Științe · date",
          image: "/assets/img/robo_programare.png",
          tagline: "Analizezi temperatura, ploaia și vântul într-o stație meteo virtuală.",
          bullets: ["Modifici valorile.", "Observi și calculezi.", "Construiești un mesaj STEAM."],
          creative: "Provocare: explică regula și rezultatul colegilor.",
          pageHref: "/resources/alerta-meteo-steam.html",
          resources: []
        },
        {
          missionId: "economisim-apa",
          pill: "Economisim apa",
          miniLabel: "Mediu · matematică",
          image: "/assets/img/robo_programare.png",
          tagline: "Calculezi apa economisită și creezi un mesaj pentru comunitate.",
          bullets: ["Modifici valorile.", "Observi și calculezi.", "Construiești un mesaj STEAM."],
          creative: "Provocare: explică regula și rezultatul colegilor.",
          pageHref: "/resources/economisim-apa.html",
          resources: []
        },
        {
          missionId: "portofolio",
          pill: "Portofoliu",
          miniLabel: "Colecție lucrări",
          image: "/assets/img/robo_programare.png",
          tagline: "Organizezi produsele realizate (portofoliu).",
          bullets: ["Adaugi un produs.", "Scrii descriere.", "Salvezi."],
          creative: "",
          pageHref: "/resources/portofolio.html",
          resources: []
        }
      ]
    }
  };

  // =========================================================
  // Helpers
  // =========================================================
  const $ = (id) => document.getElementById(id);

  function getModuleIdFromQuery() {
    const url = new URL(window.location.href);
    const raw = (url.searchParams.get("moduleId") || "").trim();
    if (raw === "algoritmi-lingvistic") return "algoritmi-lingvistici";
    return raw || "algoritmi-lingvistici";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  function clampInt(n, min, max) {
    const x = Number.isFinite(n) ? n : parseInt(n, 10);
    if (!Number.isFinite(x)) return min;
    return Math.max(min, Math.min(max, x));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function buildOpenLink(item, moduleId) {
    if (!item.pageHref) return "#";
    const url = new URL(item.pageHref, window.location.origin);
    url.searchParams.set("moduleId", moduleId);
    url.searchParams.set("missionId", item.missionId);
    return url.pathname + url.search;
  }

  // =========================================================
  // Storage
  // =========================================================
  function storageKey(moduleId) {
    return `roboCip:module:${moduleId}`;
  }

  function loadState(moduleId) {
    const raw = localStorage.getItem(storageKey(moduleId));
    if (!raw) return { moduleId, missions: {}, updatedAt: nowIso() };
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.moduleId !== moduleId) throw new Error("bad");
      parsed.missions = parsed.missions || {};
      return parsed;
    } catch {
      return { moduleId, missions: {}, updatedAt: nowIso() };
    }
  }

  function saveState(moduleId, state) {
    state.updatedAt = nowIso();
    localStorage.setItem(storageKey(moduleId), JSON.stringify(state));
  }

  // =========================================================
  // Core
  // =========================================================
  const moduleId = getModuleIdFromQuery();
  const moduleDef = MODULES[moduleId];

  if (!moduleDef) {
    document.body.innerHTML = `<div style="padding:16px;font-family:system-ui">
      <h2>Modul necunoscut</h2>
      <p>moduleId="${escapeHtml(moduleId)}" nu există în learner.js</p>
      <p><a href="/modules.html">Înapoi la module</a></p>
    </div>`;
    return;
  }

  let state = loadState(moduleId);

  const ageTrack = new URL(window.location.href).searchParams.get("age") || localStorage.getItem("roboCip:ageTrack") || "7-8";
  const ageLabels = {"7-8":"7–8 ani · Descopăr","8-9":"8–9 ani · Construiesc","9-10":"9–10 ani · Investighez"};
  const selectedAgeLabel = ageLabels[ageTrack] || ageLabels["7-8"];

  function renderHero() {
    $("module-title").textContent = moduleDef.title;
    $("module-subtitle").textContent = moduleDef.subtitle;
    $("module-hero-tag").textContent = moduleDef.heroTag + " · " + selectedAgeLabel;

    const img = $("module-hero-image");
    img.src = moduleDef.heroImage;
    img.alt = `Robo-Cip în modulul: ${moduleDef.title}`;
    img.onerror = () => { img.onerror = null; img.src = "/assets/img/robo_hero.png"; };
  }

  function computeProgress() {
    const total = moduleDef.items.length;
    let doneCount = 0, starSum = 0;
    for (const it of moduleDef.items) {
      const ms = state.missions[it.missionId];
      if (ms?.done) doneCount++;
      starSum += clampInt(ms?.stars ?? 0, 0, 3);
    }
    const pct = total ? Math.round((doneCount / total) * 100) : 0;
    return { total, doneCount, pct, starSum };
  }

  function renderProgress() {
    const { total, doneCount, pct, starSum } = computeProgress();
    $("module-progress-label").textContent = `Progres modul: ${doneCount}/${total} resurse (${pct}%)`;
    $("module-progress-fill").style.width = `${pct}%`;

    const badges = $("module-badges");
    badges.innerHTML = "";
    const b1 = document.createElement("span");
    b1.className = "badge";
    b1.textContent = `★ total: ${starSum}`;
    badges.appendChild(b1);

    const b2 = document.createElement("span");
    b2.className = "badge";
    b2.textContent = `✓ terminate: ${doneCount}`;
    badges.appendChild(b2);
  }

  // Modal
  let modalMissionId = null;

  function ensureMissionState(missionId) {
    if (!state.missions[missionId]) state.missions[missionId] = { done: false, stars: 0, updatedAt: nowIso() };
    return state.missions[missionId];
  }

  function closeModal() {
    const backdrop = $("modal-backdrop");
    backdrop.style.display = "none";
    document.body.style.overflow = "";
    document.onkeydown = null;
  }

  function renderModalStars() {
    const row = $("modal-stars");
    row.innerHTML = "";
    const ms = state.missions[modalMissionId] || { done: false, stars: 0 };
    const current = clampInt(ms.stars ?? 0, 0, 3);

    for (let n = 0; n <= 3; n++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "star-btn";
      b.setAttribute("aria-pressed", String(n === current));
      b.textContent = n === 0 ? "0" : "★".repeat(n);
      b.onclick = () => setStars(modalMissionId, n);
      row.appendChild(b);
    }
  }

  function renderModalStatus() {
    const ms = state.missions[modalMissionId] || { done: false, stars: 0 };
    const stars = clampInt(ms.stars ?? 0, 0, 3);
    const starsText = stars ? "★".repeat(stars) : "—";
    $("modal-status").textContent = `${ms.done ? "Terminat" : "În lucru"} · ${starsText}`;

    const btn = $("modal-done-toggle");
    btn.textContent = ms.done ? "Marchează ca neterminat" : "Am terminat misiunea";
    btn.onclick = () => toggleDone(modalMissionId);
  }

  function openModal(missionId) {
    const item = moduleDef.items.find((x) => x.missionId === missionId);
    if (!item) return;
    modalMissionId = missionId;

    $("modal-title").textContent = item.pill;
    $("modal-creative").textContent = item.creative || "";

    const resWrap = $("modal-resources");
    const resButtons = $("resource-buttons");
    resButtons.innerHTML = "";

    if (item.pageHref) {
      const a0 = document.createElement("a");
      a0.className = "resource-btn";
      a0.href = buildOpenLink(item, moduleId);
      a0.target = item.missionId === "masina-transformari" ? "_self" : "_blank";
      a0.rel = "noopener";
      a0.textContent = "Deschide activitatea";
      resButtons.appendChild(a0);
    }

    (item.resources || []).forEach((r) => {
      const a = document.createElement("a");
      a.className = "resource-btn";
      a.href = r.href;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = r.label;
      resButtons.appendChild(a);
    });

    resWrap.style.display = resButtons.children.length ? "" : "none";

    renderModalStars();
    renderModalStatus();

    const backdrop = $("modal-backdrop");
    backdrop.style.display = "flex";
    backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    $("modal-close").onclick = closeModal;
    backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };
    document.onkeydown = (e) => { if (e.key === "Escape") closeModal(); };
  }

  function toggleDone(missionId) {
    const ms = ensureMissionState(missionId);
    ms.done = !ms.done;
    ms.updatedAt = nowIso();
    saveState(moduleId, state);
    renderAll();
    if (modalMissionId === missionId) { renderModalStars(); renderModalStatus(); }
  }

  function setStars(missionId, stars) {
    const ms = ensureMissionState(missionId);
    ms.stars = clampInt(stars, 0, 3);
    ms.updatedAt = nowIso();
    saveState(moduleId, state);
    renderAll();
    if (modalMissionId === missionId) { renderModalStars(); renderModalStatus(); }
  }

  function renderCards() {
    const grid = $("resources-grid");
    grid.innerHTML = "";

    for (const item of moduleDef.items) {
      const ms = state.missions[item.missionId] || { done: false, stars: 0 };
      const stars = clampInt(ms.stars ?? 0, 0, 3);
      const starsText = stars ? "★".repeat(stars) : "—";
      const doneText = ms.done ? "Terminat" : "În lucru";

      const bulletsHtml = (item.bullets || []).map((b) => `<li>${escapeHtml(b)}</li>`).join("");
      const openHref = buildOpenLink(item, moduleId);
      const openTarget = item.missionId === "masina-transformari" ? "_self" : "_blank";

      const card = document.createElement("article");
      card.className = `module-card ${moduleDef.cardClass || ""}`;
      card.dataset.missionId = item.missionId;

      card.innerHTML = `
        <div class="module-header-row">
          <span class="module-pill">${escapeHtml(item.pill)}</span>
          <span class="module-mini-label">${escapeHtml(item.miniLabel)}</span>
        </div>

        <div class="module-visual">
          <img src="${escapeHtml(item.image)}" alt="" loading="lazy" decoding="async">
        </div>

        <p class="module-tagline">${escapeHtml(item.tagline)}</p>
        <ul class="module-bullets">${bulletsHtml}</ul>

        <div class="module-footer-row" style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px;">
          <span class="mission-chip">${doneText} · ${starsText}</span>
          <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
            <a class="module-link" href="${escapeHtml(openHref)}" target="${openTarget}" rel="noopener">Intră în activitate</a>
            <button type="button" class="module-link" data-action="open">Deschide detalii</button>
            <button type="button" class="mission-done-btn" data-action="toggleDone">
              ${ms.done ? "Marchează ca neterminat" : "Am terminat"}
            </button>
          </div>
        </div>
      `;

      const img = card.querySelector("img");
      img.onerror = () => { img.onerror = null; img.src = "/assets/img/robo_hero.png"; };
      grid.appendChild(card);
    }

    grid.onclick = (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const card = btn.closest("article[data-mission-id]");
      if (!card) return;
      const missionId = card.dataset.missionId;
      if (btn.dataset.action === "open") openModal(missionId);
      if (btn.dataset.action === "toggleDone") toggleDone(missionId);
    };
  }

  function renderAll() {
    renderHero();
    renderProgress();
    renderCards();
  }

  function init() {
    const backdrop = $("modal-backdrop");
    if (backdrop) backdrop.style.display = "none";
    renderAll();
  }

  init();
})();

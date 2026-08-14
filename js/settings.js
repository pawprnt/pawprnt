const SET_KEY = "pawprntos.settings";

const ACCENTS = [
  { name: "lavender", value: "#c7a2ff" },
  { name: "pink", value: "#ff9dd2" },
  { name: "mint", value: "#9be0a8" },
  { name: "sky", value: "#7fd1e0" },
  { name: "amber", value: "#ffd77a" },
  { name: "coral", value: "#ff8f8a" },
];

const DEFAULT_SETTINGS = {
  accent: "#c7a2ff",
  theme: "dark",
  motion: true,
  corners: true,
  blur: true,
  fontSize: "md",
  clock24: false,
  boot: true,
};

const FONT_SIZES = { sm: "14px", md: "16px", lg: "18px" };

function loadSettings() {
  try {
    return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(SET_KEY) || "null"));
  } catch (e) {
    return Object.assign({}, DEFAULT_SETTINGS);
  }
}

function saveSettings(s) {
  try { localStorage.setItem(SET_KEY, JSON.stringify(s)); } catch (e) {}
}

function applySettings(s) {
  const set = s || loadSettings();
  const root = document.documentElement;
  root.dataset.theme = set.theme;
  root.style.setProperty("--accent", set.accent);
  root.dataset.motion = set.motion ? "on" : "off";
  root.dataset.corners = set.corners ? "on" : "off";
  root.dataset.blur = set.blur ? "on" : "off";
  root.style.fontSize = FONT_SIZES[set.fontSize] || "16px";
  if (window.__tickTaskClock) window.__tickTaskClock();
  if (window.__tickStatusClock) window.__tickStatusClock();
  return set;
}

function initSettings(container) {
  const current = loadSettings();

  const shell = document.createElement("div");
  shell.className = "set-shell";
  const nav = document.createElement("div");
  nav.className = "set-nav";
  const body = document.createElement("div");
  body.className = "set-body";
  shell.appendChild(nav);
  shell.appendChild(body);
  container.appendChild(shell);

  const panels = {};
  const navBtns = [];
  const mkPanel = (id, label) => {
    const p = document.createElement("div");
    p.className = "set-panel" + (Object.keys(panels).length ? " hidden" : "");
    p.dataset.panel = id;
    body.appendChild(p);
    panels[id] = p;
    const b = document.createElement("button");
    b.className = "set-nav-btn" + (Object.keys(panels).length === 1 ? " active" : "");
    b.textContent = label;
    b.addEventListener("click", () => {
      navBtns.forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      Object.keys(panels).forEach((k) => panels[k].classList.toggle("hidden", k !== id));
    });
    nav.appendChild(b);
    navBtns.push(b);
    return p;
  };

  const card = (label) => {
    const c = document.createElement("div");
    c.className = "set-card";
    const l = document.createElement("div");
    l.className = "set-card-label";
    l.textContent = label;
    c.appendChild(l);
    return c;
  };

  const toggleRow = (label, value, on) => {
    const row = document.createElement("div");
    row.className = "set-row";
    const lab = document.createElement("div");
    lab.className = "set-row-label";
    lab.textContent = label;
    const sw = document.createElement("button");
    sw.className = "set-toggle";
    sw.type = "button";
    sw.setAttribute("role", "switch");
    sw.setAttribute("aria-checked", String(value));
    if (value) sw.classList.add("on");
    sw.addEventListener("click", () => {
      value = !value;
      sw.classList.toggle("on", value);
      sw.setAttribute("aria-checked", String(value));
      on(value);
    });
    row.appendChild(lab);
    row.appendChild(sw);
    return row;
  };

  const seg = (options, value, on) => {
    const el = document.createElement("div");
    el.className = "set-seg";
    options.forEach(([id, label]) => {
      const b = document.createElement("button");
      b.textContent = label;
      if (value === id) b.classList.add("active");
      b.addEventListener("click", () => {
        el.querySelectorAll("button").forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        on(id);
      });
      el.appendChild(b);
    });
    return el;
  };

  const appearance = mkPanel("appearance", "appearance");

  const accentCard = card("accent color");
  const swatches = document.createElement("div");
  swatches.className = "swatches";
  const renderSwatches = () => {
    swatches.textContent = "";
    ACCENTS.forEach((a) => {
      const sw = document.createElement("button");
      sw.className = "swatch";
      sw.style.background = a.value;
      sw.title = a.name;
      if (current.accent.toLowerCase() === a.value) sw.classList.add("active");
      sw.addEventListener("click", () => {
        current.accent = a.value;
        applySettings(current);
        saveSettings(current);
        custom.value = current.accent;
        renderSwatches();
      });
      swatches.appendChild(sw);
    });
  };
  renderSwatches();
  accentCard.appendChild(swatches);
  const custom = document.createElement("input");
  custom.type = "color";
  custom.className = "custom-color";
  custom.value = current.accent;
  custom.title = "custom color";
  custom.addEventListener("input", () => {
    current.accent = custom.value;
    applySettings(current);
    saveSettings(current);
    renderSwatches();
  });
  accentCard.appendChild(custom);
  appearance.appendChild(accentCard);

  const themeCard = card("theme");
  const themeRow = document.createElement("div");
  themeRow.className = "theme-row";
  ["dark", "light"].forEach((t) => {
    const b = document.createElement("button");
    b.className = "theme-btn";
    if (current.theme === t) b.classList.add("active");
    b.textContent = t;
    b.addEventListener("click", () => {
      current.theme = t;
      applySettings(current);
      saveSettings(current);
      themeRow.querySelectorAll(".theme-btn").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
    });
    themeRow.appendChild(b);
  });
  themeCard.appendChild(themeRow);
  appearance.appendChild(themeCard);

  const sizeCard = card("text size");
  sizeCard.appendChild(seg([["sm", "small"], ["md", "default"], ["lg", "large"]], current.fontSize, (v) => {
    current.fontSize = v;
    applySettings(current);
    saveSettings(current);
  }));
  appearance.appendChild(sizeCard);

  const wallpaper = mkPanel("wallpaper", "wallpaper");
  const wallCard = card("desktop wallpaper");
  const wallGrid = document.createElement("div");
  wallGrid.className = "set-wall";
  injectWpKeyframes();
  const wpCurrent = savedWallpaper() || "forest";
  for (const wp of WALLPAPERS) {
    const cell = document.createElement("div");
    cell.className = "set-wp-cell";
    if (wp.id === wpCurrent) cell.classList.add("active");
    const thumb = document.createElement("div");
    thumb.className = "set-wp-thumb";
    thumb.style.background = wp.css;
    if (wp.anim) thumb.style.animation = wp.anim;
    const name = document.createElement("div");
    name.className = "set-wp-name";
    name.textContent = wp.name;
    cell.appendChild(thumb);
    cell.appendChild(name);
    cell.addEventListener("click", () => {
      applyWallpaper(wp.id);
      wallGrid.querySelectorAll(".set-wp-cell").forEach((c) => c.classList.remove("active"));
      cell.classList.add("active");
    });
    wallGrid.appendChild(cell);
  }
  wallCard.appendChild(wallGrid);
  wallpaper.appendChild(wallCard);

  const behavior = mkPanel("behavior", "behavior");

  const clockCard = card("clock");
  clockCard.appendChild(seg([["12", "12 hour"], ["24", "24 hour"]], current.clock24 ? "24" : "12", (v) => {
    current.clock24 = v === "24";
    applySettings(current);
    saveSettings(current);
  }));
  behavior.appendChild(clockCard);

  const motionCard = card("motion");
  motionCard.appendChild(toggleRow("animations", current.motion, (v) => {
    current.motion = v;
    applySettings(current);
    saveSettings(current);
  }));
  motionCard.appendChild(toggleRow("boot animation", current.boot, (v) => {
    current.boot = v;
    saveSettings(current);
  }));
  behavior.appendChild(motionCard);

  const lookCard = card("look");
  lookCard.appendChild(toggleRow("rounded corners", current.corners, (v) => {
    current.corners = v;
    applySettings(current);
    saveSettings(current);
  }));
  lookCard.appendChild(toggleRow("blur + transparency", current.blur, (v) => {
    current.blur = v;
    applySettings(current);
    saveSettings(current);
  }));
  behavior.appendChild(lookCard);

  const general = mkPanel("general", "general");

  const resetCard = card("reset");
  const resetBtn = document.createElement("button");
  resetBtn.className = "set-reset";
  resetBtn.textContent = "reset to defaults";
  resetBtn.addEventListener("click", () => {
    saveSettings(Object.assign({}, DEFAULT_SETTINGS));
    location.reload();
  });
  resetCard.appendChild(resetBtn);
  general.appendChild(resetCard);
}

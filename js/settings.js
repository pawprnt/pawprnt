const SET_KEY = "pawprntos.settings";

const ACCENTS = [
  { name: "lavender", value: "#c7a2ff" },
  { name: "pink", value: "#ff9dd2" },
  { name: "mint", value: "#9be0a8" },
  { name: "sky", value: "#7fd1e0" },
  { name: "amber", value: "#ffd77a" },
  { name: "coral", value: "#ff8f8a" },
];

const DEFAULT_SETTINGS = { accent: "#c7a2ff", theme: "dark" };

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
  document.documentElement.dataset.theme = set.theme;
  document.documentElement.style.setProperty("--accent", set.accent);
  return set;
}

function initSettings(container) {
  const wrap = document.createElement("div");
  wrap.className = "set-wrap";
  const current = loadSettings();

  const sec = (label) => {
    const s = document.createElement("div");
    s.className = "set-sec";
    const l = document.createElement("div");
    l.className = "set-label";
    l.textContent = label;
    s.appendChild(l);
    wrap.appendChild(s);
    return s;
  };

  const accentSec = sec("accent");
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
  accentSec.appendChild(swatches);

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
  accentSec.appendChild(custom);

  const themeSec = sec("theme");
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
  themeSec.appendChild(themeRow);

  const wallSec = sec("wallpaper");
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
  wallSec.appendChild(wallGrid);

  container.appendChild(wrap);
}

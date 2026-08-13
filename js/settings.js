const SET_KEY = "pawprntos.settings";

const ACCENTS = [
  { name: "lavender", value: "#c7a2ff" },
  { name: "pink", value: "#ff9dd2" },
  { name: "mint", value: "#9be0a8" },
  { name: "sky", value: "#7fd1e0" },
  { name: "amber", value: "#ffd77a" },
  { name: "coral", value: "#ff8f8a" },
];

const DEFAULT_SETTINGS = { accent: "#c7a2ff", theme: "dark", motion: true, corners: true, blur: true };

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

  const motionSec = sec("motion");
  motionSec.appendChild(toggleRow("animations", current.motion, (v) => {
    current.motion = v;
    applySettings(current);
    saveSettings(current);
  }));

  const cornersSec = sec("corners");
  cornersSec.appendChild(toggleRow("rounded corners", current.corners, (v) => {
    current.corners = v;
    applySettings(current);
    saveSettings(current);
  }));

  const blurSec = sec("blur");
  blurSec.appendChild(toggleRow("blur + transparency", current.blur, (v) => {
    current.blur = v;
    applySettings(current);
    saveSettings(current);
  }));

  const resetSec = sec("reset");
  const resetBtn = document.createElement("button");
  resetBtn.className = "theme-btn";
  resetBtn.textContent = "reset to defaults";
  resetBtn.addEventListener("click", () => {
    saveSettings(Object.assign({}, DEFAULT_SETTINGS));
    location.reload();
  });
  resetSec.appendChild(resetBtn);

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

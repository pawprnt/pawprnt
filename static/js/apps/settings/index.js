// settings/index.js — settings app for pawprntos
// ui for changing accent color, theme, motion, font size, etc.

function initSettings(container) {
  const current = loadSettings();

  function updateSetting(prop, value) {
    current[prop] = value;
    applySettings(current);
    saveSettings(current);
  }

  const shell = el("div", "set-shell");
  const nav = el("div", "set-nav");
  const body = el("div", "set-body");
  shell.appendChild(nav);
  shell.appendChild(body);
  container.appendChild(shell);

  const panels = {};
  const navBtns = [];
  const mkPanel = (id, label) => {
    const p = el("div", "set-panel" + (Object.keys(panels).length ? " hidden" : ""));
    p.dataset.panel = id;
    body.appendChild(p);
    panels[id] = p;
    const b = el("button", "set-nav-btn" + (Object.keys(panels).length === 1 ? " active" : ""));
    b.textContent = label;
    b.addEventListener("click", () => {
      setActive(nav, ".set-nav-btn", b);
      Object.keys(panels).forEach((k) => panels[k].classList.toggle("hidden", k !== id));
    });
    nav.appendChild(b);
    navBtns.push(b);
    return p;
  };

  const card = (label) => {
    const c = el("div", "set-card");
    const l = el("div", "set-card-label");
    l.textContent = label;
    c.appendChild(l);
    return c;
  };

  const toggleRow = (label, value, on) => {
    const row = el("div", "set-row");
    const lab = el("div", "set-row-label");
    lab.textContent = label;
    const sw = el("button", "set-toggle");
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
    const segEl = el("div", "set-seg");
    options.forEach(([id, label]) => {
      const b = el("button");
      b.textContent = label;
      if (value === id) b.classList.add("active");
      b.addEventListener("click", () => {
        setActive(segEl, "button", b);
        on(id);
      });
      segEl.appendChild(b);
    });
    return segEl;
  };

  const appearance = mkPanel("appearance", "appearance");

  const accentCard = card("accent color");
  const swatches = el("div", "swatches");
  const renderSwatches = () => {
    swatches.textContent = "";
    ACCENTS.forEach((a) => {
      const sw = el("button", "swatch");
      sw.style.background = a.value;
      sw.title = a.name;
      if (current.accent.toLowerCase() === a.value) sw.classList.add("active");
      sw.addEventListener("click", () => {
        updateSetting("accent", a.value);
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
    updateSetting("accent", custom.value);
    renderSwatches();
  });
  accentCard.appendChild(custom);
  appearance.appendChild(accentCard);

  const themeCard = card("theme");
  const themeRow = el("div", "theme-row");
  ["dark", "light"].forEach((t) => {
    const b = el("button", "theme-btn");
    if (current.theme === t) b.classList.add("active");
    b.textContent = t;
    b.addEventListener("click", () => {
      updateSetting("theme", t);
      setActive(themeRow, ".theme-btn", b);
    });
    themeRow.appendChild(b);
  });
  themeCard.appendChild(themeRow);
  appearance.appendChild(themeCard);

  const sizeCard = card("text size");
  sizeCard.appendChild(seg([["sm", "small"], ["md", "default"], ["lg", "large"]], current.fontSize, (v) => {
    updateSetting("fontSize", v);
  }));
  appearance.appendChild(sizeCard);

  const wallpaper = mkPanel("wallpaper", "wallpaper");
  const wallCard = card("desktop wallpaper");
  const wallGrid = el("div", "set-wall");
  injectWpKeyframes();
  const wpCurrent = savedWallpaper() || "forest";
  for (const wp of WALLPAPERS) {
    const cell = el("div", "set-wp-cell");
    if (wp.id === wpCurrent) cell.classList.add("active");
    const thumb = el("div", "set-wp-thumb");
    thumb.style.background = wp.css;
    if (wp.anim) thumb.style.animation = wp.anim;
    const name = el("div", "set-wp-name");
    name.textContent = wp.name;
    cell.appendChild(thumb);
    cell.appendChild(name);
    cell.addEventListener("click", () => {
      applyWallpaper(wp.id);
      setActive(wallGrid, ".set-wp-cell", cell);
    });
    wallGrid.appendChild(cell);
  }
  wallCard.appendChild(wallGrid);
  wallpaper.appendChild(wallCard);

  const behavior = mkPanel("behavior", "behavior");

  const clockCard = card("clock");
  clockCard.appendChild(seg([["12", "12 hour"], ["24", "24 hour"]], current.clock24 ? "24" : "12", (v) => {
    updateSetting("clock24", v === "24");
  }));
  behavior.appendChild(clockCard);

  const motionCard = card("motion");
  motionCard.appendChild(toggleRow("animations", current.motion, (v) => {
    updateSetting("motion", v);
  }));
  motionCard.appendChild(toggleRow("boot animation", current.boot, (v) => {
    current.boot = v;
    saveSettings(current);
  }));
  behavior.appendChild(motionCard);

  const lookCard = card("look");
  lookCard.appendChild(toggleRow("rounded corners", current.corners, (v) => {
    updateSetting("corners", v);
  }));
  lookCard.appendChild(toggleRow("blur + transparency", current.blur, (v) => {
    updateSetting("blur", v);
  }));
  behavior.appendChild(lookCard);

  const general = mkPanel("general", "general");

  const resetCard = card("reset");
  const resetBtn = el("button", "set-reset");
  resetBtn.textContent = "reset to defaults";
  resetBtn.addEventListener("click", () => {
    saveSettings(Object.assign({}, DEFAULT_SETTINGS));
    location.reload();
  });
  resetCard.appendChild(resetBtn);
  general.appendChild(resetCard);
}

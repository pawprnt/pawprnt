const OPEN = {};

function openApp(key) {
  const app = APPS[key];
  const w = app.open();
  if (w && w.el) {
    (OPEN[key] = OPEN[key] || []).push(w.el);
    syncTaskbar();
  }
  return w;
}

function syncTaskbar() {
  const focused = WM.focusedEl ? WM.focusedEl() : null;
  document.querySelectorAll(".task-btn").forEach((btn) => {
    const key = btn.dataset.app;
    const wins = (OPEN[key] || []).filter((el) => el.isConnected);
    btn.classList.toggle("has", wins.length > 0);
    btn.classList.toggle("active", wins.includes(focused));
  });
}

function initTaskbar() {
  const bar = document.getElementById("taskbar");
  bar.textContent = "";
  for (const key of Object.keys(APPS)) {
    const app = APPS[key];
    const btn = document.createElement("button");
    btn.className = "task-btn";
    btn.dataset.app = key;
    btn.title = app.name;
    btn.innerHTML =
      '<div class="tile" style="background:' +
      app.tile +
      '">' +
      ICONS[app.icon] +
      "</div>";
    btn.addEventListener("click", () => {
      const wins = (OPEN[key] || []).filter((el) => el.isConnected);
      if (wins.length) {
        const el = wins[wins.length - 1];
        el.classList.remove("hidden");
        WM.focus(el);
      } else {
        openApp(key);
      }
    });
    bar.appendChild(btn);
  }

  const clock = document.createElement("div");
  clock.className = "task-clock";
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  tick();
  setInterval(tick, 10000);
  bar.appendChild(clock);

  WM.onChanged(syncTaskbar);
  syncTaskbar();
}

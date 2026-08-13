const ICONS = {
  term: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  files: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  about: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  proj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  wall: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
  set: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
};

const TILE_COLORS = {
  term: "#9be0a8",
  files: "#ff9dd2",
  about: "#c7a2ff",
  proj: "#7fd1e0",
  wall: "#ffd77a",
  set: "#a9b0c8",
};

function neofetchAscii() {
  return "   ,     ,\n   )\\_._/(\n  =>  Y  <=\n  /       \\\n  \\       /\n   \\     /\n    )|(\n     \" \"";
}

function printNeofetch(out) {
  out.add('pawprntos 0.1', "c-pink", true);
  out.add("");
  out.add(neofetchAscii(), "ascii");
  out.add("");
  out.add("  os:      pawprntos 0.1", "c-green");
  out.add("  host:    github.com/pawprnt", "");
  out.add("  kernel:  mostly lowercase, some cat", "");
  out.add("  uptime:  a few weeks", "");
  out.add("  status:  work in progress, always", "");
  out.add("  shell:   by @foxinwinter", "");
  out.add("");
}

const APPS = {
  term: {
    name: "terminal",
    icon: "term",
    tile: TILE_COLORS.term,
    open: () => {
      const w = WM.makeWin({
        title: "terminal - pawprntos",
        width: 620,
        height: 380,
        noPad: true,
      });
      initTerminal(w.bodyEl);
      return w;
    },
  },
  files: {
    name: "files",
    icon: "files",
    tile: TILE_COLORS.files,
    open: () => {
      const w = WM.makeWin({
        title: "files",
        width: 560,
        height: 360,
        noPad: true,
      });
      initFiles(w.bodyEl);
      return w;
    },
  },
  about: {
    name: "about",
    icon: "about",
    tile: TILE_COLORS.about,
    open: () => {
      const w = WM.makeWin({
        title: "about - pawprnt",
        width: 700,
        height: 520,
        noPad: true,
      });
      initStatus(w.bodyEl);
      return w;
    },
  },
  proj: {
    name: "projects",
    icon: "proj",
    tile: TILE_COLORS.proj,
    open: () => {
      const w = WM.makeWin({
        title: "projects",
        width: 520,
        height: 360,
      });
      const rows = [
        ["forager", "a game launcher", "https://github.com/pawprnt/forager"],
        ["tizentube", "youtube for tizen tvs", "https://github.com/pawprnt/tizentube"],
        ["tizenMngr", "security research notes", "https://github.com/pawprnt/tizenMngr"],
      ]
        .map(
          ([name, desc, url]) =>
            '<a class="row" href="' +
            url +
            '" target="_blank" rel="noopener"><span class="name">' +
            name +
            '</span><span class="desc">' +
            desc +
            "</span></a>"
        )
        .join("");
      w.bodyEl.innerHTML = '<div class="proj">' + rows + "</div>";
      return w;
    },
  },
  wall: {
    name: "wallpapers",
    icon: "wall",
    tile: TILE_COLORS.wall,
    open: () => {
      const w = WM.makeWin({
        title: "wallpapers",
        width: 560,
        height: 420,
        noPad: true,
      });
      initWallpapers(w.bodyEl);
      return w;
    },
  },
  set: {
    name: "settings",
    icon: "set",
    tile: TILE_COLORS.set,
    open: () => {
      const w = WM.makeWin({
        title: "settings",
        width: 480,
        height: 420,
        noPad: true,
      });
      initSettings(w.bodyEl);
      return w;
    },
  },
};

function renderDesktop() {
  initTaskbar();
}
function initFiles(container) {
  const app = document.createElement("div");
  app.className = "files";
  app.innerHTML =
    '<div class="files-side"></div><div class="files-main"></div>';
  container.appendChild(app);

  const side = app.querySelector(".files-side");
  const main = app.querySelector(".files-main");

  function renderDir(path) {
    const node = resolvePath(path, "/");
    if (!node || !nodeIsDir(node)) return;
    main.textContent = "";
    const list = dirList(node);
    list.forEach((e) => {
      const row = document.createElement("div");
      row.className = "files-row" + (e.dir ? " dir" : "");
      row.innerHTML =
        '<span class="glyph">' +
        (e.dir ? "▸" : "·") +
        "</span><span>" +
        e.name +
        "</span>" +
        (e.dir ? "" : '<span class="size">' + (String(e.name).length * 12) + "B</span>");
      row.addEventListener("click", () => {
        if (e.dir) {
          const child = path + "/" + e.name;
          renderDir(child);
          highlightSide(child);
        } else {
          const nodePath = path + "/" + e.name;
          const content = resolvePath(nodePath, "/");
          if (typeof content === "string") {
            const w = WM.makeWin({
              title: e.name + " - viewer",
              width: 440,
              height: 320,
            });
            w.bodyEl.className += " viewer";
            w.bodyEl.textContent = content;
          }
        }
      });
      main.appendChild(row);
    });
  }

  function highlightSide(path) {
    side.querySelectorAll(".dir").forEach((d) => d.classList.remove("active"));
    const el = side.querySelector('[data-path="' + path + '"]');
    if (el) el.classList.add("active");
  }

  function collectDirs(base, prefix) {
    const out = [];
    const node = resolvePath(base, "/");
    if (!node) return out;
    for (const k of Object.keys(node)) {
      const child = base + "/" + k;
      if (nodeIsDir(node[k])) {
        out.push(child);
        out.push(...collectDirs(child, prefix));
      }
    }
    return out;
  }

  const dirs = collectDirs("/", "");
  dirs.forEach((d) => {
    const el = document.createElement("div");
    el.className = "dir";
    el.dataset.path = d;
    const label = d === "/" ? "/ (root)" : d.split("/").slice(0, -1).join("/") + " " + d.split("/").pop();
    el.innerHTML = '<span class="mark">▸</span>' + label;
    el.addEventListener("click", () => {
      renderDir(d);
      highlightSide(d);
    });
    side.appendChild(el);
  });

  renderDir("/home/paw");
  highlightSide("/home/paw");
}

// files/index.js — file manager for pawprntos
// gui for browsing the virtual filesystem

function initFiles(container) {
  const app = document.createElement("div");
  app.className = "files";
  app.innerHTML =
    '<div class="files-side"></div><div class="files-main"></div>';
  container.appendChild(app);

  const side = app.querySelector(".files-side");
  const main = app.querySelector(".files-main");

  function normalizePath(base, name) {
    return (base === "/" ? "/" : base + "/") + name;
  }

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
          const child = normalizePath(path, e.name);
          renderDir(child);
          highlightSide(child);
        } else {
          const nodePath = normalizePath(path, e.name);
          const content = resolvePath(nodePath, "/");
          if (typeof content === "string") {
            if (e.name === "os_release" && path === "/etc") {
              openOsRelease(content);
            } else {
              const w = WM.makeWin({
                title: e.name + " - viewer",
                width: 440,
                height: 320,
              });
              w.bodyEl.className += " viewer";
              w.bodyEl.textContent = content;
            }
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
      const child = (base === "/" ? "" : base) + "/" + k;
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
    const label = d === "/" ? "/ (root)" : d;
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

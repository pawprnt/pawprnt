const ICONS = {
  term: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  files: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  about: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  proj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  wiki: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h11a4 4 0 0 1 4 4v12a4 4 0 0 0-4-4H4z"/><path d="M4 4v16"/></svg>',
  set: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
};

const TILE_COLORS = {
  term: "#9be0a8",
  files: "#ff9dd2",
  about: "#c7a2ff",
  proj: "#7fd1e0",
  set: "#a9b0c8",
};

const REPOS = [
  { name: "forager", url: "https://github.com/pawprnt/forager", api: "pawprnt/forager", branch: "main" },
  { name: "OneBoot", url: "https://github.com/pawprnt/OneBoot", api: "pawprnt/OneBoot", branch: "main" },
  { name: "onewm", url: "https://github.com/pawprnt/onewm", api: "pawprnt/onewm", branch: "main" },
];

function fmtGhDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "unknown";
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
}

async function ghRepoStat(repo) {
  const base = "https://api.github.com/repos/" + repo.api;
  const [info, commit, rel] = await Promise.allSettled([
    fetch(base).then((r) => (r.ok ? r.json() : Promise.reject())),
    fetch(base + "/commits?per_page=1").then((r) => (r.ok ? r.json() : Promise.reject())),
    fetch(base + "/releases/latest").then((r) => (r.ok ? r.json() : Promise.reject())),
  ]);
  const stars = info.status === "fulfilled" ? info.value.stargazers_count : "?";
  const last = commit.status === "fulfilled" && commit.value[0] ? fmtGhDate(commit.value[0].commit.author.date) : "unknown";
  const release = rel.status === "fulfilled" ? fmtGhDate(rel.value.published_at) : "no release";
  return { stars, last, release };
}

function rawWiki(repo, path) {
  return "https://raw.githubusercontent.com/" + repo.api + "/" + repo.branch + "/wiki/" + path;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function mdInline(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function mdToHtml(md) {
  const lines = escapeHtml(md).split("\n");
  let html = "";
  let inCode = false;
  let buf = [];
  let tableRows = [];
  const flush = () => {
    html += "<pre><code>" + buf.join("\n") + "</code></pre>";
    buf = [];
  };
  const flushTable = () => {
    if (tableRows.length === 0) return;
    const header = tableRows[0];
    const body = tableRows.slice(1);
    html += "<table><thead><tr>";
    header.forEach((c) => { html += "<th>" + mdInline(c) + "</th>"; });
    html += "</tr></thead><tbody>";
    body.forEach((row) => {
      html += "<tr>";
      row.forEach((c) => { html += "<td>" + mdInline(c) + "</td>"; });
      html += "</tr>";
    });
    html += "</tbody></table>";
    tableRows = [];
  };
  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) { flush(); inCode = false; }
      else { inCode = true; }
      continue;
    }
    if (inCode) { buf.push(line); continue; }
    const trimmed = line.trim();
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const isSep = /^\|[\s\-:|]+\|$/.test(trimmed);
      if (!isSep) {
        const cells = trimmed.split("|").slice(1, -1).map((c) => c.trim());
        tableRows.push(cells);
      }
      continue;
    }
    flushTable();
    if (/^### /.test(line)) html += "<h3>" + mdInline(line.slice(4)) + "</h3>";
    else if (/^## /.test(line)) html += "<h2>" + mdInline(line.slice(3)) + "</h2>";
    else if (/^# /.test(line)) html += "<h1>" + mdInline(line.slice(2)) + "</h1>";
    else if (/^[-*] /.test(line)) html += "<li>" + mdInline(line.slice(2)) + "</li>";
    else if (trimmed !== "") html += "<p>" + mdInline(line) + "</p>";
  }
  if (inCode) flush();
  flushTable();
  return html;
}

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

  repos: {
    name: "projects",
    icon: "proj",
    tile: TILE_COLORS.proj,
    open: () => {
      const w = WM.makeWin({
        title: "projects",
        width: 560,
        height: 440,
        noPad: true,
      });
      const root = document.createElement("div");
      root.className = "proj";
      w.bodyEl.appendChild(root);
      REPOS.forEach((repo) => {
        const row = document.createElement("div");
        row.className = "gh-row";
        row.innerHTML =
          '<a href="' + repo.url + '" target="_blank" rel="noopener">' + repo.name + "</a>" +
          '<div class="gh-meta">loading...</div>';
        root.appendChild(row);
        const meta = row.querySelector(".gh-meta");
        ghRepoStat(repo)
          .then((s) => {
            meta.innerHTML = "stars: <b>" + s.stars + "</b> · last commit: " + s.last + " · release: " + s.release;
          })
          .catch(() => {
            meta.textContent = "couldn't reach github :(";
          });
      });
      return w;
    },
  },
  wiki: {
    name: "wiki",
    icon: "wiki",
    tile: TILE_COLORS.proj,
    open: (opts) => {
      const w = WM.makeWin({
        title: "wiki",
        width: 820,
        height: 560,
        noPad: true,
      });
      const root = document.createElement("div");
      root.className = "wiki";
      root.innerHTML =
        '<aside class="wiki-side"><div class="wiki-brand">wiki</div><nav class="wiki-nav"></nav></aside>' +
        '<section class="wiki-main"><div class="wiki-crumb"></div><div class="wiki-content"></div></section>';
      w.bodyEl.appendChild(root);
      const nav = root.querySelector(".wiki-nav");
      const crumb = root.querySelector(".wiki-crumb");
      const content = root.querySelector(".wiki-content");
      let active = null;
      REPOS.forEach((repo) => {
        const group = document.createElement("div");
        group.className = "wiki-group";
        const head = document.createElement("button");
        head.className = "wiki-proj";
        head.textContent = repo.name;
        const pages = document.createElement("div");
        pages.className = "wiki-pages";
        head.addEventListener("click", () => {
          document.querySelectorAll(".wiki-group").forEach((g) => g.classList.remove("open"));
          group.classList.add("open");
          active = repo;
          loadPages(repo, pages);
        });
        group.appendChild(head);
        group.appendChild(pages);
        nav.appendChild(group);
      });
      function loadPages(repo, pages) {
        if (pages.dataset.loaded) { openFirst(pages); return; }
        pages.innerHTML = '<div class="wiki-loading">loading...</div>';
        fetch(rawWiki(repo, "index.json"))
          .then((r) => (r.ok ? r.json() : Promise.reject()))
          .then((list) => {
            pages.dataset.loaded = "1";
            pages.innerHTML = "";
            pages.appendChild(newBtn(repo));
            list.forEach((p) => {
              const el = document.createElement("button");
              el.className = "wiki-page";
              el.textContent = p.title;
              el.dataset.file = p.file;
              el.addEventListener("click", () => {
                pages.querySelectorAll(".wiki-page").forEach((x) => x.classList.remove("active"));
                el.classList.add("active");
                loadPage(repo, p);
              });
              pages.appendChild(el);
            });
            openFirst(pages);
          })
          .catch(() => {
            pages.dataset.loaded = "1";
            pages.innerHTML = "";
            pages.appendChild(newBtn(repo));
            const msg = document.createElement("div");
            msg.className = "wiki-loading";
            msg.textContent = "no pages yet";
            pages.appendChild(msg);
          });
      }
      function newBtn(repo) {
        const b = document.createElement("button");
        b.className = "wiki-new";
        b.textContent = "+ new page";
        b.addEventListener("click", () => window.open("https://github.com/" + repo.api + "/new/" + repo.branch + "/wiki", "_blank", "noopener"));
        return b;
      }
      function openFirst(pages) {
        const first = pages.querySelector(".wiki-page");
        if (first) first.click();
      }
      function loadPage(repo, p) {
        crumb.textContent = repo.name + " / " + p.title;
        content.innerHTML = '<div class="wiki-loading">loading...</div>';
        setWikiHash(repo.name, p.title);
        fetch(rawWiki(repo, p.file))
          .then((r) => (r.ok ? r.text() : Promise.reject()))
          .then((md) => {
            content.innerHTML = '<article class="wiki-md">' + mdToHtml(md) + "</article>";
          })
          .catch(() => {
            content.innerHTML = '<div class="wiki-loading">couldn\'t load page :(</div>';
          });
      }
      const targetRepo = opts && opts.repo;
      const targetPage = opts && opts.page;
      if (targetRepo) {
        const btns = nav.querySelectorAll(".wiki-proj");
        for (const btn of btns) {
          if (btn.textContent === targetRepo) { btn.click(); break; }
        }
      } else {
        nav.querySelector(".wiki-proj").click();
      }
      if (targetPage) {
        const targetLower = targetPage.toLowerCase().replace(/\.md$/, "");
        const waitForPages = setInterval(() => {
          const pageBtns = nav.querySelectorAll(".wiki-page");
          for (const btn of pageBtns) {
            const titleMatch = btn.textContent.toLowerCase() === targetLower;
            const fileMatch = btn.dataset.file.replace(/\.md$/, "").toLowerCase() === targetLower;
            if (titleMatch || fileMatch) {
              btn.click();
              clearInterval(waitForPages);
              return;
            }
          }
        }, 100);
        setTimeout(() => clearInterval(waitForPages), 5000);
      }
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
    width: 640,
    height: 460,
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

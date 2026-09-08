// registry.js — application registry for pawprntos
// all available apps, their icons, colors, and open functions

// svg icons for each app
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

// app definitions with name, icon, tile color, and open function
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
        width: 1040,
        height: 620,
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
            const msg = document.createElement("div");
            msg.className = "wiki-loading";
            msg.textContent = "no pages yet";
            pages.appendChild(msg);
          });
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

// initializes the desktop by setting up the taskbar
function renderDesktop() {
  initTaskbar();
}

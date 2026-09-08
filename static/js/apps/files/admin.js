// files/admin.js — admin panel for pawprntos
// hidden admin panel accessible by clicking VERSION in os_release 5 times

// click counter for VERSION easter egg
let osReleaseClicks = 0;
let osReleaseTimer = null;

// opens the os_release file in a viewer with VERSION click handler
function openOsRelease(content) {
  const w = WM.makeWin({
    title: "os_release - viewer",
    width: 440,
    height: 320,
  });
  w.bodyEl.className += " viewer os-release-viewer";

  const lines = content.split("\n");
  w.bodyEl.innerHTML = lines.map((line) => {
    if (line.startsWith("VERSION=")) {
      const val = line.slice(8);
      return '<div class="os-release-line"><span class="os-release-key">VERSION</span>=<span class="os-release-version">' + val.slice(1, -1) + "</span></div>";
    }
    return '<div class="os-release-line">' + line + "</div>";
  }).join("");

  const versionEl = w.bodyEl.querySelector(".os-release-version");
  if (versionEl) {
    versionEl.addEventListener("click", () => {
      osReleaseClicks++;
      clearTimeout(osReleaseTimer);
      if (osReleaseClicks >= 5) {
        osReleaseClicks = 0;
        openAdmin();
        return;
      }
      const remaining = 5 - osReleaseClicks;
      versionEl.title = remaining + " more click" + (remaining > 1 ? "s" : "") + " away from being a developer";
      osReleaseTimer = setTimeout(() => {
        osReleaseClicks = 0;
        versionEl.title = "";
      }, 2000);
    });
  }
}

// opens the admin panel with password authentication
function openAdmin() {
  const w = WM.makeWin({
    title: "pawprntos system",
    width: 600,
    height: 450,
    noPad: true,
  });
  const adminEl = w.bodyEl;
  adminEl.className += " admin";

  adminEl.innerHTML =
    '<div class="admin-login">' +
    '<div class="admin-title">pawprntos system</div>' +
    '<div class="admin-subtitle">authentication required</div>' +
    '<input class="admin-input" type="password" placeholder="password" autocomplete="off">' +
    '<button class="admin-btn">login</button>' +
    '<div class="admin-error"></div>' +
    "</div>";

  const input = adminEl.querySelector(".admin-input");
  const btn = adminEl.querySelector(".admin-btn");
  const error = adminEl.querySelector(".admin-error");

  function doLogin() {
    const pw = input.value;
    if (!pw) return;
    error.textContent = "authenticating...";
    error.className = "admin-error";
    fetch(WORKER_URL + "/?admin=1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          adminEl.innerHTML =
            '<div class="admin-panel">' +
            '<div class="admin-title">pawprntos admin</div>' +
            '<div class="admin-hr"></div>' +
            '<div class="admin-section">' +
            '<div class="admin-label">endpoints</div>' +
            '<div id="admin-endpoints" class="admin-endpoints"><span class="admin-loading">checking...</span></div>' +
            "</div>" +
            "</div>";

          const ep = adminEl.querySelector("#admin-endpoints");
          const endpoints = [
            { name: "recent", url: WORKER_URL + "/" },
            { name: "art", url: WORKER_URL + "/?art=1&artist=juju3&song=Wasted+Summers" },
            { name: "lyrics", url: WORKER_URL + "/?lyrics=1&artist=juju3&song=Wasted+Summers" },
            { name: "games", url: WORKER_URL + "/?games=1" },
          ];
          Promise.all(endpoints.map((e) => {
            const start = performance.now();
            return fetch(e.url).then((r) => {
              const ms = Math.round(performance.now() - start);
              return { name: e.name, status: r.status, ms };
            }).catch(() => {
              const ms = Math.round(performance.now() - start);
              return { name: e.name, status: 0, ms };
            });
          })).then((results) => {
            ep.innerHTML = results.map((r) => {
              const cls = r.status === 200 ? "c-green" : r.status === 0 ? "c-red" : "c-dim";
              return '<div class="admin-row"><span>' + r.name + '</span><span class="' + cls + '">' + r.status + " " + r.ms + "ms</span></div>";
            }).join("");
          });
        } else {
          error.textContent = "invalid password";
          error.className = "admin-error err";
          input.value = "";
        }
      })
      .catch(() => {
        error.textContent = "connection failed";
        error.className = "admin-error err";
      });
  }

  bindSubmit(btn, input, doLogin);
  input.focus();
}

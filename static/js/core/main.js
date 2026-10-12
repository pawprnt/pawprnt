// main.js — application entry point for pawprntos
// initialization, boot sequence, and deep linking
//
// NOTE: loads last via sequential loader
// DOM is already ready — no DOMContentLoaded needed

// block mobile until we implement it (flag is set by the gate in index.html,
// which runs before any of this)
if (window.PAWPRNTOS_BLOCKED) {
  throw new Error("mobile blocked");
}

try { applySettings(); } catch (e) { console.error("[main] settings failed:", e); }
try { applyWallpaper(savedWallpaper() || "forest"); } catch (e) { console.error("[main] wallpaper failed:", e); }

const enter = () => {
  document.getElementById("boot").remove();
  document.getElementById("desktop").hidden = false;
  try { renderDesktop(); } catch (e) { console.error("[main] desktop render failed:", e); }
  try { handleDeepLink(); } catch (e) { console.error("[main] deeplink failed:", e); }
};

if (loadSettings().boot === false || getLaunchApp()) {
  enter();
} else {
  runBoot(enter);
}

window.addEventListener("hashchange", handleDeepLink);

// resolves a url-friendly name (app key or display name) to an app key
function resolveAppName(name) {
  if (!name) return null;
  const n = name.toLowerCase();
  if (APPS[n]) return n;
  for (const key of Object.keys(APPS)) {
    if (APPS[key].name.toLowerCase() === n) return key;
  }
  return null;
}

// finds an app launch target from path (/about), query (?app=about or ?about),
// or hash (#about, #/about, #wiki/repo/page) — returns { key, opts } or null
function getLaunchApp() {
  const params = new URLSearchParams(window.location.search);
  const q = resolveAppName(params.get("app"));
  if (q) return { key: q };
  for (const name of params.keys()) {
    const k = resolveAppName(name);
    if (k) return { key: k };
  }
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (path && !path.includes("/")) {
    const k = resolveAppName(decodeURIComponent(path));
    if (k) return { key: k };
  }
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (hash) {
    const parts = hash.split("/");
    const k = resolveAppName(parts[0]);
    if (k) {
      if (k === "wiki") {
        return { key: k, opts: { repo: parts[1] || null, page: parts.slice(2).join("/") || null } };
      }
      return { key: k };
    }
  }
  return null;
}

// handles deep linking (e.g., /about, ?app=about, #about, #wiki/repo/page)
function handleDeepLink() {
  const target = getLaunchApp();
  if (!target || !APPS[target.key]) return;
  setTimeout(() => {
    openApp(target.key, target.opts);
  }, 300);
}

// updates the URL hash for wiki pages
function setWikiHash(repo, page) {
  const path = page ? `wiki/${repo}/${page}` : `wiki/${repo}`;
  history.replaceState(null, "", "#" + path);
}

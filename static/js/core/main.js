// main.js — application entry point for pawprntos
// initialization, boot sequence, and deep linking
//
// NOTE: loads last via sequential loader
// DOM is already ready — no DOMContentLoaded needed

try { applySettings(); } catch (e) { console.error("[main] settings failed:", e); }
try { applyWallpaper(savedWallpaper() || "forest"); } catch (e) { console.error("[main] wallpaper failed:", e); }

const enter = () => {
  document.getElementById("boot").remove();
  document.getElementById("desktop").hidden = false;
  try { renderDesktop(); } catch (e) { console.error("[main] desktop render failed:", e); }
  try { handleDeepLink(); } catch (e) { console.error("[main] deeplink failed:", e); }
};

if (loadSettings().boot === false) {
  enter();
} else {
  runBoot(enter);
}

window.addEventListener("hashchange", handleDeepLink);

// handles deep linking via URL hash (e.g., #wiki/repo/page)
function handleDeepLink() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (!hash.startsWith("wiki")) return;
  const parts = hash.split("/").slice(1);
  const repo = parts[0] || null;
  const page = parts.slice(1).join("/") || null;
  setTimeout(() => {
    openApp("wiki", { repo, page });
  }, 300);
}

// updates the URL hash for wiki pages
function setWikiHash(repo, page) {
  const path = page ? `wiki/${repo}/${page}` : `wiki/${repo}`;
  history.replaceState(null, "", "#" + path);
}

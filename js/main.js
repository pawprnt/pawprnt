window.addEventListener("DOMContentLoaded", () => {
  applySettings();
  applyWallpaper(savedWallpaper() || "forest");
  const enter = () => {
    document.getElementById("boot").remove();
    document.getElementById("desktop").hidden = false;
    renderDesktop();
    handleDeepLink();
  };
  if (loadSettings().boot === false) {
    enter();
  } else {
    runBoot(enter);
  }
  window.addEventListener("hashchange", handleDeepLink);
});

function handleDeepLink() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (!hash.startsWith("wiki")) return;
  const parts = hash.split("/").slice(1);
  const repo = parts[0] || null;
  const page = parts.slice(1).join("/") || null;
  setTimeout(() => {
    APPS.wiki.open({ repo, page });
  }, 200);
}

function setWikiHash(repo, page) {
  const path = page ? `wiki/${repo}/${page}` : `wiki/${repo}`;
  history.replaceState(null, "", "#" + path);
}

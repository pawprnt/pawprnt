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
});

function handleDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const wiki = params.get("wiki");
  if (wiki) {
    const parts = wiki.split("/");
    const repo = parts[0] || null;
    const page = parts.slice(1).join("/") || null;
    setTimeout(() => {
      APPS.wiki.open({ repo, page });
    }, 500);
  }
}

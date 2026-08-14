window.addEventListener("DOMContentLoaded", () => {
  applySettings();
  applyWallpaper(savedWallpaper() || "forest");
  const enter = () => {
    document.getElementById("boot").remove();
    document.getElementById("desktop").hidden = false;
    renderDesktop();
  };
  if (loadSettings().boot === false) {
    enter();
  } else {
    runBoot(enter);
  }
});

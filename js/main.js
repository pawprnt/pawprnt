window.addEventListener("DOMContentLoaded", () => {
  runBoot(() => {
    document.getElementById("boot").remove();
    applySettings();
    applyWallpaper(savedWallpaper() || "forest");
    document.getElementById("desktop").hidden = false;
    renderDesktop();
  });
});

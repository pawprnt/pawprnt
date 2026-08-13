const BOOT_LINES = [
  "pawprntos boot",
  "mounting /nyaa ........ ok",
  "loading neofetch ...... ok",
  "warming up the cat .... ok",
  "pawprints ............. ok",
];

function runBoot(onDone) {
  const boot = document.getElementById("boot");
  const log = boot.querySelector(".boot-log");
  let line = 0;

  const hint = document.createElement("div");
  hint.className = "boot-hint";
  hint.textContent = "click anywhere";
  hint.classList.add("hidden");
  boot.appendChild(hint);

  const step = () => {
    if (line < BOOT_LINES.length) {
      log.textContent = BOOT_LINES[line++];
      setTimeout(step, 350);
    } else {
      boot.querySelector(".boot-fill").style.animationPlayState = "paused";
      hint.classList.remove("hidden");
      boot.addEventListener("click", onDone, { once: true });
    }
  };
  setTimeout(step, 300);
}

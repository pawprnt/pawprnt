const WM = (() => {
  const WIN_CLOSE_MS = 160;
  const layer = document.getElementById("windows");
  const wins = new Map();
  const listeners = new Set();
  let z = 10;
  let count = 0;
  let focusedEl = null;

  function notify() {
    for (const fn of listeners) fn();
  }

  function onChanged(fn) {
    listeners.add(fn);
  }

  function focus(winEl) {
    for (const el of wins.values()) el.classList.remove("focused");
    winEl.classList.add("focused");
    focusedEl = winEl;
    z++;
    winEl.style.zIndex = z;
    notify();
  }

  function makeWin({ title, width, height, body, noPad }) {
    const id = ++count;
    const el = document.createElement("div");
    el.className = "win";
    el.style.width = width + "px";
    el.style.height = height + "px";
    el.style.left = 80 + ((id * 28) % 200) + "px";
    el.style.top = 50 + ((id * 24) % 120) + "px";
    el.style.zIndex = z;

    el.innerHTML =
      '<div class="win-titlebar">' +
      '<div class="win-title"></div>' +
      '<button class="wbtn min" title="minimize"></button>' +
      '<button class="wbtn max" title="maximize"></button>' +
      '<button class="wbtn close" title="close"></button>' +
      "</div>" +
      '<div class="win-body ' + (noPad ? "no-pad" : "") + '"></div>';

    const bar = el.querySelector(".win-titlebar");
    const titleEl = el.querySelector(".win-title");
    const bodyEl = el.querySelector(".win-body");
    titleEl.textContent = title;

    el.querySelector(".wbtn.close").addEventListener("click", (e) => {
      e.stopPropagation();
      if (el.classList.contains("closing")) return;
      el.classList.add("closing");
      setTimeout(() => {
        el.remove();
        wins.delete(el);
        notify();
      }, WIN_CLOSE_MS);
    });
    el.querySelector(".wbtn.max").addEventListener("click", (e) => {
      e.stopPropagation();
      el.classList.toggle("maximized");
    });
    el.querySelector(".wbtn.min").addEventListener("click", (e) => {
      e.stopPropagation();
      el.classList.add("hidden");
    });

    bar.addEventListener("mousedown", (e) => {
      if (el.classList.contains("maximized")) return;
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const left = el.offsetLeft;
      const top = el.offsetTop;
      const move = (ev) => {
        const w = el.offsetWidth;
        const minTop = 0;
        const maxTop = Math.max(minTop, window.innerHeight - 46 - 12);
        const minLeft = -w + 60;
        const maxLeft = Math.max(minLeft, window.innerWidth - 60);
        el.style.left =
          Math.max(minLeft, Math.min(maxLeft, left + ev.clientX - startX)) + "px";
        el.style.top =
          Math.max(minTop, Math.min(maxTop, top + ev.clientY - startY)) + "px";
      };
      const up = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });

    el.addEventListener("mousedown", () => focus(el));
    focus(el);
    layer.appendChild(el);
    wins.set(el, id);

    if (body) body(bodyEl);
    return { el, bodyEl };
  }

  return { makeWin, layer, focus, onChanged, focusedEl: () => focusedEl };
})();

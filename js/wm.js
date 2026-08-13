const WM = (() => {
  const WIN_CLOSE_MS = 160;
  const WIN_GEO_MS = 180;
  const layer = document.getElementById("windows");
  const wins = new Map();
  const listeners = new Set();
  const prevRect = new WeakMap();
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
    for (const el of wins.keys()) el.classList.remove("focused");
    winEl.classList.add("focused");
    focusedEl = winEl;
    z++;
    winEl.style.zIndex = z;
    notify();
  }

  function motionOn() {
    return document.documentElement.dataset.motion !== "off";
  }

  function geom(el) {
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }

  function setGeom(el, r) {
    el.style.left = r.left + "px";
    el.style.top = r.top + "px";
    el.style.width = r.width + "px";
    el.style.height = r.height + "px";
  }

  function fullGeom() {
    return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight - 46 };
  }

  function animateGeom(el, from, to) {
    if (!motionOn()) {
      setGeom(el, to);
      return;
    }
    const anim = el.animate(
      [
        { left: from.left + "px", top: from.top + "px", width: from.width + "px", height: from.height + "px" },
        { left: to.left + "px", top: to.top + "px", width: to.width + "px", height: to.height + "px" },
      ],
      { duration: WIN_GEO_MS, easing: "cubic-bezier(.33,1,.68,1)" }
    );
    anim.onfinish = () => setGeom(el, to);
  }

  function toggleMaximize(winEl) {
    if (winEl.classList.contains("closing")) return;
    if (winEl.classList.contains("maximized")) {
      winEl.classList.remove("maximized");
      const prev = prevRect.get(winEl) || geom(winEl);
      prevRect.delete(winEl);
      animateGeom(winEl, geom(winEl), prev);
    } else {
      prevRect.set(winEl, geom(winEl));
      winEl.classList.add("maximized");
      animateGeom(winEl, geom(winEl), fullGeom());
    }
  }

  function minimize(winEl) {
    if (winEl.classList.contains("hidden") || winEl.classList.contains("closing")) return;
    const r = winEl.getBoundingClientRect();
    const ty = window.innerHeight - 23 - (r.top + r.height / 2);
    if (!motionOn()) {
      winEl.classList.add("hidden");
      return;
    }
    const anim = winEl.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: "translate(0," + ty + "px) scale(.05)", opacity: 0 },
      ],
      { duration: WIN_GEO_MS, easing: "cubic-bezier(.33,1,.68,1)" }
    );
    anim.onfinish = () => winEl.classList.add("hidden");
  }

  function restore(winEl) {
    if (!winEl.classList.contains("hidden")) return;
    winEl.classList.remove("hidden");
    const r = winEl.getBoundingClientRect();
    const ty = window.innerHeight - 23 - (r.top + r.height / 2);
    if (!motionOn()) return;
    winEl.animate(
      [
        { transform: "translate(0," + ty + "px) scale(.05)", opacity: 0 },
        { transform: "translate(0,0) scale(1)", opacity: 1 },
      ],
      { duration: WIN_GEO_MS, easing: "cubic-bezier(.33,1,.68,1)" }
    );
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
      '<button class="wbtn min" title="minimize">−</button>' +
      '<button class="wbtn max" title="maximize">+</button>' +
      '<button class="wbtn close" title="close">×</button>' +
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
      toggleMaximize(el);
    });
    el.querySelector(".wbtn.min").addEventListener("click", (e) => {
      e.stopPropagation();
      minimize(el);
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

  return { makeWin, layer, focus, minimize, restore, toggleMaximize, onChanged, focusedEl: () => focusedEl };
})();

// helpers.js — shared utility stuff for pawprntos

const WORKER_URL = "https://pawprnt.foxinwntr.workers.dev";

// dom helpers
function el(tag, className) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  return e;
}

function makeCard(badge, content) {
  const card = el("div", "st-card");
  if (badge) {
    const b = el("div", "st-badge");
    b.textContent = badge;
    card.appendChild(b);
  }
  if (typeof content === "string") {
    card.insertAdjacentHTML("beforeend", content);
  } else if (typeof content === "function") {
    content(card);
  } else if (content instanceof HTMLElement) {
    card.appendChild(content);
  }
  return card;
}

// progress bar tick
function startProgressTick(card, timestamps, onTick) {
  const tick = () => {
    const now = Date.now();
    const total = timestamps.end - timestamps.start;
    const elapsed = Math.min(now - timestamps.start, total);
    const p = Math.min(100, Math.max(0, (elapsed / total) * 100));
    card.querySelector(".st-pfill").style.width = p + "%";
    card.querySelector(".st-t-now").textContent = stFmt(elapsed);
    card.querySelector(".st-t-end").textContent = stFmt(total);
    if (onTick) onTick(elapsed);
  };
  tick();
  if (Date.now() < timestamps.end) return setInterval(tick, 1000);
  return null;
}

// loading dots animation
function animateLoading(el, intervalMs) {
  let dots = 0;
  const id = setInterval(() => {
    dots = (dots + 1) % 4;
    el.textContent = "loading" + ".".repeat(dots);
  }, intervalMs || 400);
  return id;
}

// active state toggle
function setActive(container, selector, activeEl) {
  container.querySelectorAll(selector).forEach((e) => e.classList.remove("active"));
  activeEl.classList.add("active");
}

// submit binding (button click + enter key)
function bindSubmit(btn, input, handler) {
  btn.addEventListener("click", handler);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handler();
  });
}

// worker notify
function notifyWorker(message) {
  return fetch(WORKER_URL + "/?notify=1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  }).then((r) => {
    if (!r.ok) throw new Error("notify failed");
    return true;
  });
}

// github api fetch
function ghFetch(url) {
  return fetch(url).then((r) => (r.ok ? r.json() : Promise.reject()));
}

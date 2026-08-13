const WP_KEY = "pawprntos.wallpaper";

const WALLPAPERS = [
  { id: "forest", name: "forest",
    css: 'url("assets/wallpapers/forest.jpg") center / cover no-repeat' },

  { id: "midnight", name: "midnight",
    css: "linear-gradient(160deg,#0b0b12,#1c1730 55%,#33264f)" },
  { id: "dusk", name: "dusk",
    css: "linear-gradient(180deg,#191c33,#3d2a52 55%,#7a3b57)" },
  { id: "forest-night", name: "forest night",
    css: "linear-gradient(180deg,#050d08,#0d1f14 50%,#17331f)" },
  { id: "ember", name: "ember",
    css: "linear-gradient(150deg,#140a08,#3a160f 55%,#7a2e14)" },
  { id: "ocean", name: "ocean",
    css: "radial-gradient(120% 90% at 20% 10%,#0a1a24 0%,#0b2330 45%,#123549 100%)" },
  { id: "morning-fog", name: "morning fog",
    css: "linear-gradient(180deg,#23262e,#3a3e4a 45%,#6b7280)" },

  { id: "aurora", name: "aurora",
    css: "linear-gradient(115deg,#0b1b2a,#1f3d2f,#2a5a4a,#1b3a52,#0b1b2a) 0 0 / 300% 300%",
    anim: "wp-drift 18s ease infinite" },
  { id: "shift", name: "shift",
    css: "linear-gradient(130deg,#2a2140,#4a3a6b,#7a5a8a,#4a3a6b,#2a2140) 0 0 / 300% 300%",
    anim: "wp-drift 24s ease infinite" },
  { id: "pulse", name: "pulse",
    css: "radial-gradient(90% 90% at 50% 50%,#1a1f3a 0%,#0e0e16 70%)",
    anim: "wp-pulse 8s ease-in-out infinite" },

  { id: "dots", name: "dots",
    css: "radial-gradient(rgba(199,162,255,.28) 1.5px,transparent 2px) 0 0 / 28px 28px,linear-gradient(180deg,#12121a,#1a1830)" },
  { id: "grid", name: "grid",
    css: "linear-gradient(rgba(199,162,255,.10) 1px,transparent 1px) 0 0 / 32px 32px,linear-gradient(90deg,rgba(199,162,255,.10) 1px,transparent 1px) 0 0 / 32px 32px,linear-gradient(180deg,#0e0e16,#141428)" },
  { id: "checker", name: "checker",
    css: "conic-gradient(#1a1a2a 0 25%,#202038 0 50%,#1a1a2a 0 75%,#202038 0) 0 0 / 48px 48px" },
  { id: "stripes", name: "stripes",
    css: "repeating-linear-gradient(45deg,#16162a 0 14px,#121224 14px 28px)" },
  { id: "rings", name: "rings",
    css: "radial-gradient(circle at 50% 50%,transparent 0 28%,rgba(199,162,255,.10) 30% 32%,transparent 34% 62%,rgba(199,162,255,.08) 64% 66%,transparent 68%) 0 0 / 240px 240px,linear-gradient(180deg,#10101a,#1a1626)" },
  { id: "bubbles", name: "bubbles",
    css: "radial-gradient(circle at 20% 30%,rgba(255,157,210,.10) 0 6px,transparent 7px),radial-gradient(circle at 80% 20%,rgba(199,162,255,.12) 0 9px,transparent 10px),radial-gradient(circle at 60% 70%,rgba(155,224,168,.10) 0 5px,transparent 6px),linear-gradient(180deg,#10101a,#141a28) 0 0 / 120px 120px" },

  { id: "drift-grid", name: "drift grid",
    css: "linear-gradient(rgba(255,157,210,.12) 1px,transparent 1px) 0 0 / 40px 40px,linear-gradient(90deg,rgba(255,157,210,.12) 1px,transparent 1px) 0 0 / 40px 40px,linear-gradient(180deg,#0e0e16,#201a2a)",
    anim: "wp-pan 22s linear infinite" },
  { id: "rain", name: "rain",
    css: "repeating-linear-gradient(90deg,transparent 0 90px,rgba(199,162,255,.08) 90px 91px,transparent 91px 180px),repeating-linear-gradient(0deg,transparent 0 90px,rgba(255,157,210,.06) 90px 91px,transparent 91px 180px) 0 0 / 180px 180px,linear-gradient(180deg,#0a0a14,#161630)",
    anim: "wp-slide 12s linear infinite" },
];

function injectWpKeyframes() {
  if (document.getElementById("wp-kf")) return;
  const st = document.createElement("style");
  st.id = "wp-kf";
  st.textContent =
    "@keyframes wp-drift{0%,100%{background-position:0% 0%}50%{background-position:100% 100%}}" +
    "@keyframes wp-pulse{0%,100%{background-size:100% 100%}50%{background-size:115% 115%}}" +
    "@keyframes wp-pan{0%{background-position:0 0}100%{background-position:40px 40px}}" +
    "@keyframes wp-slide{from{background-position:0 0}to{background-position:180px 90px}}";
  document.head.appendChild(st);
}

function applyWallpaper(id) {
  const wp = WALLPAPERS.find((w) => w.id === id) || WALLPAPERS[0];
  const d = document.getElementById("desktop");
  d.style.background = wp.css;
  d.style.animation = wp.anim || "none";
  try { localStorage.setItem(WP_KEY, wp.id); } catch (e) {}
  return wp;
}

function savedWallpaper() {
  try { return localStorage.getItem(WP_KEY); } catch (e) { return null; }
}

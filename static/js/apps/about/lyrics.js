// about/lyrics.js — status display and lyrics for pawprntos
// discord status via lanyard api and lyrics via worker

// discord user id for lanyard api
const STATUS_UID = "1180659671057571860";
const STATUS_LF_URL = "https://pawprnt.foxinwntr.workers.dev";
const STATUS_MUSIC_APP = "music.sh";
const STATUS_TYPE = { 0: "playing", 1: "streaming", 2: "listening to", 3: "watching", 5: "playing" };

const STATUS_ICO = {
  discord: {
    vb: "0 0 24 24",
    fill: "#5865F2",
    body: '<path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>',
  },
  email: {
    vb: "0 0 24 24",
    fill: "#FFFFFF",
    body: '<path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z"/><path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z"/>',
  },
  bluesky: {
    vb: "0 0 24 24",
    fill: "#0085FF",
    body: '<path d="M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026"/>',
  },
  twitter: {
    vb: "0 0 24 24",
    fill: "#1DA1F2",
    body: '<path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>',
  },
  steam: {
    vb: "0 0 24 24",
    fill: "none",
    body: '<g transform="scale(1.0909)"><circle cx="11" cy="11" r="10" fill="#1955aa"/><path fill="#fff" d="M10.5 8 12 11.5 16 12 10 15.5V13H7.5Z"/><path fill="#fff" d="M14 5a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4Zm0 1.5a2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1-2.5 2.5 2.5 2.5 0 0 1-2.5-2.5A2.5 2.5 0 0 1 14 6.5Z"/><path fill="#fff" d="M8 12a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Zm0 1a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2Z"/><circle fill="#fff" cx="14" cy="9" r="2"/><path fill="#fff" d="M1.032 10.361A10 10 0 0 0 1 11a10 10 0 0 0 .401 2.787l6.005 2.59a1.5 1.5 0 1 0 1.187-2.754Z"/></g>',
  },
  github: {
    vb: "0 0 24 24",
    fill: "#FFFFFF",
    body: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
  },
};

// extracts music activity from discord data (spotify or music.sh)
function stMusic(d) {
  if (d.spotify) return d.spotify;
  return (d.activities || []).find((a) => a.name === STATUS_MUSIC_APP && (a.details || a.state));
}

// fetches discord status from lanyard api
async function stFetchLanyard() {
  const r = await fetch("https://api.lanyard.rest/v1/users/" + STATUS_UID);
  const j = await r.json();
  if (!(j.success && j.data)) throw new Error("bad response");
  return j.data;
}

async function stFetchLf() {
  const r = await fetch(STATUS_LF_URL);
  const j = await r.json();
  if (!(j && !j.error && j.song)) throw new Error("bad lf response");
  return j;
}

function stExternalUrl(asset, size) {
  if (!asset) return null;
  if (asset.startsWith("mp:external/")) {
    const m = asset.match(/^mp:external\/[^/]+\/(https)\/(.+)$/);
    if (!m) return null;
    let url = m[1] + "://" + m[2];
    url = decodeURIComponent(url);
    if (size && /=\w\d+/.test(url)) {
      url = url.replace(/=w\d+-h\d+-l\d+-rj/, "=w" + size + "-h" + size + "-l90-rj");
    }
    return url;
  }
  return null;
}

function stEsc(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : s;
  return d.innerHTML;
}

function stFmt(ms) {
  ms = Math.max(0, ms);
  const s = Math.floor(ms / 1000);
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

const STATUS_ART_CACHE = {};
function stLookupArt(song, artist, cb) {
  if (!song || !artist) return;
  const key = song + "\u0000" + artist;
  if (key in STATUS_ART_CACHE) {
    if (STATUS_ART_CACHE[key]) cb(STATUS_ART_CACHE[key]);
    return;
  }
  fetch(STATUS_LF_URL + "?art=1&song=" + encodeURIComponent(song) + "&artist=" + encodeURIComponent(artist))
    .then((r) => r.json())
    .then((j) => {
      const u = j && !j.error ? j.image : "";
      STATUS_ART_CACHE[key] = u || "";
      if (u) cb(u);
    })
    .catch(() => {});
}

const LYRICS_CACHE = {};
let currentLyrics = null;
let lyricsSongId = null;

async function fetchLyrics(artist, song, duration) {
  if (!artist || !song) return null;
  const key = artist + "\0" + song;
  if (key in LYRICS_CACHE) return LYRICS_CACHE[key];
  try {
    const params = new URLSearchParams({ lyrics: "1", artist: artist, song: song });
    if (duration > 0) params.set("duration", duration);
    const res = await fetch(STATUS_LF_URL + "?" + params.toString());
    if (!res.ok) { LYRICS_CACHE[key] = null; return null; }
    const data = await res.json();
    if (data.error || !data.lines || !data.lines.length) { LYRICS_CACHE[key] = null; return null; }
    LYRICS_CACHE[key] = data.lines;
    return data.lines;
  } catch (e) {
    return null;
  }
}

function updateLyrics(lyricsBox, lines, elapsed) {
  if (!lines || !lines.length) {
    lyricsBox.style.display = "none";
    return;
  }
  lyricsBox.style.display = "";
  let activeIdx = 0;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (elapsed >= lines[i].time) { activeIdx = i; break; }
  }
  if (!lyricsBox.querySelector(".st-lyric-line")) {
    lyricsBox.innerHTML = '<div class="st-badge">lyrics</div><div class="st-lyrics-inner">' +
      lines.map((l, i) => '<div class="st-lyric-line' + (!l.text.trim() ? ' st-lyric-empty' : '') + '" data-i="' + i + '">' + (l.text.trim() ? stEsc(l.text) : '♪') + "</div>").join("") +
      "</div>";
  }
  const inner = lyricsBox.querySelector(".st-lyrics-inner");
  const allLines = inner.querySelectorAll(".st-lyric-line");
  allLines.forEach((el, i) => {
    el.classList.toggle("active", i === activeIdx);
    el.classList.toggle("past", i < activeIdx);
  });
  const activeEl = allLines[activeIdx];
  if (activeEl) {
    const containerRect = inner.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();
    const offset = elRect.top - containerRect.top - containerRect.height / 2 + elRect.height / 2;
    inner.scrollBy({ top: offset, behavior: "smooth" });
  }
}

let lyricsLoadingTimer = null;
function showLyricsLoading(lyricsBox) {
  if (lyricsLoadingTimer) { clearInterval(lyricsLoadingTimer); lyricsLoadingTimer = null; }
  lyricsBox.style.display = "";
  let dots = 0;
  const el = document.createElement("div");
  el.className = "st-lyrics-inner st-lyrics-empty-msg";
  el.textContent = "loading";
  lyricsBox.innerHTML = '<div class="st-badge">lyrics</div>';
  lyricsBox.appendChild(el);
  currentLyrics = null;
  lyricsLoadingTimer = setInterval(() => {
    dots = (dots + 1) % 4;
    el.textContent = "loading" + ".".repeat(dots);
  }, 400);
}

function showNoLyrics(lyricsBox) {
  if (lyricsLoadingTimer) { clearInterval(lyricsLoadingTimer); lyricsLoadingTimer = null; }
  lyricsBox.style.display = "";
  lyricsBox.innerHTML = '<div class="st-badge">lyrics</div>' +
    '<div class="st-lyrics-inner st-lyrics-empty-msg">\\(O_o)/<br>lyrics not found</div>';
  currentLyrics = null;
}

function clearLyrics(lyricsBox) {
  if (lyricsLoadingTimer) { clearInterval(lyricsLoadingTimer); lyricsLoadingTimer = null; }
  lyricsBox.textContent = "";
  lyricsBox.style.display = "none";
  currentLyrics = null;
  lyricsSongId = null;
}

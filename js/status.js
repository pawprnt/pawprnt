const STATUS_UID = "1180659671057571860";
const STATUS_LF_URL = "https://pawprnt.foxinwntr.workers.dev";
const STATUS_MUSIC_APP = "music.sh";
const STATUS_TYPE = { 0: "playing", 1: "streaming", 2: "listening to", 3: "watching", 5: "playing" };

const STATUS_ICO = {
  discord: {
    vb: "0 0 24 24",
    body: '<path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>',
  },
  email: {
    vb: "0 0 256 256",
    body: '<path d="M224,44H32A12,12,0,0,0,20,56V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A12,12,0,0,0,224,44Zm-96,83.72L62.85,68h130.3ZM92.79,128,44,172.72V83.28Zm17.76,16.28,9.34,8.57a12,12,0,0,0,16.22,0l9.34-8.57L193.15,188H62.85Zm52.66-16.28L212,83.28v89.44Z"/>',
  },
  bluesky: {
    vb: "0 0 24 24",
    body: '<path d="M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026"/>',
  },
  x: {
    vb: "0 0 24 24",
    body: '<path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/>',
  },
  steam: {
    vb: "0 0 24 24",
    body: '<path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/>',
  },
  github: {
    vb: "0 0 24 24",
    body: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
  },
};

function stMusic(d) {
  if (d.spotify) return d.spotify;
  return (d.activities || []).find((a) => a.name === STATUS_MUSIC_APP && (a.details || a.state));
}

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

function initStatus(container) {
  const wrap = document.createElement("div");
  wrap.className = "st-wrap";
  container.appendChild(wrap);
  const left = document.createElement("div");
  left.className = "st-col st-col-left";
  wrap.appendChild(left);
  const right = document.createElement("div");
  right.className = "st-col";
  wrap.appendChild(right);
  const rightMusic = document.createElement("div");
  right.appendChild(rightMusic);
  right.appendChild(linksCard());

  let progressTimer = null;
  let clockTimer = null;
  let statusNow = null;

  function statusCard() {
    const status = document.createElement("div");
    status.className = "st-card";
    status.innerHTML =
      '<div class="st-badge"><span class="st-live"></span> status</div>' +
      '<div class="st-status-line">for me its currently <span class="st-time">--:-- --</span> ' +
      'and im <span class="st-now st-now-offline">offline</span></div>';
    left.appendChild(status);
    const timeEl = status.querySelector(".st-time");
    const updateClock = () => {
      const now = new Date();
      timeEl.textContent = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago", hour: "numeric", minute: "2-digit", hour12: true,
      }).format(now);
    };
    updateClock();
    clockTimer = setInterval(updateClock, 1000);
    statusNow = status.querySelector(".st-now");
  }

  function setStatus(state) {
    if (!statusNow) return;
    statusNow.textContent = state;
    statusNow.className = "st-now st-now-" + state;
  }

  function activityCard(a) {
    const card = document.createElement("div");
    card.className = "st-card";
    let img = "";
    let wantLookup = false;
    if (a.type === 2) {
      img = stExternalUrl(a.assets && (a.assets.large_image || a.assets.small_image), 544) || "";
      wantLookup = true;
    } else {
      const asset = a.assets && (a.assets.large_image || a.assets.small_image);
      img = stExternalUrl(asset, 544) || "";
    }
    const verb = STATUS_TYPE[a.type] || "activity";
    const title = stEsc(a.details || a.name);
    card.innerHTML =
      '<div class="st-badge">' + verb + " " + stEsc(a.name) + "</div>" +
      '<div class="st-act">' +
      (img ? '<img class="st-art" src="' + img + '" alt="">' : "") +
      '<div class="st-info">' +
      '<div class="st-name">' + title + "</div>" +
      (a.state ? '<div class="st-state">' + stEsc(a.state) + "</div>" : "") +
      "</div></div>";
    if (wantLookup) {
      stLookupArt(a.details, a.state, (u) => {
        if (!u) return;
        let el = card.querySelector(".st-art");
        const act = card.querySelector(".st-act");
        if (!el) {
          el = document.createElement("img");
          el.className = "st-art";
          el.alt = "";
          act.insertBefore(el, act.firstChild);
        }
        el.src = u;
      });
    }
    return card;
  }

  function spotifyCard(s) {
    const card = document.createElement("div");
    card.className = "st-card";
    card.innerHTML =
      '<div class="st-badge">listening to spotify</div>' +
      '<div class="st-act">' +
      '<img class="st-art" src="' + s.album_art_url + '" alt="">' +
      '<div class="st-info">' +
      '<div class="st-name">' + stEsc(s.song) + "</div>" +
      '<div class="st-detail">' + stEsc(s.artist) + "</div>" +
      '<div class="st-state">' + stEsc(s.album) + "</div>" +
      '<div class="st-progress"><div class="st-pbar"><div class="st-pfill"></div></div>' +
      '<div class="st-ptime"><span class="st-t-now">0:00</span><span class="st-t-end">0:00</span></div></div>' +
      "</div></div>";
    const tick = () => {
      const now = Date.now();
      const total = s.timestamps.end - s.timestamps.start;
      const p = Math.min(100, Math.max(0, ((now - s.timestamps.start) / total) * 100));
      card.querySelector(".st-pfill").style.width = p + "%";
      card.querySelector(".st-t-now").textContent = stFmt(now - s.timestamps.start);
      card.querySelector(".st-t-end").textContent = stFmt(s.timestamps.end - s.timestamps.start);
    };
    tick();
    progressTimer = setInterval(tick, 1000);
    return card;
  }

  function lfCard(l) {
    const card = document.createElement("div");
    card.className = "st-card";
    card.innerHTML =
      '<div class="st-badge">' + (l.nowplaying ? "listening to last.fm" : "last played on last.fm") + "</div>" +
      '<div class="st-act">' +
      (l.image ? '<img class="st-art" src="' + l.image + '" alt="">' : "") +
      '<div class="st-info">' +
      '<div class="st-name"><a class="st-link" href="' + l.url + '" target="_blank" rel="noopener">' + stEsc(l.song) + "</a></div>" +
      '<div class="st-detail">' + stEsc(l.artist) + "</div>" +
      (l.album ? '<div class="st-state">' + stEsc(l.album) + "</div>" : "") +
      "</div></div>";
    return card;
  }

  function linksCard() {
    const card = document.createElement("div");
    card.className = "st-card st-links";
    const items = [
      ["discord", "discord", "foxinwinter", "https://discord.com/users/1180659671057571860"],
      ["email", "email", "foxinwinter@outlook.com", "mailto:foxinwinter@outlook.com"],
      ["bluesky", "bluesky", "@foxinwntr.bsky.social", "https://bsky.app/profile/foxinwntr.bsky.social"],
      ["x", "x / twitter", "@foxinwinter", "https://x.com/foxinwinter"],
      ["steam", "steam", "foxinwntr", "https://steamcommunity.com/id/foxinwntr"],
    ];
    const forges = [
      ["github", "github", "foxinwinter", "https://github.com/foxinwinter"],
      ["github", "github", "pawprnt org", "https://github.com/pawprnt"],
    ];
    const row = (i) => {
      const ico = STATUS_ICO[i[0]];
      return '<a class="st-ic" href="' + i[3] + '" target="_blank" rel="noopener" title="' +
        i[1] + " - " + i[2] + '">' +
        '<svg class="st-ico" viewBox="' + ico.vb + '" fill="currentColor" aria-hidden="true">' + ico.body + "</svg></a>";
    };
    card.innerHTML =
      '<div class="st-badge">my socials + forges</div>' +
      '<div class="st-rows">' +
      items.map(row).join("") +
      '<span class="st-div" aria-hidden="true"></span>' +
      forges.map(row).join("") +
      "</div>";
    return card;
  }

  function errCard() {
    const c = document.createElement("div");
    c.className = "st-card";
    c.textContent = "couldn't reach the music server :(";
    const foot = document.createElement("div");
    foot.className = "st-foot";
    const btn = document.createElement("button");
    btn.className = "st-btn";
    btn.textContent = "retry";
    btn.addEventListener("click", load);
    foot.appendChild(btn);
    c.appendChild(foot);
    return c;
  }

  function renderRight(d, lf) {
    rightMusic.textContent = "";
    if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
    if (lf && lf.nowplaying) {
      rightMusic.appendChild(lfCard(lf));
    } else {
      const music = stMusic(d);
      if (music) {
        rightMusic.appendChild(music === d.spotify ? spotifyCard(music) : activityCard(music));
      } else if (lf) {
        rightMusic.appendChild(lfCard(lf));
      } else if (!d) {
        rightMusic.appendChild(errCard());
        return;
      }
    }
  }

  async function load() {
    rightMusic.textContent = "";
    const loading = document.createElement("div");
    loading.className = "st-card";
    loading.textContent = "loading...";
    rightMusic.appendChild(loading);
    const lfP = stFetchLf().catch(() => null);
    const lanP = stFetchLanyard().catch(() => null);
    const lf = await lfP;
    if (lf && lf.nowplaying) {
      renderRight({}, lf);
    } else {
      const d = await lanP;
      renderRight(d || {}, lf);
    }
    const d = await lanP;
    if (d) setStatus(d.discord_status || "offline");
  }

  statusCard();
  load();
  const poll = setInterval(() => {
    if (!container.isConnected) {
      clearInterval(poll);
      if (progressTimer) clearInterval(progressTimer);
      if (clockTimer) clearInterval(clockTimer);
      return;
    }
    load();
  }, 30000);
}

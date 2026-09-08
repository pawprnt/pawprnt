// about/index.js — about/status display for pawprntos
// discord status, music, lyrics, games, and social links

// poll interval for status updates (10 seconds)
const STATUS_POLL_MS = 10000;
let statusState = null;
const statusSubs = new Set();

// polls lanyard and last.fm for status updates
function statusPoll() {
  const lfP = stFetchLf().catch(() => null);
  const lanP = stFetchLanyard().catch(() => null);
  Promise.all([lfP, lanP]).then(([lf, lanyard]) => {
    if (lf || lanyard || !statusState) statusState = { lf, lanyard };
    statusSubs.forEach((fn) => fn(statusState));
  });
}

statusPoll();
setInterval(statusPoll, STATUS_POLL_MS);

// initializes the status display with all cards
function initStatus(container) {
  const wrap = el("div", "st-wrap");
  container.appendChild(wrap);
  const left = el("div", "st-col st-col-left");
  wrap.appendChild(left);
  const right = el("div", "st-col");
  wrap.appendChild(right);
  const rightInner = el("div", "st-col-right");
  right.appendChild(rightInner);
  const musicCol = el("div", "st-music-col");
  rightInner.appendChild(musicCol);
  const rightMusic = el("div");
  musicCol.appendChild(rightMusic);
  const lyricsBox = el("div", "st-card st-lyrics");
  lyricsBox.style.display = "none";
  musicCol.appendChild(lyricsBox);
  const gamesCol = el("div", "st-games-col");
  rightInner.appendChild(gamesCol);

  let progressTimer = null;
  let clockTimer = null;
  let statusNow = null;
  let lastSong = null;
  let renderedSongId = null;

  function statusCard() {
    const status = makeCard("status",
      '<div class="st-status-line">for me its currently <span class="st-time">--:-- --</span> ' +
      'and im <span class="st-now st-now-offline">offline</span></div>');
    left.appendChild(status);
    const timeEl = status.querySelector(".st-time");
    const updateClock = () => {
      const now = new Date();
      timeEl.textContent = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago", hour: "numeric", minute: "2-digit", hour12: !loadSettings().clock24,
      }).format(now);
    };
    updateClock();
    clockTimer = setInterval(updateClock, 1000);
    window.__tickStatusClock = updateClock;
    statusNow = status.querySelector(".st-now");
  }

  function setStatus(state) {
    if (!statusNow) return;
    const display = state === "dnd" ? "busy" : state;
    statusNow.textContent = display;
    statusNow.className = "st-now st-now-" + state;
  }

  function activityCard(a) {
    const card = el("div", "st-card");
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
    const hasTime = a.timestamps && a.timestamps.start && a.timestamps.end;
    card.innerHTML =
      '<div class="st-badge">' + verb + " " + stEsc(a.name) + "</div>" +
      '<div class="st-act">' +
      (img ? '<img class="st-art" src="' + img + '" alt="">' : "") +
      '<div class="st-info">' +
      '<div class="st-name">' + title + "</div>" +
      (a.state ? '<div class="st-state">' + stEsc(a.state) + "</div>" : "") +
      (hasTime ? '<div class="st-progress"><div class="st-pbar"><div class="st-pfill"></div></div>' +
        '<div class="st-ptime"><span class="st-t-now">0:00</span><span class="st-t-end">0:00</span></div></div>' : "") +
      "</div></div>";
    if (hasTime) {
      progressTimer = startProgressTick(card, a.timestamps, (elapsed) => {
        if (currentLyrics) updateLyrics(lyricsBox, currentLyrics, elapsed / 1000);
      });
    }
    if (wantLookup && !img) {
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
    const card = el("div", "st-card");
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
    progressTimer = startProgressTick(card, s.timestamps, (elapsed) => {
      if (currentLyrics) updateLyrics(lyricsBox, currentLyrics, elapsed / 1000);
    });
    return card;
  }

  function lfCard(l) {
    return makeCard(l.nowplaying ? "listening to last.fm" : "last played on last.fm",
      '<div class="st-act">' +
      (l.image ? '<img class="st-art" src="' + l.image + '" alt="">' : "") +
      '<div class="st-info">' +
      '<div class="st-name"><a class="st-link" href="' + l.url + '" target="_blank" rel="noopener">' + stEsc(l.song) + "</a></div>" +
      '<div class="st-detail">' + stEsc(l.artist) + "</div>" +
      (l.album ? '<div class="st-state">' + stEsc(l.album) + "</div>" : "") +
      "</div></div>");
  }

  function linksCard() {
    const socials = [
      ["discord", "Discord", "https://discord.com/users/1180659671057571860"],
      ["email", "Email", "mailto:foxinwinter@outlook.com"],
      ["bluesky", "Bluesky", "https://bsky.app/profile/foxinwntr.bsky.social"],
      ["twitter", "Twitter", "https://x.com/foxinwinter"],
      ["steam", "Steam", "https://steamcommunity.com/id/foxinwntr"],
    ];
    const forges = [
      ["github", "GitHub", "https://github.com/foxinwinter"],
      ["github", "Pawprnt", "https://github.com/pawprnt"],
    ];
    const li = (i) => {
      const ico = STATUS_ICO[i[0]];
      return '<li><a href="' + i[2] + '" target="_blank" rel="noopener">' +
        '<svg class="st-ico" viewBox="' + ico.vb + '" fill="' + (ico.fill || "currentColor") + '" aria-hidden="true">' + (ico.defs || "") + ico.body + "</svg>" +
        i[1] + "</a></li>";
    };
    return makeCard("my socials + forges",
      '<div class="st-cols">' +
      '<div class="st-col"><strong class="st-title">Socials</strong><ul class="st-fl">' +
      socials.map(li).join("") +
      "</ul></div>" +
      '<div class="st-divider"></div>' +
      '<div class="st-col"><strong class="st-title">Forges</strong><ul class="st-fl">' +
      forges.map(li).join("") +
      "</ul></div>" +
      "</div>");
  }

   let notifyCooldown = false;
   function notifyCard() {
     const card = makeCard("notify",
       '<div class="st-notify-desc">send a message to my discord server</div>' +
       '<div class="st-notify">' +
       '<input class="st-notify-input" type="text" placeholder="type a message..." maxlength="200">' +
       '<button class="st-btn st-notify-btn">send</button>' +
       '<span class="st-notify-status"></span>' +
       "</div>");
     const input = card.querySelector(".st-notify-input");
     const btn = card.querySelector(".st-notify-btn");
     const status = card.querySelector(".st-notify-status");
     function send() {
       const msg = input.value.trim().replace(/[<>"'&]/g, "");
       if (!msg || notifyCooldown) return;
      notifyCooldown = true;
      btn.disabled = true;
      status.textContent = "sending...";
      status.className = "st-notify-status";
      notifyWorker(msg).then(() => {
          status.textContent = "sent!";
          status.className = "st-notify-status ok";
          input.value = "";
        }).catch(() => {
          status.textContent = "failed";
          status.className = "st-notify-status err";
        }).finally(() => {
          setTimeout(() => {
            notifyCooldown = false;
            btn.disabled = false;
            status.textContent = "";
            status.className = "st-notify-status";
          }, 30000);
        });
    }
    bindSubmit(btn, input, send);
    return card;
  }

  function errCard() {
    const c = el("div", "st-card");
    c.textContent = "couldn't reach the music server :(";
    const foot = el("div", "st-foot");
    const btn = el("button", "st-btn");
    btn.textContent = "retry";
    btn.addEventListener("click", () => {
      statusPoll();
      render();
    });
    foot.appendChild(btn);
    c.appendChild(foot);
    return c;
  }

  function gamesCard() {
    const card = el("div", "st-card st-games-card");
    card.innerHTML =
      '<div class="st-badge">games i like</div>' +
      '<hr class="st-games-hr">' +
      '<div class="st-games-grid st-games-main" style="color:var(--dim);font-size:.72rem">loading</div>';
    const mainGrid = card.querySelector(".st-games-main");
    const loadingTimer = animateLoading(mainGrid);
    fetch(WORKER_URL + "/?games=1")
      .then((r) => r.json())
      .then((d) => {
        clearInterval(loadingTimer);
        function renderGame(g) {
          const gameEl = el("div", "st-game");
          const a = document.createElement("a");
          a.href = g.steam_url || "#";
          if (g.steam_url) a.target = "_blank";
          a.rel = "noopener";
          const img = document.createElement("img");
          img.src = g.cover + "?size=128&keep_aspect_ratio=true";
          img.alt = g.name;
          img.title = g.name;
          img.loading = "lazy";
          a.appendChild(img);
          gameEl.appendChild(a);
          return gameEl;
        }
        const all = [...(d.favorite || []), ...(d.played || [])];
        if (!all.length) { mainGrid.textContent = "none"; return; }
        mainGrid.textContent = "";
        all.forEach((g) => mainGrid.appendChild(renderGame(g)));
      })
      .catch(() => { clearInterval(loadingTimer); mainGrid.textContent = "couldn't reach discord :("; });
    return card;
  }

  function idleCard() {
    return makeCard("music",
      '<div style="color:var(--dim);font-size:.82rem">no music playing right now</div>');
  }

  function renderRight(d, lf) {
    rightMusic.textContent = "";
    if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
    const music = stMusic(d);
    if (music) {
      lastSong = { type: music === d.spotify ? "spotify" : "activity", data: music };
      rightMusic.appendChild(music === d.spotify ? spotifyCard(music) : activityCard(music));
    } else if (lf && lf.nowplaying) {
      lastSong = { type: "lf", data: lf };
      rightMusic.appendChild(lfCard(lf));
    } else if (lastSong && lastSong.type !== "lf") {
      if (lastSong.type === "spotify") {
        rightMusic.appendChild(spotifyCard(lastSong.data));
      } else {
        rightMusic.appendChild(activityCard(lastSong.data));
      }
    } else if (!d) {
      rightMusic.appendChild(errCard());
      return;
    } else {
      rightMusic.appendChild(idleCard());
    }
  }

  function render() {
    if (!statusState) {
      rightMusic.textContent = "";
      const loading = el("div", "st-card");
      loading.textContent = "loading...";
      rightMusic.appendChild(loading);
      return;
    }
    const { lf, lanyard } = statusState;
    const music = stMusic(lanyard || {});
    let songId = null;
    let songArtist = null;
    let songName = null;
    let songDuration = 0;
    if (music) {
      const tsKey = music.timestamps ? ":" + music.timestamps.start + ":" + music.timestamps.end : "";
      songId = (music === (lanyard || {}).spotify ? "spotify:" : "act:") + (music.song || music.details || "") + ":" + (music.artist || music.state || "") + tsKey;
      songArtist = music.artist || music.state || "";
      songName = music.song || music.details || "";
      if (music.timestamps) songDuration = Math.round((music.timestamps.end - music.timestamps.start) / 1000);
    } else if (lf && lf.nowplaying) {
      songId = "lf:" + lf.song + ":" + lf.artist;
      songArtist = lf.artist;
      songName = lf.song;
    } else if (lastSong) {
      songId = "last:" + lastSong.type;
    }
    if (songId === renderedSongId) return;
    renderedSongId = songId;
    if (songId) clearLyrics(lyricsBox);
    if (music) {
      lastSong = { type: music === (lanyard || {}).spotify ? "spotify" : "activity", data: music };
      renderRight(lanyard || {}, lf);
      if (lanyard) setStatus(lanyard.discord_status || "offline");
      if (songArtist && songName) {
        lyricsSongId = songId;
        showLyricsLoading(lyricsBox);
        fetchLyrics(songArtist, songName, songDuration).then((lines) => {
          if (lyricsLoadingTimer) { clearInterval(lyricsLoadingTimer); lyricsLoadingTimer = null; }
          if (lyricsSongId !== songId) return;
          if (lines) {
            currentLyrics = lines;
            updateLyrics(lyricsBox, lines, 0);
          } else {
            showNoLyrics(lyricsBox);
          }
        });
      }
    } else if (lf && lf.nowplaying) {
      renderRight({}, lf);
      if (lanyard) setStatus(lanyard.discord_status || "offline");
      if (lf.artist && lf.song) {
        lyricsSongId = songId;
        showLyricsLoading(lyricsBox);
        fetchLyrics(lf.artist, lf.song, 0).then((lines) => {
          if (lyricsLoadingTimer) { clearInterval(lyricsLoadingTimer); lyricsLoadingTimer = null; }
          if (lyricsSongId !== songId) return;
          if (lines) {
            currentLyrics = lines;
            updateLyrics(lyricsBox, lines, 0);
          } else {
            showNoLyrics(lyricsBox);
          }
        });
      }
    } else {
      renderRight(lanyard || {}, lf);
      if (lanyard) setStatus(lanyard.discord_status || "offline");
    }
  }

  statusCard();
  left.appendChild(linksCard());
  left.appendChild(notifyCard());
  gamesCol.appendChild(gamesCard());
  render();
  statusSubs.add(render);
  const check = setInterval(() => {
    if (!container.isConnected) {
      clearInterval(check);
      statusSubs.delete(render);
      if (progressTimer) clearInterval(progressTimer);
      if (clockTimer) clearInterval(clockTimer);
      return;
    }
  }, 1500);
}

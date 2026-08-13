const LF_BASE = "https://ws.audioscrobbler.com/2.0/";
const YT_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
const YT_URL = "https://music.youtube.com/youtubei/v1/search";
const YT_CLIENT = { clientName: "WEB_REMIX", clientVersion: "1.20250220.01.00", hl: "en" };
const YT_SONGS_PARAMS = "EgWKAQIIAWoMEA4QChADEAQQCRAF";
const ALLOWED_ORIGINS = new Set([
  "https://pawprnt.github.io",
  "http://127.0.0.1:8080",
  "http://localhost:8080",
  "null",
]);
const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};

function json(data, status, cors) {
  return new Response(JSON.stringify(data), { status: status, headers: cors });
}

async function lastfm(method, params, env) {
  const p = new URLSearchParams({ method: method, api_key: env.LASTFM_API_KEY, format: "json", ...params });
  const res = await fetch(LF_BASE + "?" + p.toString());
  return res.json();
}

function normThumb(url) {
  if (!url) return null;
  const m = url.match(/^https:\/\/i\.ytimg\.com\/vi\/([^/]+)\/hqdefault\.jpg/);
  if (m) return "https://i.ytimg.com/vi/" + m[1] + "/hqdefault.jpg";
  if (/=w\d+-h\d+/.test(url)) return url.replace(/=w\d+-h\d+/, "=w544-h544");
  return url;
}

async function ytArt(song, artist) {
  const body = JSON.stringify({
    context: { client: YT_CLIENT },
    query: artist + " " + song,
    params: YT_SONGS_PARAMS,
  });
  const res = await fetch(YT_URL + "?key=" + YT_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  });
  const j = await res.json();
  try {
    const slr = j.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer;
    for (const sec of slr.contents) {
      const msr = sec.musicShelfRenderer;
      if (!msr) continue;
      for (const it of msr.contents || []) {
        const r = it.musicResponsiveListItemRenderer;
        const t = r && r.thumbnail && r.thumbnail.musicThumbnailRenderer && r.thumbnail.musicThumbnailRenderer.thumbnail;
        if (t && t.thumbnails && t.thumbnails.length) return normThumb(t.thumbnails[t.thumbnails.length - 1].url);
      }
    }
  } catch (e) {}
  return null;
}

async function handleArt(url, env, cors) {
  const song = (url.searchParams.get("song") || "").trim();
  const artist = (url.searchParams.get("artist") || "").trim();
  if (!song || !artist) {
    return json({ error: true, message: "song and artist required" }, 400, cors);
  }
  try {
    const j = await lastfm("track.getInfo", { artist: artist, track: song, autocorrect: "1" }, env);
    const album = j.track && j.track.album;
    if (album) {
      const imgs = album.image || [];
      const img = imgs.slice().reverse().find((i) => i["#text"]);
      if (img && img["#text"]) {
        return json({ image: img["#text"], source: "lastfm" }, 200, cors);
      }
    }
  } catch (e) {}
  const image = await ytArt(song, artist);
  if (image) {
    return json({ image: image, source: "ytmusic" }, 200, cors);
  }
  return json({ error: true, message: "no art found" }, 404, cors);
}

async function handleRecent(url, env, cors) {
  const user = url.searchParams.get("user") || env.LASTFM_USER || "foxinwinter";
  const j = await lastfm("user.getrecenttracks", { user: user, limit: "1" }, env);
  if (j.error) {
    return json({ error: true, message: j.message }, 502, cors);
  }
  const track = j.recenttracks && j.recenttracks.track && j.recenttracks.track[0];
  if (!track) {
    return json({ error: true, message: "no tracks" }, 502, cors);
  }
  const image = (track.image || []).slice().reverse().find((i) => i["#text"]) || {};
  const out = {
    nowplaying: !!(track["@attr"] && track["@attr"].nowplaying === "true"),
    song: track.name || "",
    artist: (track.artist && track.artist["#text"]) || "",
    album: (track.album && track.album["#text"]) || "",
    url: track.url || "",
    image: image["#text"] || "",
  };
  if (!out.image) {
    const yt = await ytArt(out.song, out.artist);
    if (yt) out.image = yt;
  }
  return json(out, 200, cors);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return json({ error: true, message: "forbidden origin" }, 403, {
        ...HEADERS,
        "Access-Control-Allow-Origin": origin,
      });
    }
    const cors = { ...HEADERS, "Access-Control-Allow-Origin": origin || "*" };
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    const url = new URL(request.url);
    if (url.searchParams.get("art")) {
      return handleArt(url, env, cors);
    }
    return handleRecent(url, env, cors);
  },
};

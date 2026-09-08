import { json } from "../utils/cors.js";
import { ytSearchVideoId, YT_BROWSE_PROXY, YT_INNERTUBE_CLIENT } from "../utils/ytmusic.js";

async function ytFetchLyricsBrowseId(videoId) {
  const res = await fetch("https://music.youtube.com/youtubei/v1/next?prettyPrint=false", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      context: { client: YT_INNERTUBE_CLIENT },
      videoId: videoId,
    }),
  });
  const j = await res.json();
  try {
    const tabs = j.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs;
    const lyricsTab = tabs.find((t) => {
      const pt = t?.tabRenderer?.endpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType;
      return pt === "MUSIC_PAGE_TYPE_TRACK_LYRICS";
    });
    return lyricsTab ? lyricsTab.tabRenderer.endpoint.browseEndpoint.browseId : null;
  } catch (e) {
    return null;
  }
}

async function ytFetchTimedLyrics(browseId) {
  const res = await fetch(YT_BROWSE_PROXY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      context: { client: YT_INNERTUBE_CLIENT },
      browseId: browseId,
    }),
  });
  const j = await res.json();
  try {
    const synced = j?.contents?.elementRenderer?.newElement?.type?.componentType?.model?.timedLyricsModel?.lyricsData?.timedLyricsData;
    if (!synced?.length) return null;
    return insertIntroLine(synced.map((it) => ({
      time: parseInt(it.cueRange.startTimeMilliseconds) / 1000,
      text: it.lyricLine.trim() === "\u266A" ? "" : it.lyricLine.trim(),
    })));
  } catch (e) {
    return null;
  }
}

async function fetchYtLyrics(artist, song) {
  try {
    const videoId = await ytSearchVideoId(artist + " " + song);
    if (!videoId) return null;
    const browseId = await ytFetchLyricsBrowseId(videoId);
    if (!browseId) return null;
    const lines = await ytFetchTimedLyrics(browseId);
    return lines?.length ? lines : null;
  } catch (e) {
    return null;
  }
}

function insertIntroLine(lines) {
  if (!lines || lines.length === 0) return lines;
  const sorted = lines.slice().sort((a, b) => a.time - b.time);
  if (sorted[0].time > 0.3) {
    sorted.unshift({ time: 0, text: "" });
  }
  return sorted;
}

async function fetchLrclibLyrics(artist, song, duration) {
  const params = new URLSearchParams({ artist_name: artist, track_name: song });
  if (duration > 0) params.set("duration", duration);
  try {
    const res = await fetch("https://lrclib.net/api/get?" + params.toString(), {
      headers: { "User-Agent": "pawprnt/1.0 (https://pawprnt.pages.dev)" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.syncedLyrics) return null;
    const parsed = data.syncedLyrics.split("\n").map((line) => {
      const m = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\]\s*(.*)/);
      if (!m) return null;
      const time = parseInt(m[1], 10) * 60 + parseInt(m[2], 10) + parseInt(m[3], 10) / (m[3].length === 3 ? 1000 : 100);
      return { time, text: m[4] };
    }).filter(Boolean);
    return insertIntroLine(parsed);
  } catch (e) {
    return null;
  }
}

export async function handleLyrics(url, env, cors) {
  const artist = (url.searchParams.get("artist") || "").trim();
  const song = (url.searchParams.get("song") || "").trim();
  const duration = parseInt(url.searchParams.get("duration") || "0", 10);
  if (!artist || !song) {
    return json({ error: true, message: "artist and song required" }, 400, cors);
  }
  const [ytLines, lrclibLines] = await Promise.all([
    fetchYtLyrics(artist, song),
    fetchLrclibLyrics(artist, song, duration),
  ]);
  if (ytLines) {
    if (lrclibLines) {
      const lrclibEmpty = lrclibLines.filter((l) => !l.text.trim());
      const ytTimes = new Set(ytLines.map((l) => l.time.toFixed(1)));
      for (const empty of lrclibEmpty) {
        if (!ytTimes.has(empty.time.toFixed(1))) {
          ytLines.push(empty);
        }
      }
      ytLines.sort((a, b) => a.time - b.time);
    }
    return json({ lines: ytLines, source: "ytmusic+lrclib" }, 200, cors);
  }
  if (lrclibLines?.length) return json({ lines: lrclibLines, source: "lrclib" }, 200, cors);
  return json({ error: true, message: "no synced lyrics" }, 404, cors);
}

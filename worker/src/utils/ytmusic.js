export const YT_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
export const YT_URL = "https://music.youtube.com/youtubei/v1/search";
export const YT_CLIENT = { clientName: "WEB_REMIX", clientVersion: "1.20250220.01.00", hl: "en" };
export const YT_SONGS_PARAMS = "EgWKAQIIAWoMEA4QChADEAQQCRAF";
export const YT_BROWSE_PROXY = "https://ytmbrowseproxy.zvz.be/browse?prettyPrint=false";
export const YT_INNERTUBE_CLIENT = { clientName: "26", clientVersion: "7.27.52" };

export function normThumb(url) {
  if (!url) return null;
  const m = url.match(/^https:\/\/i\.ytimg\.com\/vi\/([^/]+)\/hqdefault\.jpg/);
  if (m) return "https://i.ytimg.com/vi/" + m[1] + "/hqdefault.jpg";
  if (/=w\d+-h\d+/.test(url)) return url.replace(/=w\d+-h\d+/, "=w544-h544");
  return url;
}

export async function ytSearch(query) {
  const body = JSON.stringify({
    context: { client: YT_CLIENT },
    query: query,
    params: YT_SONGS_PARAMS,
  });
  const res = await fetch(YT_URL + "?key=" + YT_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body,
  });
  return res.json();
}

export async function ytSearchVideoId(query) {
  const j = await ytSearch(query);
  try {
    const slr = j.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer;
    for (const sec of slr.contents) {
      const msr = sec.musicShelfRenderer;
      if (!msr) continue;
      for (const it of msr.contents || []) {
        const r = it.musicResponsiveListItemRenderer;
        const vid = r?.overlay?.musicItemThumbnailOverlayRenderer?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint?.videoId;
        if (vid) return vid;
      }
    }
  } catch (e) {}
  return null;
}

export async function ytArt(song, artist) {
  const j = await ytSearch(artist + " " + song);
  try {
    const slr = j.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer;
    for (const sec of slr.contents) {
      const msr = sec.musicShelfRenderer;
      if (!msr) continue;
      for (const it of msr.contents || []) {
        const r = it.musicResponsiveListItemRenderer;
        const t = r?.thumbnail?.musicThumbnailRenderer?.thumbnail;
        if (t?.thumbnails?.length) return normThumb(t.thumbnails[t.thumbnails.length - 1].url);
      }
    }
  } catch (e) {}
  return null;
}

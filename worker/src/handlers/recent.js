import { json } from "../utils/cors.js";
import { lastfm } from "../utils/lastfm.js";
import { ytArt } from "../utils/ytmusic.js";

export async function handleRecent(url, env, cors) {
  const user = env.LASTFM_USER || "foxinwinter";
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

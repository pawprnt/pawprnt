import { json } from "../utils/cors.js";
import { lastfm } from "../utils/lastfm.js";
import { ytArt } from "../utils/ytmusic.js";

export async function handleArt(url, env, cors) {
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

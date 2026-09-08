import { json, getCors } from "./utils/cors.js";
import { handleArt } from "./handlers/art.js";
import { handleLyrics } from "./handlers/lyrics.js";
import { handleGames } from "./handlers/games.js";
import { handleNotify } from "./handlers/notify.js";
import { handleRecent } from "./handlers/recent.js";
import { handleAdmin } from "./handlers/admin.js";

export default {
  async fetch(request, env) {
    const { cors, allowed } = getCors(request);
    if (!allowed) {
      return json({ error: true, message: "forbidden" }, 403, cors);
    }
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    const url = new URL(request.url);
    if (url.searchParams.get("art")) {
      return handleArt(url, env, cors);
    }
    if (url.searchParams.get("lyrics")) {
      return handleLyrics(url, env, cors);
    }
    if (url.searchParams.get("games")) {
      return handleGames(request, env, cors);
    }
    if (url.searchParams.get("notify")) {
      return handleNotify(request, env, cors);
    }
    if (url.searchParams.get("admin")) {
      return handleAdmin(request, env, cors);
    }
    return handleRecent(url, env, cors);
  },
};

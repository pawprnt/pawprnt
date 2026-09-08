import { json } from "../utils/cors.js";

const DISCORD_USER = "1180659671057571860";
const DISCORD_PLAYED_WIDGET = "1546723550092599306";
const DISCORD_FAV_WIDGET = "1541702776973697034";

async function resolveGames(widget) {
  if (!widget) return [];
  const data = typeof widget.data === "string" ? JSON.parse(widget.data) : widget.data;
  const gameIds = (data.games || []).slice(0, 12).map((g) => g.game_id);
  const results = await Promise.allSettled(gameIds.map(async (id) => {
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const appRes = await fetch("https://discord.com/api/v10/applications/" + id + "/rpc");
        if (appRes.status === 429) {
          const wait = Math.max(parseInt(appRes.headers.get("Retry-After") || "2", 10), 1) * 1000;
          await new Promise((r) => setTimeout(r, wait * (attempt + 1)));
          continue;
        }
        if (!appRes.ok) return null;
        const app = await appRes.json();
        const steam = (app.third_party_skus || []).find((s) => s.distributor === "steam");
        return {
          name: app.name,
          cover: "https://cdn.discordapp.com/app-icons/" + app.id + "/" + app.cover_image + ".webp",
          steam_id: steam ? steam.id : null,
          steam_url: steam ? "https://store.steampowered.com/app/" + steam.id : null,
        };
      } catch (e) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
    return null;
  }));
  return results.filter((r) => r.status === "fulfilled" && r.value).map((r) => r.value);
}

export async function handleGames(request, env, cors) {
  const token = env.DISCORD_TOKEN;
  if (!token) {
    return json({ error: true, message: "discord token not configured" }, 500, cors);
  }
  const x_super = btoa(JSON.stringify({ os: "Windows", client_build_number: 472914 }));
  const params = "type=modal&with_mutual_guilds=false&with_mutual_friends=false&with_mutual_friends_count=false";
  try {
    const res = await fetch(
      "https://discord.com/api/v10/users/" + DISCORD_USER + "/profile?" + params,
      {
        headers: {
          Authorization: token,
          "User-Agent": "DiscordBot (https://pawprnt.pages.dev, 0.1.0)",
          "x-super-properties": x_super,
        },
      }
    );
    if (!res.ok) return json({ error: true, message: "discord api error" }, res.status, cors);
    const profile = await res.json();
    const playedW = (profile.widgets || []).find((w) => w.id === DISCORD_PLAYED_WIDGET);
    const favW = (profile.widgets || []).find((w) => w.id === DISCORD_FAV_WIDGET);
    if (!playedW && !favW) return json({ played: [], favorite: [] }, 200, cors);
    const [played, favorite] = await Promise.all([
      resolveGames(playedW),
      resolveGames(favW),
    ]);
    return json({ played, favorite }, 200, cors);
  } catch (e) {
    return json({ error: true, message: "failed to fetch games" }, 502, cors);
  }
}

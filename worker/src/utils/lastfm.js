const LF_BASE = "https://ws.audioscrobbler.com/2.0/";

export async function lastfm(method, params, env) {
  const p = new URLSearchParams({ method: method, api_key: env.LASTFM_API_KEY, format: "json", ...params });
  const res = await fetch(LF_BASE + "?" + p.toString());
  return res.json();
}

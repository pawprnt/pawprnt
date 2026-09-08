import { json } from "../utils/cors.js";

export async function handleNotify(request, env, cors) {
  const webhook = env.DISCORD_WEBHOOK;
  if (!webhook) return json({ error: true, message: "webhook not configured" }, 500, cors);
  let msg = "";
  try {
    const body = await request.json();
    msg = (body.message || "").trim().replace(/[<>"'&]/g, "").slice(0, 200);
  } catch (e) {
    return json({ error: true, message: "invalid body" }, 400, cors);
  }
  if (!msg) return json({ error: true, message: "empty message" }, 400, cors);
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: msg, username: "pawprnt" }),
    });
    if (!res.ok) return json({ error: true, message: "webhook failed" }, 502, cors);
    return json({ ok: true }, 200, cors);
  } catch (e) {
    return json({ error: true, message: "fetch failed" }, 502, cors);
  }
}

import { json } from "../utils/cors.js";

export async function handleAdmin(request, env, cors) {
  const password = env.ADMIN_PASSWORD;
  if (!password) return json({ error: true, message: "admin not configured" }, 500, cors);
  let pw = "";
  try {
    const body = await request.json();
    pw = (body.password || "").trim();
  } catch (e) {
    return json({ error: true, message: "invalid body" }, 400, cors);
  }
  if (pw === password) {
    return json({ ok: true }, 200, cors);
  }
  return json({ ok: false }, 401, cors);
}

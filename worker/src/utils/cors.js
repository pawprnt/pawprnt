export const ALLOWED_ORIGINS = new Set([
  "https://pawprnt.pages.dev",
  "https://pawprnt.github.io",
  "http://127.0.0.1:8080",
  "http://localhost:8080",
]);

export const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function json(data, status, cors) {
  return new Response(JSON.stringify(data), { status: status, headers: cors });
}

export function getCors(request) {
  const origin = request.headers.get("Origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return { cors: { ...HEADERS, "Access-Control-Allow-Origin": origin || "" }, allowed: false, origin };
  }
  return { cors: { ...HEADERS, "Access-Control-Allow-Origin": origin }, allowed: true, origin };
}

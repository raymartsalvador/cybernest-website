import type { VercelRequest, VercelResponse } from "@vercel/node";

const UPSTREAM_URL = process.env.BOOKING_API_URL;
const UPSTREAM_KEY = process.env.BOOKING_API_KEY;

const ALLOWED_PATHS: RegExp[] = [
  /^[a-z0-9-]+\/slots$/,
  /^[a-z0-9-]+\/slots\/book$/,
  /^[a-z0-9-]+\/appointments$/,
];

const ALLOWED_METHODS = new Set(["GET", "POST"]);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (!UPSTREAM_URL) {
    return res.status(500).json({ error: "Booking proxy not configured" });
  }

  const method = req.method ?? "GET";
  if (!ALLOWED_METHODS.has(method)) {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawPath = req.query.path;
  const segments = Array.isArray(rawPath) ? rawPath : rawPath ? [rawPath] : [];
  const path = segments.join("/");

  if (!ALLOWED_PATHS.some((rx) => rx.test(path))) {
    return res.status(404).json({ error: "Route not allowed" });
  }

  const qs =
    req.url && req.url.includes("?")
      ? req.url.slice(req.url.indexOf("?"))
      : "";
  const upstreamUrl = `${UPSTREAM_URL.replace(/\/$/, "")}/${path}${qs}`;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (method === "POST") headers["Content-Type"] = "application/json";
  if (UPSTREAM_KEY) headers["X-API-Key"] = UPSTREAM_KEY;

  const auth = req.headers.authorization;
  if (typeof auth === "string") headers["Authorization"] = auth;

  const idem = req.headers["x-idempotency-key"];
  if (typeof idem === "string") headers["X-Idempotency-Key"] = idem;

  const tz = req.headers["x-client-tz"];
  if (typeof tz === "string") headers["X-Client-TZ"] = tz;

  try {
    const upstream = await fetch(upstreamUrl, {
      method,
      headers,
      body: method === "POST" ? JSON.stringify(req.body ?? {}) : undefined,
    });

    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader(
      "Content-Type",
      upstream.headers.get("Content-Type") ?? "application/json"
    );
    return res.send(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("booking proxy upstream error:", message);
    return res.status(502).json({ error: "Upstream unavailable" });
  }
}

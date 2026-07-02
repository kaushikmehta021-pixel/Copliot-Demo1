// Snip – tiny URL shortener backend
// Single-file Bun server · zero npm dependencies

const PORT = parseInt(process.env.PORT ?? "3000", 10);
const BASE_URL =
  process.env.BASE_URL ??
  (process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : `http://localhost:${PORT}`);
const PUBLIC_DIR = process.env.PUBLIC_DIR ?? null;

/** @type {Map<string, {code:string,url:string,shortUrl:string,hits:number,createdAt:string}>} */
const links = new Map();

// ── helpers ──────────────────────────────────────────────────────────────────

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function generateCode() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => BASE62[b % 62]).join("");
}

function isValidUrl(str) {
  try {
    const { protocol } = new URL(str);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

async function tryStatic(pathname) {
  if (!PUBLIC_DIR) return null;
  // "/" maps to index.html; strip leading slash for Bun.file
  const rel = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
  const file = Bun.file(`${PUBLIC_DIR}/${rel}`);
  return (await file.exists()) ? new Response(file, { headers: CORS }) : null;
}

// ── server ───────────────────────────────────────────────────────────────────

Bun.serve({
  port: PORT,

  async fetch(req) {
    const { pathname } = new URL(req.url);
    const { method } = req;

    // OPTIONS preflight (open CORS)
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // POST /api/links  →  create short URL
    if (method === "POST" && pathname === "/api/links") {
      let body;
      try {
        body = await req.json();
      } catch {
        return json({ error: "Invalid JSON" }, 400);
      }
      if (!body?.url || !isValidUrl(body.url)) {
        return json({ error: "url must be a valid http or https URL" }, 400);
      }

      let code;
      do { code = generateCode(); } while (links.has(code));

      const link = {
        code,
        url: body.url,
        shortUrl: `${BASE_URL}/${code}`,
        hits: 0,
        createdAt: new Date().toISOString(),
      };
      links.set(code, link);
      return json(link, 201);
    }

    // GET /api/links  →  list all links
    if (method === "GET" && pathname === "/api/links") {
      return json([...links.values()]);
    }

    // Static files when PUBLIC_DIR is set.
    // An existing file always wins over a same-named short code.
    const staticRes = await tryStatic(pathname);
    if (staticRes) return staticRes;

    // GET /:code  →  302 redirect (hits++)
    if (method === "GET" && pathname.length > 1) {
      const code = pathname.slice(1);
      const link = links.get(code);
      if (link) {
        link.hits++;
        return new Response(null, {
          status: 302,
          headers: { ...CORS, Location: link.url },
        });
      }
      return json({ error: "Not found" }, 404);
    }

    return json({ error: "Not found" }, 404);
  },
});

console.log(`Snip listening on :${PORT}  BASE_URL=${BASE_URL}`);

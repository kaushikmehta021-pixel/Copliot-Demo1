# Snip — tiny URL shortener backend

Single-file Bun server with zero npm dependencies.

## Start

```bash
bun run server.js
# or
bun start
```

## API

| Method | Path | Body | Response |
|--------|------|------|----------|
| `POST` | `/api/links` | `{ "url": "https://…" }` | `201` `{ code, url, shortUrl, hits, createdAt }` |
| `GET` | `/api/links` | — | `200` array of all links |
| `GET` | `/:code` | — | `302` redirect; `404` if unknown |

Returns `400` when the request body is invalid JSON or the URL is not `http`/`https`.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | TCP port to listen on |
| `BASE_URL` | `http://localhost:<PORT>` | Origin used in `shortUrl`. Falls back to `https://$RAILWAY_PUBLIC_DOMAIN` when that variable is set. |
| `PUBLIC_DIR` | *(unset)* | When set, static files in this folder are served. `/` maps to `index.html`. A real file always wins over a same-named short code. |

## Deployment (Railway)

Set `RAILWAY_PUBLIC_DOMAIN` (provided automatically) and the `shortUrl` values
will use your public HTTPS domain. Override with `BASE_URL` if needed.

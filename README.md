# snip-cli

Zero-dependency Node.js CLI for the Snip URL shortener.

Requires Node.js ≥ 18 (uses global `fetch` and `http`/`https` built-ins).

## Commands

```
snip add <url>    Shorten a URL; prints the short link
snip ls           List all links in a table (code / hits / original URL)
snip open <code>  Open the original URL in the default OS browser
snip help         Show usage
```

## Configuration

| Variable   | Default                 | Description      |
|------------|-------------------------|------------------|
| `SNIP_API` | `http://localhost:3000` | Backend base URL |

## Local use (without npm install)

Add this folder to your `$PATH`:

```sh
# Unix / macOS
export PATH="$PATH:/path/to/snip-demo"

# PowerShell (Windows)
$env:PATH += ";C:\path\to\snip-demo"
```

Then call `snip` (Unix), `snip.cmd` (CMD), or `snip.ps1` (PowerShell) directly.

## Global install via npm

```sh
npm install -g .
```

## Examples

```sh
snip add https://example.com/very/long/article/title
# → http://localhost:3000/Ab3xY2

snip ls
# CODE    HITS  URL
# ------  ----  ----------------------------------------
# Ab3xY2     3  https://example.com/very/long/article/title

snip open Ab3xY2
# Opening https://example.com/very/long/article/title
```

#!/usr/bin/env node
'use strict';

const { spawnSync } = require('child_process');
const http  = require('http');
const https = require('https');

const BASE = (process.env.SNIP_API || 'http://localhost:3000').replace(/\/+$/, '');

// ── helpers ───────────────────────────────────────────────────────────────────

function die(msg) {
  process.stderr.write(`snip: ${msg}\n`);
  process.exit(1);
}

/** Global-fetch wrapper; exits on network error. */
async function apiFetch(path, opts) {
  try {
    return await fetch(`${BASE}${path}`, opts);
  } catch (e) {
    die(`backend unreachable at ${BASE} — ${e.message}`);
  }
}

/**
 * One-shot GET that stops at the first response and does NOT follow redirects.
 * fetch({ redirect:'manual' }) serves the same intent but the Fetch spec
 * filters the Location header out of opaque-redirect responses, so we use the
 * built-in http/https module here to read it reliably.
 */
function rawGet(urlStr) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const lib = url.protocol === 'https:' ? https : http;
    lib.request(url, { method: 'GET' }, res => {
      res.resume(); // drain body so the socket is released
      resolve({ status: res.statusCode, location: res.headers.location });
    }).on('error', reject).end();
  });
}

// ── commands ──────────────────────────────────────────────────────────────────

async function cmdAdd(url) {
  if (!url) die('<url> is required\n\n  snip add <url>');

  const res  = await apiFetch('/api/links', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const body = await res.json();
  if (!res.ok) die(body.error || `server returned ${res.status}`);

  process.stdout.write(body.shortUrl + '\n');
}

async function cmdLs() {
  const res   = await apiFetch('/api/links');
  const links = await res.json();
  if (!res.ok) die(links.error || `server returned ${res.status}`);

  if (links.length === 0) {
    process.stdout.write('No links yet.\n');
    return;
  }

  const cW = Math.max(4, ...links.map(l => l.code.length));
  const hW = Math.max(4, ...links.map(l => String(l.hits).length));

  const row = (c, h, u) => `${c.padEnd(cW)}  ${String(h).padStart(hW)}  ${u}`;
  const header  = row('CODE', 'HITS', 'URL');
  const divider = `${'-'.repeat(cW)}  ${'-'.repeat(hW)}  ${'-'.repeat(40)}`;

  process.stdout.write(
    [header, divider, ...links.map(l => row(l.code, l.hits, l.url))].join('\n') + '\n'
  );
}

async function cmdOpen(code) {
  if (!code) die('<code> is required\n\n  snip open <code>');

  let status, location;
  try {
    ({ status, location } = await rawGet(`${BASE}/${code}`));
  } catch (e) {
    die(`backend unreachable at ${BASE} — ${e.message}`);
  }

  if (status === 404) die(`unknown code "${code}"`);
  if (status !== 302)  die(`unexpected status ${status} for code "${code}"`);
  if (!location)       die('redirect had no Location header');

  // open in the OS default browser
  const pl = process.platform;
  const [cmd, ...extra] =
    pl === 'win32'  ? ['cmd', '/c', 'start', ''] :
    pl === 'darwin' ? ['open']                    :
                      ['xdg-open'];

  const r = spawnSync(cmd, [...extra, location], { stdio: 'inherit' });
  if (r.error) die(`could not open browser: ${r.error.message}`);

  process.stdout.write(`Opening ${location}\n`);
}

// ── dispatch ──────────────────────────────────────────────────────────────────

const USAGE = `Usage: snip <command> [args]

Commands:
  add <url>    Shorten a URL and print the short link
  ls           List all short links (code / hits / original URL)
  open <code>  Open the original URL in the default OS browser
  help         Show this message`;

(async () => {
  const [,, cmd, ...args] = process.argv;
  switch (cmd) {
    case 'add':    return cmdAdd(args[0]);
    case 'ls':     return cmdLs();
    case 'open':   return cmdOpen(args[0]);
    case 'help':
    case '--help':
    case '-h':
      process.stdout.write(USAGE + '\n');
      break;
    case undefined:
      process.stdout.write(USAGE + '\n');
      break;
    default:
      process.stderr.write(`snip: unknown command "${cmd}"\n\n${USAGE}\n`);
      process.exit(1);
  }
})();

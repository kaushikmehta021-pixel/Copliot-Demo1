# Snip — Design Language

Visual language borrowed from lovable.dev: dark-first, minimal, hero-centric
with a warm radial glow. This file is the source of truth for any future
styling prompt.

---

## Color Tokens

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0d0d10` | Page background |
| `--surface` | `#18181f` | Cards, input |
| `--surface-hi` | `#21212b` | Elevated / hover state |
| `--border` | `rgba(255,255,255,0.07)` | Subtle dividers |
| `--border-hi` | `rgba(255,255,255,0.12)` | Input / card outlines |
| `--text` | `#ededf2` | Primary text |
| `--muted` | `#6e6e8a` | Labels, placeholders, secondary |
| `--glow-coral` | `#ff6560` | Gradient stop 1 |
| `--glow-pink` | `#e040a8` | Gradient stop 2 — dominant accent |
| `--glow-purple` | `#7c3aed` | Gradient stop 3 |
| `--glow-indigo` | `#4338ca` | Gradient stop 4 |

## Accent Gradient (hero glow)

Three radial blobs layered on `hero::before`, all pinned toward the bottom so
the page reads near-black at the top and warm at the focal point:

```
radial-gradient(ellipse 80% 55% at 50% 90%,  rgba(224, 64,168,0.45) 0%, rgba(124,58,237,0.25) 45%, transparent 68%)
radial-gradient(ellipse 55% 40% at 30% 95%,  rgba(255,101, 96,0.30) 0%, transparent 55%)
radial-gradient(ellipse 55% 40% at 70% 95%,  rgba( 67, 56,202,0.30) 0%, transparent 55%)
```

## Typography

| Role | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Hero title | `clamp(2.8rem, 7vw, 4.5rem)` | 800 | `--text` | letter-spacing −0.03em |
| Hero subtitle | `clamp(1rem, 2.5vw, 1.2rem)` | 400 | `--muted` | max 38ch |
| Section label | `0.8rem` | 600 | `--muted` | uppercase, letter-spacing 0.1em |
| Body / table | `0.875–1rem` | 400 | `--text` | |
| Code badges | `Menlo/Consolas` mono `0.82rem` | 500 | `--glow-pink` | |

**Font stack**: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif`

## Spacing Scale

```
--s1: 0.25rem   --s2: 0.5rem   --s3: 0.75rem  --s4: 1rem
--s6: 1.5rem    --s8: 2rem     --s10: 2.5rem  --s12: 3rem   --s16: 4rem
```

## Border Radii

| Token | Value | Use |
|---|---|---|
| `--r-sm` | `8px` | Code badges, small chips |
| `--r-md` | `14px` | Notices / toasts |
| `--r-xl` | `28px` | Input card, links card |
| `--r-pill` | `9999px` | Send button |

## Borders, Shadows & Glow

```
--shadow-card: 0 2px 24px rgba(0, 0, 0, 0.5)
--ring-input:  0 0 0 1px rgba(255, 255, 255, 0.06)
```

## Element Mapping

| Snip element | Design pattern |
|---|---|
| `<main>` | Full-height flex column, `--bg`, `overflow-x: hidden` |
| `.hero` | Centered column, `isolation: isolate`, glow via `::before` pseudo |
| `.hero-title` | Massive bold white headline |
| `.hero-sub` | Muted subline, 38ch, generous bottom margin |
| `.input-card` | Dark rounded card (`--r-xl`), `--surface`, `--border-hi` outline, `--shadow-card` + `--ring-input` |
| `url-input` inside card | Transparent, full-width, no border; `--muted` placeholder |
| `.send-btn` | 38 × 38 px white-fill pill, dark arrow glyph |
| `.notice.success-notice` | Emerald tint (`rgba(16,185,129,…)`) on `--surface` |
| `.notice.error-notice` | Red tint (`rgba(239,68,68,…)`) on `--surface` |
| `.links-card` | Dark card `--r-xl`, `--shadow-card`, below hero with `--s16` margin |
| Table `<th>` | Uppercase micro-labels, `--muted`, `--border` bottom |
| `.code-link` | Mono `--glow-pink` text, faint pink bg pill |
| `.url-cell` | `--muted`, truncated ellipsis, `max-width: 280px` |

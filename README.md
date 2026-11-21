# eleventy-tactical

A super-fast [Eleventy 3](https://www.11ty.dev/) theme crafted for Counter-Strike, FPS, and gaming community blogs — combining compact `16:9` cover cards, dual **CT-Side Blue / T-Side Amber** palettes, an opposite-contrast aim crosshair cursor, a live HUD status bar, and zero-backend client-side config generators.

## Screenshots

> Add your own screenshots inside `./screenshots/` (`desktop-home.png`, `mobile-home.png`, `desktop-autoexec.png`, `desktop-practice.png`) and uncomment the table below:
>
> ```markdown
> | Desktop (CT-Side Blue Dark) | Mobile |
> | --- | --- |
> | ![Eleventy Tactical Desktop](./screenshots/desktop-home.png) | ![Eleventy Tactical Mobile](./screenshots/mobile-home.png) |
> ```

## Features

- **Dual tactical palettes + Light/Dark + CRT toggle:** Defaults to **CT-Side Blue Dark**, with instant switching to **T-Side Amber**, Light mode, and retro CRT scanlines — saved in `localStorage` and synced to PrismJS code blocks.
- **Opposite-colour aim crosshair cursor:** Inline SVG `data:image/svg+xml` reticle cursor (zero JS or network requests) that automatically flips to **T-Side Amber** on the Blue theme and **CT-Side Blue** on the Amber theme for crisp visibility everywhere (while keeping normal text cursors inside inputs and code blocks).
- **Responsive inline SVG logotype:** Swap `src/_includes/logo.svg` with your own vector logo; automatically inherits `currentColor` and `var(--accent)`.
- **Single-line HUD telemetry bar:** Live JavaScript **"Days since last operation/event"** counter driven by `src/_data/operation.json`, paired with a clickable server badge (`src/_data/servers.json`).
- **Quick Tools grid + Most Read + Latest Articles:** 4-card tool shelf on the homepage, hand-picked **Most read** articles (`src/_data/featured.json`), and the 5 latest posts.
- **Full-tile clickable `16:9` cover cards:** Height-capped cover banners on posts, compact lazy-loaded AVIF/WebP thumbnails on list views, and right-aligned soft topic pills (`Tutorials`, `News`, `Updates`).
- **Interactive pure-JS Autoexec Config Generator (`/autoexec-generator/`):** Network rate, mouse DPI + sensitivity + live eDPI calculator, scroll-wheel jump binds, radar controls, HUD/telemetry, crosshair presets, live preview, Copy, and instant `autoexec.cfg` download.
- **Interactive pure-JS Practice Config Generator (`/practice-config/`):** Toggle game mode, round rules, noclip/bot/re-throw binds, infinite ammo, default weapons, grenade trajectory preview, and HUD-free screenshot mode (`O`/`P`), with instant `practice.cfg` download.
- **Searchable Scammers / Banlist cards + client-side Report form:** Clean card layout driven by `src/_data/scammers.json` plus a zero-backend `mailto:` report composer.
- **Community Servers page:** Driven by `src/_data/servers.json` with one-click copy `connect` commands and `steam://connect/` launch buttons.

## Quick start

Requirements: **Node.js 18+** (20 LTS recommended).

```bash
git clone https://github.com/SpawnTerror/eleventy-tactical.git
cd eleventy-tactical
npm ci

# Local development server with live reload
npm start

# Production static build (outputs to _site/)
npm run build
```

Deploy `_site/` to nginx, Caddy, Cloudflare Pages, Netlify, or GitHub Pages.

### Sample nginx server block

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    root /var/www/eleventy-tactical/_site;
    index index.html;

    error_page 404 /404.html;

    location ~* ^/(img|fonts|css)/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Customising via JSON data files

Everything dynamic lives cleanly inside `src/_data/`:

- **`src/_data/site.json`** — Site name, domain, canonical URL, contact email, server badge & hostname.
- **`src/_data/operation.json`** — Live HUD day counter (`lastOperation`, `shortName`, `releaseDate`, `endDate`, `duration`).
- **`src/_data/featured.json`** — Permalinks of articles pinned under **Most read** on the homepage.
- **`src/_data/servers.json`** — Community game servers shown on `/servers/`.
- **`src/_data/scammers.json`** — Entries displayed and live-searched on `/scammers/`.
- **`src/_includes/logo.svg`** — Replace with your own inline SVG wordmark/emblem.

## Markdown & formatting reference

### Front matter

```yaml
---
title: "Your article title"
date: 2026-05-01
permalink: "/your-article-slug/"
layout: layouts/post.njk
tags: ["Tutorials"]
description: "Short SEO description."
cover: /images/2026-05-01-your-slug/cover-image.png
coverAlt: "Descriptive alt text for cover image"
---
```

Allowed default topics: `Tutorials`, `News`, `Updates` (editable in `src/tags-index.njk`).

### Images
- **Cover image:** Root-relative path in front matter (`cover: /images/YYYY-MM-DD-slug/cover.png`).
- **Inline images:** Relative path in Markdown (`![Alt text](../images/YYYY-MM-DD-slug/screenshot.png)`).
- `@11ty/eleventy-img` automatically generates responsive `AVIF`, `WebP`, and fallback variants at build time.

### Callout boxes

```markdown
::: tip
Quick gameplay or config tip.
:::

::: info
Patch date, test specs, or background context.
:::

::: caution
Important note before running scripts or changing drivers.
:::

::: warning
Critical warning (e.g. privacy notice when capturing ETW traces).
:::
```

### Code blocks, tables, and embeds
- Fenced code blocks (` ```ini `, ` ```powershell `, ` ```bash `, etc.) get automatic PrismJS highlighting and a **copy** button.
- Standard GitHub-Flavored Markdown tables work out of the box (ideal for FPS benchmark results).
- If a code block contains literal `{{` or `{%`, wrap it in `{% raw %}...{% endraw %}` so Nunjucks leaves it untouched.

## Project structure

```text
.
├── .eleventy.js                   # Eleventy config, callouts, image pipeline
├── package.json
└── src/
    ├── _data/
    │   ├── site.json              # Site branding & URLs
    │   ├── operation.json         # Live HUD day counter config
    │   ├── featured.json          # Hand-picked Most Read permalinks
    │   ├── servers.json           # Community game server list
    │   └── scammers.json          # Searchable ban/scammer cards
    ├── _includes/
    │   ├── logo.svg               # Inline responsive SVG wordmark
    │   ├── practice-generator.njk # Interactive CS2 practice.cfg builder
    │   ├── css/main.css           # Tactical styles, dual themes & SVG cursors
    │   └── layouts/
    │       ├── base.njk
    │       └── post.njk
    ├── css/prism/                 # Matching syntax highlight themes
    ├── fonts/                     # Self-hosted Roboto Mono WOFF2 fonts
    ├── files/                     # Direct downloads (e.g. practice.cfg)
    ├── images/                    # Cover & inline images
    ├── posts/                     # Markdown articles (YYYY-MM-DD-slug.md)
    ├── index.njk                  # Homepage (Tools + Most Read + 5 Latest)
    ├── autoexec.njk               # Interactive CS2 autoexec.cfg generator
    ├── servers.njk                # Community servers page
    ├── scammers.njk               # Searchable scammers cards
    ├── report-scammer.njk         # Client-side mailto report form
    ├── archive.njk                # Full archive with live search
    ├── tags-index.njk             # /topics/ overview with live counts
    └── tags.njk                   # /tags/<topic>/ filtered pages
```

## License

[MIT](./LICENSE)

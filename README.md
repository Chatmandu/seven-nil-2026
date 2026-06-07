# 7-0 · World Cup 2026  (manualmode.xyz/seven-nil)

A football drafting game. Spin a 2026 World Cup nation, draft one player from
their XI, fill your formation, watch all seven matches. Inspired by 38-0 / 82-0.

Vite + React, static, configured to live at **manualmode.xyz/seven-nil**.

---

## Run locally

```bash
npm install
npm run dev
```
Dev server runs at http://localhost:5173/seven-nil/  (note the subpath).

## Build
```bash
npm run build      # outputs to dist/
npm run preview
```

---

## Deploy on Cloudflare (recommended: separate Pages project)

Your blog is a static-site generator. Do NOT drop this into the blog repo —
its build would clash. Instead run the game as its own Cloudflare Pages
project and route the subpath to it. The game stays fully independent; the
blog never touches it.

### Step 1 — Create the Pages project
1. Push this folder to its own GitHub repo (e.g. `seven-nil-2026`).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the repo.
3. Build settings:
   - Framework preset: **Vite**  (or "None")
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy. You'll get a URL like `https://seven-nil-2026.pages.dev`.

> **Build requirements (important).** Cloudflare's current builder requires
> **Vite 6+** — this project is pinned to Vite 6, so it builds clean. If you
> ever see *"The version of Vite ... cannot be automatically configured.
> Please update to at least 6.0.0"*, that means an older Vite crept back into
> `package.json`; keep `vite` at `^6.0.0`.
>
> If the build command shows as `bun run build` and a stale `bun.lockb`
> causes trouble, either let it use bun (it's fine — there's no lockfile in
> this repo so it resolves fresh) or set the build command explicitly to
> `npm run build` in the project settings.
   The game already expects to live under `/seven-nil/`, so on the raw
   pages.dev domain assets resolve at `seven-nil-2026.pages.dev/seven-nil/`.
   That's expected — the real home is the route below.

### Step 2 — Route manualmode.xyz/seven-nil to it

**Option A — Pages custom domain + redirect rule (simplest).**
Because manualmode.xyz already serves your blog, add the game's Pages project
to the same zone and use a redirect/rewrite rule:

1. In the **manualmode.xyz** zone → Rules → **Redirect Rules** (or
   **Configuration Rules**), create a rule:
   - When incoming requests match: URI Path **starts with** `/seven-nil`
   - Then: **rewrite** to the Pages deployment.
   For a true rewrite (URL stays as manualmode.xyz/seven-nil), the cleanest
   route is a **Worker** (Option B). A plain redirect rule pointing
   `/seven-nil*` → `https://seven-nil-2026.pages.dev/seven-nil$1` works too,
   but the address bar will show the pages.dev URL.

**Option B — tiny Worker route (keeps the manualmode.xyz URL, best for SEO).**
1. Workers & Pages → Create Worker. Paste:
   ```js
   export default {
     async fetch(request) {
       const url = new URL(request.url);
       // proxy /seven-nil/* to the Pages deployment, keeping the path
       const target = "https://seven-nil-2026.pages.dev" + url.pathname + url.search;
       return fetch(target, request);
     }
   };
   ```
2. In the manualmode.xyz zone → Workers Routes, add route:
   `manualmode.xyz/seven-nil*` → this Worker.
   Now the game is served at manualmode.xyz/seven-nil with the URL intact and
   the Open Graph tags (which point at manualmode.xyz/seven-nil) resolve
   correctly for link previews.

**Option C — subdomain instead (zero routing fuss).**
If a path turns out fiddly, point a subdomain at the Pages project, e.g.
`seven-nil.manualmode.xyz`. Then change the four URLs below from
`manualmode.xyz/seven-nil` to `seven-nil.manualmode.xyz`, set Vite `base`
back to `/`, and redeploy. Simpler, just a different address shape.

---

## If you ever change the path/domain

These are the only places the URL is written. Update all, then redeploy:
- `vite.config.js` → `base`
- `index.html` → canonical, og:url, og:image(s), twitter:image, JSON-LD, icon/manifest hrefs
- `public/site.webmanifest` → start_url, scope, icon srcs
- `public/robots.txt`, `public/sitemap.xml`
- `public/_redirects`, `public/_headers`

## Check the share preview after deploy
- Facebook/WhatsApp: https://developers.facebook.com/tools/debug/
- X: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/
Paste https://manualmode.xyz/seven-nil/ and force a re-scrape.

---

## What's where
```
index.html            SEO + OG + Twitter + JSON-LD (subpath URLs baked in)
vite.config.js        base: "/seven-nil/"
public/
  og-image.png        1200×630 link-preview card
  icon-512/192, favicon-32
  site.webmanifest    PWA, scoped to /seven-nil/
  robots.txt, sitemap.xml
  _redirects          Cloudflare SPA fallback for /seven-nil/*
  _headers            caching + security headers
src/
  App.jsx             the whole game (data + engine + UI)
  main.jsx            React entry
```

## Notes
- The in-app **Share image** button makes a personal result card on the fly;
  `og-image.png` is the site-wide link-preview card. Two different things.
- The in-app "Build yours" link uses the live URL automatically, so once it's
  at manualmode.xyz/seven-nil, shared challenges point friends straight there.
- Squad data is the `SQUADS` array at the top of `src/App.jsx`, one line per
  player. Edit ratings/clubs/call-ups there; nothing else needs changing.

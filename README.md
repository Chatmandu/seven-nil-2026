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

The build outputs to `dist/seven-nil/` so the file paths physically match the
URL. That means the app works correctly **both** on the raw
`seven-nil-2026.pages.dev/seven-nil/` URL and behind your domain — no path
rewriting required, which keeps Open Graph previews accurate.

**Option A — Worker route (keeps the manualmode.xyz URL, best for SEO).**
1. Workers & Pages → Create Worker. Paste:
   ```js
   export default {
     async fetch(request) {
       const url = new URL(request.url);
       // pass the path straight through; structure already matches
       const target = "https://seven-nil-2026.pages.dev" + url.pathname + url.search;
       return fetch(target, request);
     }
   };
   ```
2. manualmode.xyz zone → Workers Routes → add `manualmode.xyz/seven-nil*`
   pointing at this Worker.

**Option B — subdomain (simplest of all).**
Point `seven-nil.manualmode.xyz` at the Pages project as a custom domain. If
you go this route, the subpath is optional: it still works as-is, or you can
set Vite `base` back to `/` and remove the nested `outDir` for clean root URLs.

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
vite.config.js        base "/seven-nil/" + outDir "dist/seven-nil"
wrangler.toml         Workers Assets config + SPA fallback
postbuild.mjs         lifts _headers to the dist root for Cloudflare
public/
  og-image.png        1200×630 link-preview card
  icon-512/192, favicon-32
  site.webmanifest    PWA, scoped to /seven-nil/
  robots.txt, sitemap.xml
  _headers            caching + security headers
src/
  App.jsx             the whole game (data + engine + UI)
  main.jsx            React entry
```
Build output: `dist/seven-nil/` (the app) plus `dist/_headers` (lifted to root).
Cloudflare serves `dist/` as the asset root, so `/seven-nil/...` resolves directly.

## Notes
- The in-app **Share image** button makes a personal result card on the fly;
  `og-image.png` is the site-wide link-preview card. Two different things.
- The in-app "Build yours" link uses the live URL automatically, so once it's
  at manualmode.xyz/seven-nil, shared challenges point friends straight there.
- Squad data is the `SQUADS` array at the top of `src/App.jsx`, one line per
  player. Edit ratings/clubs/call-ups there; nothing else needs changing.

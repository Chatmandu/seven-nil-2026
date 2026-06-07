import { copyFileSync, existsSync } from "node:fs";
// Cloudflare reads _headers and _redirects from the ROOT of the assets dir.
// Our app builds into dist/seven-nil, so lift the header rules to dist/.
const from = "dist/seven-nil/_headers";
const to = "dist/_headers";
if (existsSync(from)) { copyFileSync(from, to); console.log("postbuild: copied _headers to dist root"); }

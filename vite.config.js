import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served at https://manualmode.xyz/seven-nil/
// base + nested outDir so the built file paths PHYSICALLY match the URL,
// i.e. dist/seven-nil/index.html and dist/seven-nil/assets/...
// This makes the subpath resolve identically on the raw .pages.dev domain
// and behind the manualmode.xyz/seven-nil route — no rewrite tricks needed.
export default defineConfig({
  base: "/seven-nil/",
  plugins: [react()],
  build: {
    outDir: "dist/seven-nil",
    emptyOutDir: true,
  },
});

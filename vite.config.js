import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Hosted at https://manualmode.xyz/seven-nil/  — base must match the subpath.
export default defineConfig({
  base: "/seven-nil/",
  plugins: [react()],
});

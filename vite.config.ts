import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// Serve from the GitHub Pages project path (https://<user>.github.io/electriccity_team3/)
// unless building for a custom domain / local use (set GITHUB_PAGES_BASE=/ to override).
const base = process.env.GITHUB_PAGES_BASE ?? "/electriccity_team3/";

export default defineConfig({
  base,
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});

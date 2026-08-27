import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // GitHub Pages only serves static files, so we build as a client-only SPA.
  ssr: false,
} satisfies Config;

// react-router build's SPA-fallback prerender step currently 302s when `base` isn't "/",
// but the client bundle itself builds fine — so assemble index.html from the manifest ourselves.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const clientDir = join(process.cwd(), "build", "client");
const manifestPath = join(clientDir, ".vite", "manifest.json");

if (!existsSync(manifestPath)) {
  console.error("manifest.json not found, cannot generate index.html");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
const rootEntry = Object.values(manifest).find((entry) => entry.isEntry);

if (!rootEntry) {
  console.error("No entry chunk found in manifest");
  process.exit(1);
}

const base = process.env.GITHUB_PAGES_BASE ?? "/electriccity_team3";
const normalizedBase = base.endsWith("/") ? base : base + "/";

const cssLinks = (rootEntry.css ?? [])
  .map((href) => `    <link rel="stylesheet" href="${normalizedBase}${href}">`)
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Electric City Aquarium & Reptile Den</title>
${cssLinks}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${normalizedBase}${rootEntry.file}"></script>
  </body>
</html>
`;

writeFileSync(join(clientDir, "index.html"), html);
writeFileSync(join(clientDir, "404.html"), html);
console.log("Generated index.html and 404.html for GitHub Pages.");

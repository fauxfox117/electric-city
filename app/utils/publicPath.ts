// Root-absolute paths (e.g. "/images/foo.png") aren't rewritten by Vite's `base`,
// so prefix them manually to work when the app is hosted under a subpath (GitHub Pages).
export function withBase(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = import.meta.env.BASE_URL;
  return base + path.replace(/^\//, "");
}

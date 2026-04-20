/**
 * Prerender static HTML for each public route after `vite build`.
 *
 * Loads `/` via `vite preview`, then drives client-side route changes via
 * history.pushState to avoid needing SPA fallback in the preview server.
 * Waits for react-helmet-async to inject per-route meta, then writes the
 * final HTML to dist/<route>/index.html so social crawlers (Facebook,
 * LinkedIn, Slack) that don't execute JS still see correct title / OG tags.
 */
import { preview } from "vite";
import puppeteer from "puppeteer";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const distDir = join(projectRoot, "dist");

const ROUTES = ["/", "/products", "/about"];
const PORT = 4173;

function routeToFile(route) {
  if (route === "/") return join(distDir, "index.html");
  return join(distDir, route.replace(/^\//, ""), "index.html");
}

async function navigateAndCapture(page, route) {
  await page.evaluate((path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, route);

  await page.waitForFunction(
    (path) => {
      const link = document.querySelector('link[rel="canonical"]');
      const href = link?.getAttribute("href") ?? "";
      const tail = path === "/" ? "/" : path;
      return href.endsWith(tail);
    },
    { timeout: 10_000 },
    route,
  );

  // Small settle delay so any trailing helmet updates flush.
  await new Promise((r) => setTimeout(r, 100));

  return page.content();
}

async function main() {
  console.log("▶ Starting vite preview server...");
  const server = await preview({
    root: projectRoot,
    preview: { port: PORT, strictPort: true },
  });

  console.log("▶ Launching headless Chromium...");
  const browser = await puppeteer.launch({ headless: true });

  const writes = [];

  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/`, {
      waitUntil: "networkidle0",
      timeout: 30_000,
    });
    // Wait for initial helmet injection on the home route.
    await page.waitForFunction(
      () => !!document.querySelector('link[rel="canonical"]'),
      { timeout: 10_000 },
    );

    for (const route of ROUTES) {
      console.log(`  → Rendering ${route}`);
      const html = await navigateAndCapture(page, route);
      writes.push([routeToFile(route), html]);
    }

    await page.close();
  } finally {
    await browser.close();
    await new Promise((r) => server.httpServer.close(r));
  }

  // Write after the server has closed so we don't race with sirv's cache.
  for (const [outPath, html] of writes) {
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    console.log(`  ✓ Wrote ${outPath.replace(projectRoot, ".")}`);
  }

  console.log("✓ Prerender complete");
}

main().catch((err) => {
  console.error("✗ Prerender failed:", err);
  process.exitCode = 1;
});

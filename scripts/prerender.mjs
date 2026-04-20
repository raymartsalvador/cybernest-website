/**
 * Prerender static HTML for each public route after `vite build`.
 *
 * Runs `vite preview` (sirv with SPA fallback), drives it with Puppeteer,
 * waits for react-helmet-async to inject per-route meta, then writes the
 * final HTML to dist/<route>/index.html so social crawlers (Facebook,
 * LinkedIn, Slack) that don't execute JS still see the correct title / OG tags.
 */
import { preview } from "vite";
import puppeteer from "puppeteer";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const distDir = join(projectRoot, "dist");

if (process.env.VERCEL || process.env.SKIP_PRERENDER) {
  console.log("▶ Skipping prerender (VERCEL/SKIP_PRERENDER env set) — SPA fallback will serve all routes.");
  process.exit(0);
}

const ROUTES = ["/", "/products", "/about", "/contact", "/privacy"];
const PORT = 4173;

function routeToFile(route) {
  if (route === "/") return join(distDir, "index.html");
  return join(distDir, route.replace(/^\//, ""), "index.html");
}

function expectedCanonicalTail(route) {
  return route === "/" ? "cybernestsolution.com/" : route;
}

async function renderRoute(browser, route) {
  const page = await browser.newPage();
  // Surface any in-page errors so we can diagnose.
  page.on("pageerror", (e) => console.error(`    [pageerror ${route}]`, e.message));
  page.on("console", (m) => {
    if (m.type() === "error") console.error(`    [console ${route}]`, m.text());
  });

  const url = `http://localhost:${PORT}${route}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });

  await page.waitForFunction(
    (tail) => {
      const links = document.querySelectorAll('link[rel="canonical"]');
      for (const link of links) {
        if (link.getAttribute("href")?.endsWith(tail)) return true;
      }
      return false;
    },
    { timeout: 15_000 },
    expectedCanonicalTail(route),
  );

  // Settle for any trailing helmet updates.
  await new Promise((r) => setTimeout(r, 150));

  const html = await page.content();
  await page.close();
  return html;
}

async function main() {
  // Snapshot the pristine Vite-built index.html so reruns start clean.
  // On first run: save it. On subsequent runs: restore it before we
  // let sirv serve it (otherwise yesterday's prerendered canonical
  // leaks into today's helmet wait).
  const indexPath = join(distDir, "index.html");
  const snapshotPath = join(distDir, ".prerender-original.html");
  try {
    await readFile(snapshotPath, "utf8").then((snapshot) =>
      writeFile(indexPath, snapshot, "utf8"),
    );
    console.log("▶ Restored pristine dist/index.html from snapshot");
  } catch {
    const pristine = await readFile(indexPath, "utf8");
    await writeFile(snapshotPath, pristine, "utf8");
    console.log("▶ Saved pristine dist/index.html snapshot");
  }

  console.log("▶ Starting vite preview server...");
  const server = await preview({
    root: projectRoot,
    preview: { port: PORT, strictPort: true },
  });

  console.log("▶ Launching headless Chromium...");
  const browser = await puppeteer.launch({ headless: true });

  const writes = [];
  try {
    for (const route of ROUTES) {
      console.log(`  → Rendering ${route}`);
      const html = await renderRoute(browser, route);
      writes.push([routeToFile(route), html]);
    }
  } finally {
    await browser.close();
    await new Promise((r) => server.httpServer.close(r));
  }

  for (const [outPath, html] of writes) {
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    console.log(`  ✓ Wrote ${outPath.replace(projectRoot, ".")}`);
  }

  console.log("✓ Prerender complete");
}

main().catch((err) => {
  console.error("✗ Prerender failed:", err);
  console.warn("⚠ Continuing without prerendered routes — SPA fallback still serves all paths.");
});

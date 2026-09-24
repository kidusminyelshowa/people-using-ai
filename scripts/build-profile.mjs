// Renders profile/index.html to profile/PUAI-Company-Profile.pdf.
// Uses the installed Microsoft Edge through playwright-core, so no browser
// download is needed. Run with `npm run profile`.
import http from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";
import sharp from "sharp";

const root = process.cwd();
const out = path.join(root, "profile", "PUAI-Company-Profile.pdf");
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

// Minimal static server: CSS masks need same-origin http, not file://.
const server = http.createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = path.join(root, url === "/" ? "profile/index.html" : url);
  if (!file.startsWith(root)) return res.writeHead(403).end();
  try {
    const body = await readFile(file);
    // Chromium re-encodes WebP losslessly in PDFs; JPEG is embedded as-is,
    // which keeps the file small enough to email.
    if (path.extname(file) === ".webp") {
      const jpg = await sharp(body).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
      return res.writeHead(200, { "Content-Type": "image/jpeg" }).end(jpg);
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, r));
const { port } = server.address();

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage();
await page.goto(`http://localhost:${port}/profile/index.html`, { waitUntil: "networkidle" });
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
});

if (process.argv.includes("--png")) {
  // Page previews for checking layout.
  const pages = await page.$$(".page");
  for (const [i, el] of pages.entries()) await el.screenshot({ path: path.join(root, "profile", `preview-${String(i + 1).padStart(2, "0")}.png`) });
}

const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
await browser.close();
server.close();

// If the PDF is open in a viewer, Windows locks it; save alongside instead.
let target = out;
try {
  await writeFile(target, pdf);
} catch (err) {
  if (err.code !== "EBUSY" && err.code !== "EPERM") throw err;
  target = out.replace(/\.pdf$/, `-${Date.now()}.pdf`);
  await writeFile(target, pdf);
  console.warn("! PUAI-Company-Profile.pdf is open elsewhere; saved a copy instead");
}
console.log("✓", path.relative(root, target));

// Converts the full-resolution photos in source-images/ into web-sized
// WebP files in public/images/, and writes src/content/image-manifest.json
// listing the widths actually produced for each photo (a size is skipped
// when the original is smaller). Run with `npm run images` whenever a new
// photo is added. Existing outputs are skipped.
import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "source-images";
const OUT = "public/images";
const MANIFEST = "src/content/image-manifest.json";
// 2800 covers full-bleed photos on 1440px-wide retina screens.
const WIDTHS = [640, 960, 1280, 2000, 2800];

const slugify = (file) =>
  path
    .parse(file)
    .name.toLowerCase()
    .replace(/\(\d+\)/g, "")
    .replace(/-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-utc$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const exists = (p) => stat(p).then(() => true, () => false);

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
const manifest = {};

for (const file of files) {
  const slug = slugify(file);
  const src = path.join(SRC, file);
  const { width } = await sharp(src).rotate().metadata();
  const widths = WIDTHS.filter((w) => w <= width);
  for (const w of widths) {
    const out = path.join(OUT, `${slug}-${w}.webp`);
    if (await exists(out)) continue;
    await sharp(src)
      .rotate()
      .resize({ width: w })
      // Slightly lower quality at the largest sizes: they're only served to
      // high-density screens, where compression artefacts are far less visible.
      .webp({ quality: w >= 2000 ? 68 : 74 })
      .toFile(out);
  }
  manifest[slug] = widths;
  console.log("✓", slug, widths.join("/"));
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log("manifest →", MANIFEST);

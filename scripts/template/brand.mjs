// People using ai deck system, derived from the Sierra Breweries gap
// assessment deck (Illustrator, 1920×1080). Positions and type sizes are
// taken from that file in its own units: 1 unit = 1/144 in, and type size in
// points is half the unit size. Used by build-template.mjs and client decks.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";
import JSZip from "jszip";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const GEO = JSON.parse(await readFile(path.join(here, "geometry.json"), "utf8"));

// ---------- Brand ----------
export const C = {
  coral: "F03C4F",
  night: "20222B",
  white: "FFFFFF",
  slate: "5D5D6B",
  navy: "143D73",
  yellow: "F5C814",
  green: "4FEDAA",
  pink: "FFC4D3",
  mist: "F4F4F5", // chart tracks and panels (night at 5%)
};
export const SANS = "Apfel Grotezk";
export const SERIF = "Texturina";
export const u = (v) => v / 144; // design units → inches
export const W = 13.333;
export const H = 7.5;
export const X = 67; // left margin, units
export const RIGHT = 1853; // right edge of content, units

// ---------- Photos ----------
const photoFile = {
  team: "team-meeting-collaboration-in-a-modern-office-2026-01-08-02-16-14-utc.jpg",
  colleagues: "collaborative-colleagues-discuss-sustainable-energ-2026-03-25-00-55-29-utc.jpg",
  headphones: "smiling-woman-with-afro-hair-and-headphones-leanin-2026-06-16-06-29-22-utc.jpg",
  plaid: "smiling-woman-in-plaid-shirt-behind-glass-2026-03-24-05-27-48-utc.jpg",
  friends: "two-friends-enjoying-conversation-in-urban-setting-2026-03-25-02-43-17-utc.jpg",
  glasses: "close-up-of-face-wearing-framed-glasses-2026-03-19-02-09-40-utc.jpg",
  scooter: "happy-couple-ride-along-city-street-on-scooter-2026-03-09-23-14-30-utc.jpg",
  office: "office-colleagues-meeting-at-table-indoors-2026-03-24-01-10-29-utc.jpg",
  nilov: "pexels-mikhail-nilov-9301252.jpg",
};
export const photos = {};
for (const [k, f] of Object.entries(photoFile)) {
  const buf = await sharp(path.join(root, "source-images", f)).rotate().resize({ width: 2800, withoutEnlargement: true }).jpeg({ quality: 88 }).toBuffer();
  photos[k] = { data: "image/jpeg;base64," + buf.toString("base64") };
}

// ---------- Building blocks ----------
// Text placeholder placed by its first baseline, like the design file.
// PowerPoint puts the first baseline 0.75 × line spacing below the box top.
const ph = (name, type, { x, base, w, lines = 1, size, L = size * 1.2, color = C.night, font = "sans", bold = false, align = "left", valign = "top" }, prompt) => ({
  placeholder: {
    options: {
      name, type,
      x: u(x), y: u(base - 0.75 * L), w: u(w), h: u(L * lines + 4),
      fontFace: font === "serif" ? SERIF : SANS, italic: font === "serif", bold,
      fontSize: size / 2, lineSpacing: L / 2, color, align, valign, margin: 0,
    },
    text: prompt,
  },
});
const title = (o, prompt = "Click to add title") => ph("Title", "title", { bold: true, ...o }, prompt);
const body = (name, o, prompt = "Click to add text") => ph(name, "body", o, prompt);
const eyebrow = (o, prompt = "Eyebrow") => body("Eyebrow", { font: "serif", size: 28, L: 33.6, w: 900, ...o }, prompt);
const pic = (name, x, y, w, h) => ({ placeholder: { options: { name, type: "image", x: u(x), y: u(y), w: u(w), h: u(h) }, text: "Click the icon to add a photo" } });
// Shapes named here get their real geometry in save(): see GEOMETRY below.
const shape = (name, x, y, w, h, color) => ({ rect: { x: u(x), y: u(y), w: u(w), h: u(h), fill: { color }, objectName: name } });
const rule = (x, y, w, color = C.night, pt = 0.5) => ({ line: { x: u(x), y: u(y), w: u(w), h: 0, line: { color, width: pt } } });
const fixed = (text, { x, base, size, color, bold = false, serif = false, w = 400 }) => ({
  text: { text, options: { x: u(x), y: u(base - 0.75 * size * 1.2), w: u(w), h: u(size * 1.2 + 4), fontFace: serif ? SERIF : SANS, italic: serif, fontSize: size / 2, lineSpacing: (size * 1.2) / 2, bold, color, margin: 0, valign: "top" } },
});
// Item numbers are part of the layouts, as in the design file.
const num = (n, x, base, color = C.coral) => fixed(`0${n}`, { x, base, size: 28, color, serif: true, w: 80 });
const icon = (color) => shape(`Icon ${color}`, ...GEO.icon.rect.slice(0, 2), GEO.icon.rect[2] - GEO.icon.rect[0], GEO.icon.rect[3] - GEO.icon.rect[1], color);
const wordmark = (y, color = C.white) => shape("Wordmark", 74.05, y, 182.03, 84.57, color);

// The bowl-edged photo frame of the cover and closing slides.
const bowlPhoto = (name) => pic(name, 1066.38, 50, 1920 - 1066.38, 983.67);

// Title + subtitle stack used across content slides
const T80 = (lines = 2, color = C.night, w = 1300) => title({ x: X, base: 192.5, size: 80, L: 96, lines, w, color });
const T100 = (color = C.night) => title({ x: X, base: 179, size: 100, L: 120, w: 1700, color });

const masters = [
  {
    title: "Cover",
    background: { color: C.coral },
    objects: [
      wordmark(42.76),
      bowlPhoto("Cover photo"),
      title({ x: 74.1, base: 607.7, size: 215.6, L: 158.7, lines: 2, w: 1000, color: C.white }, "Client name"),
      body("Subtitle", { x: 74.1, base: 836.8, size: 66.8, L: 80, w: 980, font: "serif", color: C.night }, "Report or proposal title"),
      body("Date", { x: 74.1, base: 1030, size: 20, w: 480, color: C.white }, "Month Year"),
      body("Prepared for", { x: 600.9, base: 1030, size: 20, w: 460, color: C.white }, "Prepared for Client Name"),
    ],
  },
  {
    title: "Statement",
    background: { color: C.white },
    objects: [
      icon(C.coral),
      title({ x: X, base: 162.5, size: 80, L: 96, lines: 4, w: 1400 }, "A finding or argument worth a slide of its own"),
      rule(X, 526.5, 502.8),
      rule(771.4, 526.5, 626.6),
      num(1, X, 570),
      num(2, 771.4, 570),
      body("Point 1", { x: X, base: 609, size: 35, L: 42, lines: 3, w: 502.8 }, "A short supporting point"),
      body("Point 2", { x: 771.4, base: 609, size: 35, L: 42, lines: 3, w: 626.6 }, "A short supporting point"),
      shape("Callout", 67.03, 780.3, 1813.03, 300.42, C.navy),
      body("Callout text", { x: 149, base: 875.9, size: 50, L: 60, lines: 2, w: 1660, color: C.white }, "The conclusion, in a sentence or two."),
    ],
  },
  {
    title: "Three Columns",
    background: { color: C.white },
    objects: [
      icon(C.coral),
      title({ x: X, base: 220.2, size: 150, L: 180, w: 1700 }, "Big title"),
      ...[[67, 472.8], [569.9, 633.4], [1242.5, 614.5]].flatMap(([x, w], i) => [
        rule(x, 312.1, w),
        num(i + 1, x, 355.6),
        body(`Heading ${i + 1}`, { x, base: 394.6, size: 32, L: 38.4, w, bold: true }, "Heading"),
        body(`Text ${i + 1}`, { x, base: 459.5, size: 30, L: 36, lines: 7, w }, "A few lines that explain the point."),
      ]),
    ],
  },
  {
    title: "Numbered List",
    background: { color: C.white },
    objects: [
      icon(C.coral),
      title({ x: X, base: 220.2, size: 150, L: 180, w: 1700 }, "Big title"),
      body("Subtitle", { x: X, base: 283.2, size: 35, L: 42, w: 1700 }, "One line that frames the list"),
      ...[0, 1, 2].flatMap((i) => {
        const b = 428.4 + i * 160;
        return [
          num(i + 1, X, b + 10.2),
          body(`Heading ${i + 1}`, { x: 128.3, base: b, size: 47.8, L: 57.4, w: 1640, bold: true }, "Heading"),
          body(`Text ${i + 1}`, { x: 128.3, base: b + 37.5, size: 29.9, L: 35.9, lines: 2, w: 1400 }, "One or two lines that explain the point."),
          rule(67.4, b + 124, 1703.8),
        ];
      }),
    ],
  },
  {
    title: "Three Cards",
    background: { color: C.yellow },
    objects: [
      icon(C.night),
      T80(2),
      ...[67.03, 683.1, 1299.2].flatMap((x, i) => [
        shape("Card", x, 302.44, 582.65, 737.43, C.white),
        body(`Card ${i + 1} eyebrow`, { x: x + 30.3, base: 356.3, size: 28, L: 33.6, lines: 2, w: 520, font: "serif", color: C.coral }, "Stage or category"),
        body(`Card ${i + 1} heading`, { x: x + 30, base: 416.1, size: 35, L: 42, lines: 2, w: 510, bold: true }, "Heading"),
        body(`Card ${i + 1} text`, { x: x + 30, base: 514.5, size: 22, L: 26.4, lines: 14, w: 510 }, "Details, as short lines or a list."),
        rule(x + 30, 927.6, 508),
        body(`Card ${i + 1} label`, { x: x + 30, base: 960.2, size: 18, L: 21.6, w: 510, bold: true }, "Purpose"),
        body(`Card ${i + 1} note`, { x: x + 30, base: 981.8, size: 18, L: 21.6, lines: 2, w: 510 }, "Why this matters."),
      ]),
    ],
  },
  ...[
    ["Two Stages · Dark", C.night, C.white, C.green, C.coral],
    ["Two Stages · Yellow", C.yellow, C.night, C.coral, C.night],
  ].map(([name, bg, fg, numColor, ic]) => ({
    title: name,
    background: { color: bg },
    objects: [
      icon(ic),
      eyebrow({ x: X, base: 110.3, color: C.coral }, "Eyebrow"),
      title({ x: X, base: 192.5, size: 80, L: 80, lines: 3, w: 1250, color: fg }, "The headline, up to three lines"),
      ...[[67, 834.2], [943.8, 834.1]].flatMap(([x, w], i) => [
        rule(x, 446.5, w, fg),
        fixed(`0${i + 1}`, { x, base: 573.7, size: 130, bold: true, color: numColor, w: 300 }),
        body(`Heading ${i + 1}`, { x, base: 633.3, size: 38, L: 45.6, w: 880, bold: true, color: fg }, "Stage heading"),
        body(`Text ${i + 1}`, { x, base: 688.8, size: 30, L: 36, lines: 6, w: 840, color: fg }, "A few lines that describe the stage."),
      ]),
    ],
  })),
  {
    title: "Levels",
    background: { color: C.white },
    objects: [
      icon(C.coral),
      eyebrow({ x: X, base: 110.3, color: C.slate }, "Eyebrow"),
      title({ x: X, base: 209, size: 100, L: 120, w: 1700 }, "Title"),
      ...[[67.03, 539.2, C.navy, C.white], [690.5, 409.8, C.yellow, C.night], [1313.9, 263.1, C.green, C.night]].flatMap(([x, top, bg, fg], i) => [
        shape("Step card", x, top, 567.97, 1080 - top, bg),
        body(`Card ${i + 1} eyebrow`, { x: x + 30.3, base: top + 53.9, size: 28, L: 33.6, w: 510, font: "serif", color: fg }, `Level ${i + 1}`),
        body(`Card ${i + 1} heading`, { x: x + 30, base: top + 125.5, size: 28.6, L: 34.3, lines: 2, w: 510, bold: true, color: fg }, "What this level means"),
        body(`Card ${i + 1} text`, { x: x + 30, base: top + 157.4 + (i ? 34.3 : 0), size: 18, L: 21.6, lines: 8, w: 510, color: fg }, "Short list of what it covers"),
        rule(x + 30, 957.6, 508, fg),
        body(`Card ${i + 1} label`, { x: x + 30, base: 1000.2, size: 18, L: 21.6, w: 510, bold: true, color: fg }, "You leave with"),
        body(`Card ${i + 1} note`, { x: x + 30, base: 1021.8, size: 18, L: 21.6, w: 510, color: fg }, "The outcome."),
      ]),
    ],
  },
  ...[
    ["Title Only · Light", C.white, C.night, C.coral],
    ["Title Only · Dark", C.night, C.white, C.coral],
    ["Title Only · Yellow", C.yellow, C.night, C.night],
  ].map(([name, bg, fg, ic]) => ({ title: name, background: { color: bg }, objects: [icon(ic), T100(fg)] })),
  ...[
    ["Annex · Light", C.white, C.night],
    ["Annex · Dark", C.night, C.white],
  ].map(([name, bg, fg]) => ({
    title: name,
    background: { color: bg },
    objects: [
      icon(C.coral),
      eyebrow({ x: X, base: 110.3, color: C.slate }, "Annex"),
      T80(2, fg, 1350),
      body("Subtitle", { x: X, base: 343.2, size: 35, L: 42, w: 1700, color: C.coral }, "What the evidence shows, in one line"),
    ],
  })),
  {
    title: "Section · Photo",
    background: { color: C.night },
    objects: [
      pic("Photo", 0, 0, 1920, 1080),
      wordmark(42.76),
      title({ x: 74.1, base: 959.6, size: 215.6, L: 200, w: 1700, color: C.white }, "Section"),
    ],
  },
  {
    title: "Closing",
    background: { color: C.coral },
    objects: [
      bowlPhoto("Closing photo"),
      body("Date", { x: 74, base: 66.5, size: 20, w: 160, color: C.white }, "Month Year"),
      body("Prepared for", { x: 246.4, base: 66.5, size: 20, w: 460, color: C.white }, "Prepared for Client Name"),
      title({ x: 74.1, base: 585.5, size: 200, L: 164, lines: 2, w: 1000, color: C.white }, "Closing line"),
      wordmark(945.43),
      fixed("peopleusingai.org", { x: 511.5, base: 1024.5, size: 20, color: C.white }),
      fixed("hello@peopleusingai.org", { x: 927.5, base: 1024.5, size: 20, color: C.white }),
    ],
  },
  { title: "Blank · Light", background: { color: C.white }, objects: [icon(C.coral)] },
  { title: "Blank · Dark", background: { color: C.night }, objects: [icon(C.coral)] },
];

// ---------- Decks ----------
export const serif = (text, extra = {}) => ({ text, options: { fontFace: SERIF, italic: true, bold: false, ...extra } });
export const plain = (text, extra = {}) => ({ text, options: extra });
const boxes = Object.fromEntries(masters.map((m) => [m.title, Object.fromEntries(m.objects.filter((o) => o.placeholder).map(({ placeholder: { options: o } }) => [o.name, o]))]));

export function newDeck(title) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "People using ai";
  pres.company = "People using ai";
  pres.title = title;
  pres.theme = { headFontFace: SANS, bodyFontFace: SANS };
  masters.forEach((m) => pres.defineSlideMaster(m));
  // Photos are cropped to fill their placeholder, as PowerPoint does.
  const fill = (slide, key, name) => {
    const { x, y, w, h } = boxes[slide._slideLayout._name][name];
    slide.addImage({ data: photos[key].data, placeholder: name, x, y, w, h, sizing: { type: "cover", w, h } });
  };
  return { pres, fill };
}

// ---------- Geometry ----------
const EMU = 914400;
const PER = EMU / 144; // EMU per design unit
const custGeom = (paths, rect) => {
  const [rx, ry, rx1, ry1] = rect;
  const w = Math.round((rx1 - rx) * PER), h = Math.round((ry1 - ry) * PER);
  const pt = ([x, y]) => `<a:pt x="${Math.round((x - rx) * PER)}" y="${Math.round((y - ry) * PER)}"/>`;
  const one = (items) => {
    let out = "", cur = null;
    const near = (a, b) => b && Math.abs(a[0] - b[0]) < 1e-3 && Math.abs(a[1] - b[1]) < 1e-3;
    for (const it of items) {
      if (it[0] === "l") {
        if (!near(it[1], cur)) out += (cur ? "<a:close/>" : "") + `<a:moveTo>${pt(it[1])}</a:moveTo>`;
        out += `<a:lnTo>${pt(it[2])}</a:lnTo>`; cur = it[2];
      } else if (it[0] === "c") {
        if (!near(it[1], cur)) out += (cur ? "<a:close/>" : "") + `<a:moveTo>${pt(it[1])}</a:moveTo>`;
        out += `<a:cubicBezTo>${pt(it[2])}${pt(it[3])}${pt(it[4])}</a:cubicBezTo>`; cur = it[4];
      } else if (it[0] === "re") {
        const [a, b, c, d] = it[1];
        out += (cur ? "<a:close/>" : "") + `<a:moveTo>${pt([a, b])}</a:moveTo><a:lnTo>${pt([c, b])}</a:lnTo><a:lnTo>${pt([c, d])}</a:lnTo><a:lnTo>${pt([a, d])}</a:lnTo><a:close/>`;
        cur = null;
      }
    }
    return `<a:path w="${w}" h="${h}">${out}${cur ? "<a:close/>" : ""}</a:path>`;
  };
  return `<a:custGeom><a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/><a:rect l="0" t="0" r="r" b="b"/><a:pathLst>${paths.map(one).join("")}</a:pathLst></a:custGeom>`;
};
const radius = (prst, r, cx, cy, two = false) =>
  `<a:prstGeom prst="${prst}"><a:avLst><a:gd name="adj${two ? "1" : ""}" fmla="val ${Math.round((r * PER * 100000) / Math.min(cx, cy))}"/>${two ? '<a:gd name="adj2" fmla="val 0"/>' : ""}</a:avLst></a:prstGeom>`;
const geometryFor = (name, cx, cy) => {
  if (name.startsWith("Icon")) return custGeom(GEO.icon.paths, GEO.icon.rect);
  if (name === "Wordmark") return custGeom(GEO.wordmark.paths, GEO.wordmark.rect);
  if (name === "Cover photo") return custGeom(GEO.coverclip.paths, GEO.coverclip.rect);
  if (name === "Closing photo") return custGeom(GEO.closeclip.paths, GEO.closeclip.rect);
  if (name === "Card") return radius("roundRect", 55, cx, cy);
  if (name === "Callout") return radius("round2SameRect", 28.2, cx, cy, true);
  if (name === "Step card") return radius("round2SameRect", 28.2, cx, cy, true);
  return null;
};
const RECT = /<a:prstGeom prst="rect">\s*(<a:avLst\s*\/>|<a:avLst>\s*<\/a:avLst>)?\s*<\/a:prstGeom>/;

// ---------- Saving ----------
export async function save(pres, file, { potx = false } = {}) {
  const zip = await JSZip.loadAsync(await pres.write({ outputType: "nodebuffer" }));

  // Brand colours in the theme, so they appear under Theme Colours.
  const theme = "ppt/theme/theme1.xml";
  const clr = (n, hex) => `<a:${n}><a:srgbClr val="${hex}"/></a:${n}>`;
  zip.file(theme, (await zip.file(theme).async("string"))
    .replace(/<a:clrScheme[\s\S]*?<\/a:clrScheme>/,
      `<a:clrScheme name="People using ai">${clr("dk1", C.night)}${clr("lt1", C.white)}${clr("dk2", C.slate)}${clr("lt2", C.mist)}${clr("accent1", C.coral)}${clr("accent2", C.navy)}${clr("accent3", C.yellow)}${clr("accent4", C.green)}${clr("accent5", C.pink)}${clr("accent6", C.slate)}${clr("hlink", C.coral)}${clr("folHlink", C.slate)}</a:clrScheme>`)
    .replace(/<a:theme ([^>]*)name="[^"]*"/, '<a:theme $1name="People using ai"'));

  // pptxgenjs names every placeholder "Text 0" and ignores valign/margin
  // on layouts: name, anchor and inset them here, and give named shapes
  // their real geometry.
  const specs = Object.fromEntries(masters.map((m) => [m.title, m.objects.filter((o) => o.placeholder).map((o) => o.placeholder.options)]));
  const layoutGeoms = {};
  for (const f of Object.keys(zip.files).filter((f) => /^ppt\/slideLayouts\/slideLayout\d+\.xml$/.test(f))) {
    let xml = await zip.file(f).async("string");
    const list = specs[xml.match(/<p:cSld name="([^"]*)"/)[1].replace(/&amp;/g, "&")] ?? [];
    const geoms = (layoutGeoms[f.split("/").pop()] = {});
    let n = 0;
    xml = xml.replace(/<p:(sp|pic)>[\s\S]*?<\/p:\1>/g, (shape) => {
      const isPh = shape.includes("<p:ph");
      if (isPh && !shape.includes('type="sldNum"')) {
        const o = list[n++];
        if (o.type === "image") shape = shape.replace(/<p:ph(?![^>]*type=)/, '<p:ph type="pic"');
        shape = shape.replace(/(<p:cNvPr id="\d+" name=")[^"]*"/, `$1${o.name}"`);
        shape = shape.replace(/<a:bodyPr([^>]*)>(<\/a:bodyPr>)?/, `<a:bodyPr$1 lIns="0" tIns="0" rIns="0" bIns="0" anchor="t"><a:normAutofit/></a:bodyPr>`);
      }
      const name = shape.match(/<p:cNvPr [^>]*name="([^"]*)"/)?.[1] ?? "";
      const ext = shape.match(/<a:ext cx="(\d+)" cy="(\d+)"/);
      const geom = ext && geometryFor(name, +ext[1], +ext[2]);
      if (!geom) return shape;
      const idx = shape.match(/<p:ph[^>]*idx="(\d+)"/)?.[1];
      if (idx) geoms[idx] = geom;
      return shape.replace(RECT, geom);
    });
    zip.file(f, xml);
  }
  // Slides: photos in shaped placeholders keep the placeholder's shape.
  for (const f of Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))) {
    const rels = await zip.file(f.replace("slides/", "slides/_rels/") + ".rels").async("string");
    const geoms = layoutGeoms[rels.match(/slideLayouts\/(slideLayout\d+\.xml)/)[1]];
    let xml = await zip.file(f).async("string");
    xml = xml.replace(/<p:(sp|pic)>[\s\S]*?<\/p:\1>/g, (shape) => {
      const idx = shape.match(/<p:ph[^>]*idx="(\d+)"/)?.[1];
      if (shape.startsWith("<p:pic>")) shape = shape.replace(/<p:ph(?![^>]*type=)/, '<p:ph type="pic"');
      if (!idx) {
        const name = shape.match(/<p:cNvPr [^>]*name="([^"]*)"/)?.[1] ?? "";
        const ext = shape.match(/<a:ext cx="(\d+)" cy="(\d+)"/);
        const geom = ext && geometryFor(name, +ext[1], +ext[2]);
        return geom ? shape.replace(/<a:prstGeom prst="(rect|roundRect)">[\s\S]*?<\/a:prstGeom>/, geom) : shape;
      }
      return geoms[idx] ? shape.replace(RECT, geoms[idx]) : shape;
    });
    zip.file(f, xml);
  }

  // Drop pptxgenjs's unstyled "DEFAULT" layout so the menu only shows ours.
  {
    const masterRels = "ppt/slideMasters/_rels/slideMaster1.xml.rels";
    const rels = await zip.file(masterRels).async("string");
    const rid = rels.match(/Id="(rId\d+)"[^>]*Target="\.\.\/slideLayouts\/slideLayout1\.xml"|Target="\.\.\/slideLayouts\/slideLayout1\.xml"[^>]*Id="(rId\d+)"/);
    const id = rid[1] ?? rid[2];
    zip.file(masterRels, rels.replace(new RegExp(`<Relationship [^>]*Id="${id}"[^>]*/>`), ""));
    const master = "ppt/slideMasters/slideMaster1.xml";
    zip.file(master, (await zip.file(master).async("string")).replace(new RegExp(`<p:sldLayoutId [^>]*r:id="${id}"\\s*/>`), ""));
    zip.remove("ppt/slideLayouts/slideLayout1.xml");
    zip.remove("ppt/slideLayouts/_rels/slideLayout1.xml.rels");
    const ctf = "[Content_Types].xml";
    zip.file(ctf, (await zip.file(ctf).async("string")).replace(/<Override PartName="\/ppt\/slideLayouts\/slideLayout1\.xml"[^>]*\/>/, ""));
  }

  await writeFile(file, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  if (potx) {
    const ct = "[Content_Types].xml";
    zip.file(ct, (await zip.file(ct).async("string")).replace("presentationml.presentation.main+xml", "presentationml.template.main+xml"));
    await writeFile(file.replace(/\.pptx$/, ".potx"), await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  }
}

// Builds the People using ai PowerPoint template.
//   templates/PUAI-Presentation-Template.potx  (File > New from it)
//   templates/PUAI-Presentation-Template.pptx  (same deck, opens directly)
// Layouts live in ./template/brand.mjs, taken from the Sierra Breweries deck.
// The example slides here show each one in use, with guidance in the
// speaker notes. Run with `npm run template`.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { C, SANS, SERIF, X, u, newDeck, plain, save } from "./template/brand.mjs";

const { pres, fill } = newDeck("People using ai — Presentation Template");
const br = (text, extra = {}) => ({ text, options: { breakLine: true, ...extra } });
const bullet = (text, extra = {}) => ({ text, options: { bullet: { indent: 9 }, breakLine: true, ...extra } });
const list = (items) => items.map((x, k) => bullet(x, k === items.length - 1 ? { breakLine: false } : {}));

let s;

s = pres.addSlide({ masterName: "Cover" });
fill(s, "colleagues", "Cover photo");
s.addText([br("Corporate"), plain("Training")], { placeholder: "Title" });
s.addText("Proposal for your team", { placeholder: "Subtitle" });
s.addText("October 2026", { placeholder: "Date" });
s.addText("Prepared for Client Name", { placeholder: "Prepared for" });
s.addNotes("COVER. Client or topic as the big title (two short lines at most), the document type in the italic line, then the date and who it was prepared for. To change the photo: select it, press Delete, click the picture icon and choose another; it fills the bowl automatically.");

s = pres.addSlide({ masterName: "Statement" });
s.addText("You have access to powerful AI tools. Communication is how you make them useful.", { placeholder: "Title" });
s.addText("Language, culture, context and the way you work all shape what AI tools can do for you.", { placeholder: "Point 1" });
s.addText("You are the bridge between technology and your reality.", { placeholder: "Point 2" });
s.addText("We exist to make that process simpler, helping you understand AI and communicate with it effectively.", { placeholder: "Callout text" });
s.addNotes("STATEMENT. Open with the argument. Two supporting points with their numbers, then the conclusion in the navy band. Keep the headline to four lines.");

s = pres.addSlide({ masterName: "Three Columns" });
s.addText("Work with us", { placeholder: "Title" });
[
  ["Corporate Training", "Custom built in person AI training for your team. We assess your skills gaps and design training around your work and context."],
  ["Upskilling Masterclass", "A full-day in person masterclass covering AI fundamentals and sector-specific applications. Join us for a day of learning and get certified."],
  ["Join the community", "Free learning, AI experiments, conversations and research for people figuring out how to use AI in their work."],
].forEach(([h, t], i) => {
  s.addText(h, { placeholder: `Heading ${i + 1}` });
  s.addText(t, { placeholder: `Text ${i + 1}` });
});
s.addNotes("THREE COLUMNS. Findings, offers or options side by side. The space below the text takes a chart, a panel or a short footnote.");

s = pres.addSlide({ masterName: "Numbered List" });
s.addText("The Business Risk", { placeholder: "Title" });
s.addText("Use for risks, findings or recommendations: up to three, each with a heading and one or two lines.", { placeholder: "Subtitle" });
[
  ["Data and governance", "Company information handled through accounts and tools the organisation does not centrally manage."],
  ["Knowledge loss", "Useful prompts, workflows and AI configurations belong to individuals rather than the organisation, and may disappear when people move on."],
  ["Productivity fragmentation", "People discover good ways of using AI on their own, but what works does not spread across the team."],
].forEach(([h, t], i) => {
  s.addText(h, { placeholder: `Heading ${i + 1}` });
  s.addText(t, { placeholder: `Text ${i + 1}` });
});
s.addNotes("NUMBERED LIST. Three items, each a heading with one or two lines beneath.");

s = pres.addSlide({ masterName: "Three Cards" });
s.addText("How the assessment informs the upskilling plan", { placeholder: "Title" });
[
  ["Before the workshop", "Standardise the environment", ["Confirm the supported AI platform", "Provide company-managed accounts", "Issue a clear interim AI-use rule"], "The capability built in the workshop sits inside a company-supported environment."],
  ["The training", "Foundation, then application", ["How AI works and where it fails", "Verification and judgement", "Real tasks from your own work"], "Everyone starts from the same point and moves to deliberate, effective use."],
  ["After the workshop", "Follow-up through AI champions", ["Capture useful prompts and workflows", "Share successful use cases", "Reinforce good practice"], "The learning continues beyond the training day."],
].forEach(([e, h, items, note], i) => {
  s.addText(e, { placeholder: `Card ${i + 1} eyebrow` });
  s.addText(h, { placeholder: `Card ${i + 1} heading` });
  s.addText(list(items), { placeholder: `Card ${i + 1} text` });
  s.addText("Purpose", { placeholder: `Card ${i + 1} label` });
  s.addText(note, { placeholder: `Card ${i + 1} note` });
});
s.addNotes("THREE CARDS. Before / during / after, or three options. The bottom of each card holds its purpose or outcome.");

s = pres.addSlide({ masterName: "Two Stages · Dark" });
s.addText("Theory modules", { placeholder: "Eyebrow" });
s.addText("The morning moves from why AI matters, to how it works, to how to talk to it.", { placeholder: "Title" });
s.addText("Stage One: Context and understanding.", { placeholder: "Heading 1" });
s.addText("Where AI came from and where it’s heading, how tools like ChatGPT actually work, and what AI means for business.", { placeholder: "Text 1" });
s.addText("Stage Two: Communicating with AI.", { placeholder: "Heading 2" });
s.addText("The ingredients of a strong prompt, how context and memory work, and how to check output before using it.", { placeholder: "Text 2" });
s.addNotes("TWO STAGES (dark). Pair with the yellow version for two halves of a programme, e.g. morning and afternoon.");

s = pres.addSlide({ masterName: "Two Stages · Yellow" });
s.addText("Practical modules", { placeholder: "Eyebrow" });
s.addText("The day moves from the company, to the tool, to the person’s own work.", { placeholder: "Title" });
s.addText("Stage One: Tool setup.", { placeholder: "Heading 1" });
s.addText("Build step by step: profile instructions, preferences and style, uploads and a Project.", { placeholder: "Text 1" });
s.addText("Stage Two: Applied to their own work.", { placeholder: "Heading 2" });
s.addText("Each person picks one recurring task from their actual job, builds a Project for it, runs it and checks the output.", { placeholder: "Text 2" });
s.addNotes("TWO STAGES (yellow).");

// A table in the house style: italic column labels, a dark rule, then rows.
s = pres.addSlide({ masterName: "Title Only · Light" });
s.addText("Three ways to work with us", { placeholder: "Title" });
{
  const none = { type: "none" };
  const under = (color) => [none, none, { type: "solid", pt: 0.5, color }, none];
  const cell = (text, o) => ({ text, options: { fontFace: SANS, border: under(C.slate), margin: [0.12, 0, 0.12, 0], valign: "middle", ...o } });
  const head = ["Offer", "For", "What it is"].map((t) => ({ text: t, options: { fontFace: SERIF, italic: true, fontSize: 14, color: C.slate, border: under(C.night), margin: [0, 0, 0.06, 0] } }));
  const rows = [
    ["Corporate Training", "Teams", "Custom built in person AI training, designed around your work and context."],
    ["Upskilling Masterclass", "Individuals", "A full day in person, covering AI fundamentals and sector-specific applications, with certification."],
    ["Community", "Everyone", "Free learning, AI experiments, conversations and research."],
  ].map(([a, b, c]) => [cell(a, { bold: true, fontSize: 20 }), cell(b, { fontSize: 12 }), cell(c, { fontSize: 12 })]);
  s.addTable([head, ...rows], { x: u(X), y: u(250), w: u(1708.6), colW: [u(793), u(300), u(615.6)], rowH: [u(56), u(110), u(110), u(110)], color: C.night, autoPage: false });
}
s.addNotes("TABLE. Title Only layouts take tables, charts or anything custom. Table style: italic column labels over a dark rule, bold first column, thin rules between rows, no boxes or fills. Copy this table to start a new one.");

// A chart in the house style: dark bars on light tracks, values at the end.
s = pres.addSlide({ masterName: "Annex · Light" });
s.addText("Annex", { placeholder: "Eyebrow" });
s.addText("Capability drops sharply beyond basic AI use", { placeholder: "Title" });
s.addText("Example data: respondents who report having used each capability.", { placeholder: "Subtitle" });
{
  const labels = ["File uploads", "Profile instructions", "Projects / workspaces", "Custom assistants", "Connectors"];
  const values = [12, 8, 6, 2, 0];
  s.addChart(pres.charts.BAR, [
    { name: "Track", labels, values: labels.map(() => 15) },
    { name: "Respondents", labels, values },
  ], {
    x: u(X), y: u(430), w: u(1730), h: u(450),
    barDir: "bar", barGrouping: "clustered", barOverlapPct: 100, barGapWidthPct: 60,
    chartColors: [C.mist, C.night],
    catAxisOrientation: "maxMin", catAxisLabelFontFace: SANS, catAxisLabelFontSize: 15, catAxisLabelColor: C.night, catAxisLineShow: false,
    valAxisHidden: true, valAxisMinVal: 0, valAxisMaxVal: 15, valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontFace: SANS, dataLabelFontBold: true, dataLabelFontSize: 15, dataLabelColor: C.night,
    showLegend: false,
  });
}
s.addNotes("CHART. A native PowerPoint chart: right-click > Edit Data to change it. The light ‘Track’ series is the scale (set every value to the maximum); the dark series is the data. To highlight one bar, click it twice and set its fill (coral to highlight, green for a correct answer).");

s = pres.addSlide({ masterName: "Levels" });
s.addText("Annex", { placeholder: "Eyebrow" });
s.addText("From foundations to automation", { placeholder: "Title" });
[
  ["Level 1: Foundations", "You guide the AI through your own work.", ["How AI works, and where it goes wrong", "Setting up the tool properly", "Checking output before using it"], "A working Project for one recurring part of your job."],
  ["Level 2: Skills", "The AI knows how to do the task, and you check it.", ["Writing a task down clearly", "Packaging it as a shared skill"], "Shared skills your whole team can use."],
  ["Level 3: Automation", "The task runs on its own, and you oversee it.", ["Choosing what’s worth automating", "Keeping people on the key checks"], "Routine work running with less hands-on effort."],
].forEach(([e, h, items, note], i) => {
  s.addText(e, { placeholder: `Card ${i + 1} eyebrow` });
  s.addText(h, { placeholder: `Card ${i + 1} heading` });
  s.addText(list(items), { placeholder: `Card ${i + 1} text` });
  s.addText("You leave with", { placeholder: `Card ${i + 1} label` });
  s.addText(note, { placeholder: `Card ${i + 1} note` });
});
s.addNotes("LEVELS. A progression in three steps; the cards rise from left to right.");

s = pres.addSlide({ masterName: "Annex · Dark" });
s.addText("Annex", { placeholder: "Eyebrow" });
s.addText("Six different AI tools are already in use", { placeholder: "Title" });
s.addText("The dark version of the annex layout, for charts and evidence.", { placeholder: "Subtitle" });
s.addNotes("ANNEX (dark). Charts on dark slides use white labels; set the track series to slate.");

s = pres.addSlide({ masterName: "Title Only · Dark" });
s.addText("Workshop schedule", { placeholder: "Title" });
s.addNotes("TITLE ONLY (dark). Also available in light and yellow.");

s = pres.addSlide({ masterName: "Section · Photo" });
fill(s, "friends", "Photo");
s.addText("Annex", { placeholder: "Title" });
s.addNotes("SECTION. Opens a new part of the deck, e.g. the annex. Pick a photo with a calm lower-left area for the title.");

s = pres.addSlide({ masterName: "Closing" });
fill(s, "team", "Closing photo");
s.addText("October 2026", { placeholder: "Date" });
s.addText("Prepared for Client Name", { placeholder: "Prepared for" });
s.addText([br("Let’s make"), plain("AI useful.")], { placeholder: "Title" });
s.addNotes("CLOSING. Contact details and logo are part of the layout.");

const out = path.join(process.cwd(), "templates", "PUAI-Presentation-Template.pptx");
await mkdir(path.dirname(out), { recursive: true });
await save(pres, out, { potx: true });

// Charts: show values on the data series only, not on the track.
for (const f of [out, out.replace(/\.pptx$/, ".potx")]) {
  const zip = await JSZip.loadAsync(await readFile(f));
  for (const c of Object.keys(zip.files).filter((n) => /^ppt\/charts\/chart\d+\.xml$/.test(n))) {
    const xml = await zip.file(c).async("string");
    zip.file(c, xml.replace(/(<c:ser>[\s\S]*?<c:dLbls>[\s\S]*?)<c:showVal val="1"\/>/, '$1<c:showVal val="0"/>'));
  }
  await writeFile(f, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}
console.log("✓ templates/PUAI-Presentation-Template.potx and .pptx");

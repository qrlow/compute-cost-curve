import assert from "node:assert/strict";
import {mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {createRequire} from "node:module";
import {resolve} from "node:path";
import {runInNewContext} from "node:vm";

// Render directly from the verified chart inputs; no values are read from pixels.
// Usage: npm run build && node scripts/export-blog-curves.mjs <path-to-sharp>
const require = createRequire(import.meta.url);
const sharp = require(process.argv[2] || "sharp");
const root = resolve(import.meta.dirname, "..");
const context = {window: {}};
runInNewContext(readFileSync(resolve(root, "generated/chart-data.js"), "utf8"), context);
const data = context.window.COMPUTE_COST_DATA;
const scenarios = data.scenarios.filter(s => s.evidenceId === "comparable_proxy")
  .sort((a, b) => Number(a.technologyId !== "same_technology") - Number(b.technologyId !== "same_technology"));
assert.equal(scenarios.length, 2);
assert.equal(scenarios[0].technologyId, "same_technology");
assert.equal(scenarios[1].technologyId, "export_constrained");
assert.ok(Math.abs(scenarios[0].totalCapacityMw - scenarios[1].totalCapacityMw) < 1e-6);
for (const s of scenarios) {
  assert.equal(s.blocks.length, 28);
  assert.ok(Math.abs(s.blocks.reduce((sum, b) => sum + b.capacityMw, 0) - s.totalCapacityMw) < 1e-6);
  s.blocks.forEach((b, i) => {
    assert.ok(b.capacityMw > 0 && b.costUsdPer1e19Flops > 0);
    if (i) assert.ok(b.costUsdPer1e19Flops >= s.blocks[i - 1].costUsdPer1e19Flops);
  });
}

const W = 1800, H = 1070;
const colors = {China: "#b43e32", "United States": "#356d9b", Canada: "#cb9222", "United Kingdom": "#6f5d91"};
const ink = "#15201c", muted = "#5c675f", paper = "#fffdf8";
const esc = s => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const text = (x, y, value, attrs = "") => `<text x="${x}" y="${y}" ${attrs}>${esc(value)}</text>`;
const line = (x1, y1, x2, y2, attrs = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attrs}/>`;
const maxCost = Math.max(.6, Math.ceil(Math.max(...scenarios.flatMap(s => s.blocks.map(b => b.costUsdPer1e19Flops))) * 10) / 10);
const shortName = name => name === "Quebec — Montreal market subtotal" ? "Montreal subtotal" : name.includes(" — ") ? name.split(" — ")[1] : name;
const panelWidth = 812, plotWidth = 720, top = 356, baseline = 796;

function panel(s, origin) {
  const left = origin + 72;
  const x = capacity => left + capacity / s.totalCapacityMw * plotWidth;
  const y = cost => baseline - cost / maxCost * (baseline - top);
  const center = left + plotWidth / 2;
  const parts = [
    text(origin, 264, s.technologyTitle, 'class="panel-title"'),
    text(origin, 299, s.technologyId === "same_technology" ? "NVIDIA GB200 NVL72 in every region" : "China: Huawei CloudMatrix384 · Elsewhere: NVIDIA GB200 NVL72", 'class="panel-subtitle"'),
    text(origin, 323, s.technologyId === "same_technology" ? "Standardized hardware and power efficiency" : "China: 2.5× electricity per dense-BF16 FLOP (estimated)", 'class="panel-subtitle"')
  ];
  for (let i = 0; i <= Math.round(maxCost * 10); i++) {
    const value = i / 10, yy = y(value);
    parts.push(line(left, yy, left + plotWidth, yy, 'stroke="#dedbd3" stroke-width="1"'));
    parts.push(text(left - 13, yy + 5, value.toFixed(1), 'class="tick" text-anchor="end"'));
  }
  let cumulative = 0;
  const labels = [];
  let ukStart = null;
  for (const b of s.blocks) {
    const x0 = x(cumulative), x1 = x(cumulative + b.capacityMw), y0 = y(b.costUsdPer1e19Flops);
    cumulative += b.capacityMw;
    parts.push(`<rect class="capacity-block" data-mw="${b.capacityMw}" data-cost="${b.costUsdPer1e19Flops}" x="${x0}" y="${y0}" width="${x1 - x0}" height="${baseline - y0}" fill="${colors[b.country]}"><title>${esc(b.location)}: ${b.capacityMw.toFixed(1)} MW; $${b.costUsdPer1e19Flops.toFixed(3)} per 10¹⁹ FLOPs</title></rect>`);
    // Hairline separators never eat the area of very narrow capacity blocks.
    if (x1 - x0 > 2) parts.push(line(x0, y0, x0, baseline, 'stroke="#fffdf8" stroke-opacity=".7" stroke-width=".65"'));
    if (b.country === "United Kingdom") {
      ukStart ??= x0;
    } else if (b.country !== "Canada") {
      // Montreal's very narrow gold block is identified in the country legend.
      labels.push(`<text class="region-label" text-anchor="start" transform="translate(${(x0 + x1) / 2 + 5} ${y0 - 10}) rotate(-90)">${esc(shortName(b.location))}</text>`);
    }
  }
  if (ukStart != null) {
    labels.push(`<text class="region-label" fill="white" transform="translate(${(ukStart + left + plotWidth) / 2 + 5} ${baseline - 20}) rotate(-90)">Great Britain · 11 regions</text>`);
  }
  parts.push(...labels);
  parts.push(line(left, top, left, baseline, `stroke="${ink}" stroke-width="1.3"`));
  parts.push(line(left, baseline, left + plotWidth, baseline, `stroke="${ink}" stroke-width="1.3"`));
  for (const share of [0, .25, .5, .75, 1]) {
    const xx = left + share * plotWidth;
    parts.push(line(xx, baseline, xx, baseline + 5, `stroke="${ink}"`));
    parts.push(text(xx, baseline + 27, Math.round(s.totalCapacityMw * share).toLocaleString("en-US"), 'class="tick" text-anchor="middle"'));
  }
  parts.push(text(center, 857, "Cumulative data center capacity operational by end 2025,", 'class="axis-title" text-anchor="middle"'));
  parts.push(text(center, 881, "Design IT Capacity excluding cooling etc (MW)", 'class="axis-title" text-anchor="middle"'));
  parts.push(`<text class="axis-title" text-anchor="middle" transform="translate(${origin + 17} ${(top + baseline) / 2}) rotate(-90)">USD per 10¹⁹ dense-BF16 FLOPs</text>`);
  parts.push(text(left, 912, "LOWEST COST", 'class="direction"'));
  parts.push(text(left + plotWidth, 912, "HIGHEST COST →", 'class="direction" text-anchor="end"'));
  return `<g class="scenario" data-technology="${s.technologyId}" data-total-mw="${s.totalCapacityMw}">${parts.join("\n")}</g>`;
}

const legend = Object.entries(colors).map(([country, color], i) => {
  const x = 64 + [0, 140, 337, 610][i];
  const name = country === "United Kingdom" ? "Great Britain" : country === "Canada" ? "Canada · Montreal subtotal" : country;
  return `<rect x="${x}" y="181" width="17" height="17" fill="${color}"/>${text(x + 26, 195, name, 'class="legend"')}`;
}).join("\n");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">
<title id="title">An Exploratory Global Compute Cost Curve</title>
<desc id="desc">Two electricity-only cost curves comparing standardized NVIDIA hardware everywhere with an export-constrained scenario using Huawei hardware in China. Each curve contains the same 28 regional capacity estimates, sorted by cost with identical axes. The China electricity-per-FLOP multiplier is an engineering estimate, not a measured fleet benchmark.</desc>
<metadata>Input SHA-256: ${data.metadata.inputSha256}</metadata>
<style>
text { font-family: "Helvetica Neue", Arial, sans-serif; fill: ${ink}; }
.eyebrow { fill: ${muted}; font-size: 14px; font-weight: 600; letter-spacing: 2px; }
.title { font-family: Georgia, serif; font-size: 45px; }
.subtitle { font-family: Georgia, serif; font-style: italic; font-size: 25px; fill: #46534b; }
.legend { font-size: 17px; }
.panel-title { font-family: Georgia, serif; font-size: 30px; }
.panel-subtitle { font-size: 17px; fill: ${muted}; }
.tick { font-size: 16px; fill: ${muted}; }
.axis-title { font-size: 17px; font-weight: 500; }
.region-label { font-size: 16px; }
.region-label[fill="white"] { fill: white; }
.direction { font-size: 13px; letter-spacing: 1px; fill: ${muted}; }
.note { font-size: 16px; fill: ${muted}; }
</style>
<rect width="${W}" height="${H}" fill="${paper}"/>
${text(64, 48, "2025 · ELECTRICITY-ONLY COMPUTE COST", 'class="eyebrow"')}
${text(64, 108, "An Exploratory Global Compute Cost Curve", 'class="title"')}
${text(64, 151, "How far can cheap power carry China in the AI race?", 'class="subtitle"')}
${legend}
${text(W - 64, 195, `${Math.round(scenarios[0].totalCapacityMw).toLocaleString("en-US")} MW plotted in each curve · 28 regional estimates`, 'class="legend" text-anchor="end"')}
${line(64, 220, W - 64, 220, 'stroke="#bdb8ad"')}
${panel(scenarios[0], 64)}
${panel(scenarios[1], 64 + panelWidth + 48)}
${line(64, 941, W - 64, 941, 'stroke="#bdb8ad"')}
${text(64, 974, `Assumptions: PUE ${data.assumptions.commonPue.toFixed(2)} throughout; GB200 NVL72 ${data.assumptions.gb200DenseBf16Pflops} dense-BF16 PFLOP/s per ${data.assumptions.gb200RackPowerKw} kW rack. China’s 2.5× multiplier is an engineering estimate, not a metered benchmark.`, 'class="note"')}
${text(64, 1003, "Scope: selected regional estimates, not a global census. Capacity vintages differ; electricity prices effective during 2025 mix public tariffs and industrial averages.", 'class="note"')}
${text(64, 1032, "Sources and full methodology: github.com/qrlow/compute-cost-curve · GB regions share one price proxy; all 11 capacity blocks are retained.", 'class="note"')}
</svg>`;

assert.equal((svg.match(/class="capacity-block"/g) || []).length, 56);
const output = resolve(root, "exports");
mkdirSync(output, {recursive: true});
const svgPath = resolve(output, "compute-cost-curves-2025.svg");
const pngPath = resolve(output, "compute-cost-curves-2025.png");
writeFileSync(svgPath, svg);
await sharp(Buffer.from(svg), {density: 144}).png().toFile(pngPath);
const info = await sharp(pngPath).metadata();
assert.equal(info.width, W * 2);
assert.equal(info.height, H * 2);
console.log(`Exported ${info.width} × ${info.height} PNG and editable SVG. All 56 region blocks preserve the chart inputs.`);
console.log(svgPath);
console.log(pngPath);

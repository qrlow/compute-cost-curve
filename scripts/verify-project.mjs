import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createContext, runInContext } from "node:vm";
import {
  ROOT,
  buildCoverage,
  buildFacilityRegister,
  buildModel,
  calculateCapacity,
  calculateCost,
  calculatePrice,
  deriveProvinceCapacities,
  loadInputs,
  sha256
} from "./lib/project.mjs";

const {project, benchmarks, geometry, sourceReview, inputHash} = loadInputs();
const failures = [];
const passes = [];
const warnings = [];

function check(condition, message) {
  if (condition) passes.push(message);
  else failures.push(message);
}

function close(actual, expected, tolerance = 1e-8) {
  return Math.abs(actual - expected) <= tolerance;
}

function unique(items) {
  return new Set(items).size === items.length;
}

check(project.schemaVersion === "1.1.0", "canonical schema version is supported");
check(project.capacityStandard.metricId === "commissioned_design_it_power_mw", "one harmonized capacity metric is declared");
check(unique(project.sources.map((source) => source.id)), "source IDs are unique");
check(sourceReview.schemaVersion === "1.0.0", "second-agent review schema version is supported");
check(sourceReview.reviewerType === "ai_agent", "second review is explicitly labelled AI, not human");
check(/^\d{4}-\d{2}-\d{2}$/.test(sourceReview.reviewedOn), "second review has a dated audit pass");
check(sourceReview.records.length === project.sources.length, "every source has a second-review outcome, including failed access");
check(unique(sourceReview.records.map((row) => row.sourceId)), "second-review source IDs are unique");
const reviewStatuses = ["confirmed", "qualified", "discrepancy", "not_verified"];
check(Object.keys(sourceReview.statusDefinitions).sort().join() === [...reviewStatuses].sort().join(), "review outcomes have explicit definitions");
for (const row of sourceReview.records) {
  const source = project.sources.find((item) => item.id === row.sourceId);
  check(Boolean(source), `${row.sourceId}: second review references an existing source`);
  check(source && row.sourceSha256 === sha256(JSON.stringify(source)), `${row.sourceId}: source fingerprint matches the review`);
  check(reviewStatuses.includes(row.status), `${row.sourceId}: second-review status is valid`);
  for (const field of ["accessMethod", "locator", "findings", "action"]) {
    check(typeof row[field] === "string" && row[field].trim().length > 0, `${row.sourceId}: ${field} is recorded`);
  }
  check(row.evidenceUrls.length > 0 && row.evidenceUrls.includes(source?.url), `${row.sourceId}: registered source URL is retained`);
  check(row.evidenceUrls.every((url) => /^https?:\/\//.test(url)), `${row.sourceId}: evidence URLs are explicit web links`);
}
const unresolvedReviewCount = sourceReview.records.filter((row) => row.status !== "confirmed").length;
warnings.push(`Second-agent review: ${unresolvedReviewCount} sources qualified, discrepant or unverified. Build success verifies reproduction and review completeness, not resolution or overall source assurance.`);
check(unique(project.capacityRecords.map((record) => record.id)), "capacity-record IDs are unique");
check(unique(project.priceRecords.map((record) => record.id)), "price-record IDs are unique");
check(unique(project.technologyScenarios.map((scenario) => scenario.id)), "technology-scenario IDs are unique");
check(unique(project.evidenceScenarios.map((scenario) => scenario.id)), "price-evidence scenario IDs are unique");
check(unique(project.chinaCapacityCrosschecks.map((record) => record.id)), "China-capacity cross-check IDs are unique");
check(unique(benchmarks.markets.map((market) => market.id)), "global market benchmark IDs are unique");

const sourceIds = new Set(project.sources.map((source) => source.id));
for (const record of [...project.capacityRecords, ...project.priceRecords, ...project.technologyScenarios]) {
  for (const sourceId of record.sourceIds) check(sourceIds.has(sourceId), `${record.id} references source ${sourceId}`);
}
for (const record of project.chinaCapacityCrosschecks) {
  for (const sourceId of record.sourceIds) check(sourceIds.has(sourceId), `${record.id} references source ${sourceId}`);
}
for (const sourceId of [
  ...benchmarks.globalBenchmark.sourceIds,
  ...benchmarks.marketForecast.sourceIds,
  ...benchmarks.countryOverrides.flatMap((record) => record.sourceIds)
]) check(sourceIds.has(sourceId), `coverage benchmark references source ${sourceId}`);

for (const record of project.capacityRecords) {
  check(["additive", "subset_not_additive", "excluded"].includes(record.coverageRole), `${record.id} has a valid coverage role`);
  check(/^[A-Z]{3}$/.test(record.iso3), `${record.id} has an ISO3 country code`);
}

const provinceNames = new Set(geometry.map((row) => row.province));
const capacityIds = new Set(project.capacityRecords.map((record) => record.id));
const priceIds = new Set(project.priceRecords.map((record) => record.id));
for (const evidence of project.evidenceScenarios) {
  check(unique(evidence.blocks.map((block) => block.id)), `${evidence.id} has no duplicate blocks`);
  for (const block of evidence.blocks) {
    const capacityExists = block.capacityRef.startsWith("province:")
      ? provinceNames.has(block.capacityRef.slice("province:".length))
      : capacityIds.has(block.capacityRef);
    check(capacityExists, `${evidence.id}/${block.id} has a valid capacity reference`);
    check(priceIds.has(block.priceRef), `${evidence.id}/${block.id} has a valid price reference`);
  }
}

const cutoff = project.metadata.observationCutoff;
const includedCapacityRefs = new Set(project.evidenceScenarios.flatMap((scenario) => scenario.blocks.map((block) => block.capacityRef)));
const includedPriceRefs = new Set(project.evidenceScenarios.flatMap((scenario) => scenario.blocks.map((block) => block.priceRef)));
for (const reference of includedCapacityRefs) {
  if (reference.startsWith("province:")) continue;
  const record = project.capacityRecords.find((item) => item.id === reference);
  check(record.metricId === project.capacityStandard.metricId, `${reference} matches the harmonized capacity definition`);
  check(record.observationDate <= cutoff, `${reference} is at or before the observation cutoff`);
}
for (const reference of includedPriceRefs) {
  const record = project.priceRecords.find((item) => item.id === reference);
  check(record.eligibility === "included", `${reference} is eligible for display`);
  check(record.effectiveDate && record.effectiveDate <= cutoff, `${reference} is dated at or before the observation cutoff`);
}

const researchCutoff = project.metadata.researchPublicationCutoff;
for (const source of project.sources) {
  if (source.publicationDate == null) {
    warnings.push(`${source.id}: publication date is unknown; verification date retained`);
  } else {
    check(source.publicationDate.slice(0, 10) <= researchCutoff, `${source.id} was published by the research cutoff`);
  }
}

const provinces = deriveProvinceCapacities(project, geometry);
const bounds = project.treemap.outerBoundsPx;
const outerArea = (bounds.x1 - bounds.x0) * (bounds.y1 - bounds.y0);
check(provinces.length === 31, "all 31 mainland provincial-level regions are recorded");
check(provinces.every((row) => row.x0 >= bounds.x0 && row.y0 >= bounds.y0 && row.x1 <= bounds.x1 && row.y1 <= bounds.y1), "all rectangles lie within the treemap bounds");
check(provinces.reduce((sum, row) => sum + row.areaPx2, 0) === outerArea, "provincial rectangles exactly tile the treemap area");

let overlapCount = 0;
for (let leftIndex = 0; leftIndex < geometry.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < geometry.length; rightIndex += 1) {
    const left = geometry[leftIndex];
    const right = geometry[rightIndex];
    const overlapWidth = Math.min(left.x1, right.x1) - Math.max(left.x0, right.x0);
    const overlapHeight = Math.min(left.y1, right.y1) - Math.max(left.y0, right.y0);
    if (overlapWidth > 0 && overlapHeight > 0) overlapCount += 1;
  }
}
check(overlapCount === 0, "provincial rectangles do not overlap");

const ranked = [...provinces].sort((a, b) => b.capacityMw - a.capacityMw);
check(ranked.slice(0, 10).map((row) => row.province).join("|") === project.treemap.publishedTopTenOrder.join("|"), "derived top-ten order matches the CAICT labels");
check(ranked.slice(0, 6).every((row) => row.capacityMw > 1500), "each published top-six province exceeds 1,500 MW");
check(ranked.slice(0, 6).reduce((sum, row) => sum + row.capacityMw, 0) / provinces.reduce((sum, row) => sum + row.capacityMw, 0) > 0.5, "top six provinces exceed half the national total");
check(close(provinces.reduce((sum, row) => sum + row.capacityMw, 0), 26075, 1e-6), "provincial capacity sums to 26,075 MW");

check(project.chinaCapacityCrosschecks.length === 17, "17 direct Chinese capacity observations are registered as cross-checks");
const fullProvinceCrosschecks = project.chinaCapacityCrosschecks.filter((row) => row.geographicScope === "province");
const subregionalCrosschecks = project.chinaCapacityCrosschecks.filter((row) => row.geographicScope === "subprovince");
check(fullProvinceCrosschecks.length === 12, "12 full-province observation rows are registered");
check(new Set(fullProvinceCrosschecks.map((row) => row.province)).size === 11, "full-province observations cover 11 unique provinces");
check(subregionalCrosschecks.length === 5, "five subregional observations are registered separately");
for (const record of project.chinaCapacityCrosschecks) {
  check(provinceNames.has(record.province), `${record.id} maps to a CAICT province`);
  check(record.observationDate <= cutoff, `${record.id} is at or before the observation cutoff`);
  check(record.observedStandardRacks > 0, `${record.id} has a positive rack observation`);
}
check(project.sources.find((source) => source.id === "caict_treemap_2025")?.verificationStatus === "verified_derived", "CAICT provincial values are labelled as derived rather than raw observations");
check(project.chinaCapacityCrosschecks.find((row) => row.id === "jiangsu_direct_2025_03")?.observedStandardRacks === 473000, "closest-date Jiangsu direct observation is 473,000 racks");
check(project.chinaCapacityCrosschecks.find((row) => row.id === "shanxi_direct_2025_06")?.observedStandardRacks === 514000, "Shanxi direct observation is 514,000 racks");
check(project.chinaCapacityCrosschecks.find((row) => row.id === "guangxi_direct_2024_12")?.observedStandardRacks === 164000, "Guangxi direct observation is 164,000 racks");

const hohhot = project.capacityRecords.find((record) => record.id === "hohhot_design_2023");
const hohhotDesignMw = calculateCapacity(hohhot, project.assumptions);
const occupiedFacilityMw = hohhot.formula.dataCenters * hohhot.formula.racksPerCenter * 0.609 *
  hohhot.formula.standardRackKw * 1.21 / 1000;
check(close(hohhotDesignMw, 442.5025), "Hohhot design IT capacity reconstructs to 442.5025 MW");
check(Math.abs(occupiedFacilityMw - 326) < 1, "Hohhot utilization and PUE independently reconcile the reported 326 MW facility load");

for (const price of project.priceRecords.filter((record) => record.eligibility === "included")) {
  const result = calculatePrice(price, project.assumptions);
  check(result.usdPerKwh > 0 && result.usdPerKwh < 1, `${price.id} produces a plausible positive USD/kWh value`);
}

const {scenarios} = buildModel(project, provinces);
check(scenarios.length === project.evidenceScenarios.length * project.technologyScenarios.length, "all price × technology scenario combinations are generated");
for (const scenario of scenarios) {
  check(scenario.blocks.every((block, index, blocks) => index === 0 || block.costUsdPer1e19Flops >= blocks[index - 1].costUsdPer1e19Flops), `${scenario.id} is sorted from lowest to highest cost`);
  for (const block of scenario.blocks) {
    const expected = calculateCost(block.priceUsdPerKwh, block.technologyMultiplier, project.assumptions);
    check(close(block.costUsdPer1e19Flops, expected.costUsdPer1e19Flops), `${scenario.id}/${block.id} cost arithmetic reproduces`);
    check(block.capacityMetricId === project.capacityStandard.metricId, `${scenario.id}/${block.id} uses harmonized capacity`);
    for (const sourceId of block.sourceIds) {
      const source = project.sources.find((item) => item.id === sourceId);
      check(Boolean(source), `${scenario.id}/${block.id} resolves source ${sourceId}`);
      if (source) check(["verified", "verified_derived"].includes(source.verificationStatus), `${scenario.id}/${block.id}/${sourceId} is verified for inclusion`);
    }
  }
}

const facilityRegister = buildFacilityRegister(project, provinces);
const coverage = buildCoverage(project, benchmarks, facilityRegister, scenarios);
const additiveRows = facilityRegister.filter((row) => row.coverageRole === "additive" && row.metricId === project.capacityStandard.metricId);
check(facilityRegister.length === 65, "global facility register contains 65 sourced or derived records");
check(additiveRows.length === 60, "60 non-overlapping source units contribute to registered capacity");
check(close(coverage.capacityRegister.registeredCapacityMw, 57077.4, 1e-6), "registered capacity sums to 57,077.4 MW without additive double counting");
check(coverage.capacityRegister.registeredRegionCount === 58, "registered source units aggregate to 58 country-region keys");
check(close(coverage.capacityRegister.globalCapacityCoveragePct, 57077.4 / 62000 * 100, 1e-10), "indicative global capacity coverage uses the declared 62 GW denominator");
const additiveUsRows = additiveRows.filter((row) => row.iso3 === "USA");
check(additiveUsRows.length === 10, "ten non-overlapping JLL US market records contribute to the register");
check(close(additiveUsRows.reduce((sum, row) => sum + row.capacityMw, 0), 27585, 1e-6), "US observed market capacity sums to 27,585 MW");
check(facilityRegister.filter((row) => ["dallas_cbre_2025", "virginia_cbre_2025"].includes(row.id)).every((row) => row.coverageRole === "subset_not_additive"), "overlapping CBRE US wholesale records remain auditable but non-additive");
const comparableCoverage = coverage.priceScenarios.find((row) => row.evidenceId === "comparable_proxy");
const tariffCoverage = coverage.priceScenarios.find((row) => row.evidenceId === "data_center_tariff_evidence");
check(close(comparableCoverage.priceCoveredMw, 39189.19387322451, 1e-6), "combined regional price evidence sums independently of the capacity register");
check(close(tariffCoverage.priceCoveredMw, 672.0025, 1e-6), "data-center tariff evidence coverage sums independently of the capacity register");
check(coverage.regionBreakdowns.length === 3, "regional coverage is generated for the register and both price-evidence layers");
for (const layer of coverage.regionBreakdowns) {
  check(close(layer.regions.reduce((sum, row) => sum + row.capacityMw, 0), layer.capacityMw, 1e-6), `${layer.layer} regional rows sum to the layer total`);
  check(layer.regionCount === coverage.capacityRegister.registeredRegionCount, `${layer.layer} retains all registered regions, including zero-coverage rows`);
  check(layer.regions.every((row) => close(row.coveragePct, row.capacityMw / row.registeredCapacityMw * 100, 1e-8)), `${layer.layer} regional percentages use each region's registered capacity as denominator`);
  check(layer.regions.every((row) => row.coveragePct >= 0 && row.coveragePct <= 100 + 1e-8), `${layer.layer} regional coverage stays between 0% and 100%`);
}
const capacityRegionBreakdown = coverage.regionBreakdowns.find((layer) => layer.layer === "capacity_register");
const combinedRegionBreakdown = coverage.regionBreakdowns.find((layer) => layer.layer === "comparable_proxy");
const strictRegionBreakdown = coverage.regionBreakdowns.find((layer) => layer.layer === "data_center_tariff_evidence");
check(capacityRegionBreakdown.regionCount === 58, "capacity-register breakdown contains 58 unique country-region keys");
check(capacityRegionBreakdown.coveredRegionCount === 58 && capacityRegionBreakdown.regions.every((row) => close(row.coveragePct, 100)), "capacity-register breakdown shows 100% coverage for all 58 region keys");
check(combinedRegionBreakdown.regionCount === 58 && combinedRegionBreakdown.coveredRegionCount === 27, "combined price breakdown shows all 58 regions, including 31 zero-coverage regions");
check(strictRegionBreakdown.regionCount === 58 && strictRegionBreakdown.coveredRegionCount === 2, "strict price breakdown shows all 58 regions, including 56 zero-coverage regions");
const combinedTexas = combinedRegionBreakdown.regions.find((row) => row.country === "United States" && row.region === "Texas");
check(close(combinedTexas.capacityMw, 4123, 1e-6) && close(combinedTexas.registeredCapacityMw, 4123, 1e-6) && close(combinedTexas.coveragePct, 100) && combinedTexas.recordCount === 2, "Texas regional price coverage aggregates Dallas–Fort Worth and Austin–San Antonio against the registered Texas denominator");
const strictInnerMongolia = strictRegionBreakdown.regions.find((row) => row.country === "China" && row.region === "Inner Mongolia");
check(close(strictInnerMongolia.coveragePct, strictInnerMongolia.capacityMw / strictInnerMongolia.registeredCapacityMw * 100, 1e-8) && strictInnerMongolia.coveragePct > 0 && strictInnerMongolia.coveragePct < 100, "strict Inner Mongolia coverage uses the Hohhot subset over the registered provincial capacity");
check(coverage.countryGaps[0].country === "Japan", "Japan is now the largest benchmarked country-capacity gap");
const unitedStatesGap = coverage.countryGaps.find((row) => row.country === "United States");
check(close(unitedStatesGap.missingCapacityMw, 0, 1e-6), "the prior 9,063.1 MW US benchmark gap is eliminated with observed JLL market data");
check(benchmarks.markets.length === 38, "38 global market benchmarks are registered for research prioritisation");
check(benchmarks.markets.reduce((sum, row) => sum + row.capacityMw, 0) < benchmarks.marketForecast.globalCapacityMw, "named market benchmarks are explicitly a subset of the global forecast");

const generatedPath = resolve(ROOT, "generated/chart-data.js");
check(existsSync(generatedPath), "generated chart data exists");
let chartOutputHash = null;
if (existsSync(generatedPath)) {
  const generated = readFileSync(generatedPath, "utf8");
  check(generated.includes(`Input SHA-256: ${inputHash}`), "generated chart data matches the current canonical inputs");
  const assignment = "window.COMPUTE_COST_DATA = ";
  const assignmentStart = generated.indexOf(assignment);
  if (assignmentStart >= 0) {
    const chartJson = generated.slice(assignmentStart + assignment.length).trim().replace(/;$/, "");
    chartOutputHash = sha256(chartJson);
    check(generated.includes(`Output SHA-256: ${chartOutputHash}`), "generated chart-data output hash reproduces");
    check(Boolean(JSON.parse(chartJson)), "generated chart data is valid JSON");
  } else {
    check(false, "generated chart data contains its JavaScript assignment");
  }
}

const indexPath = resolve(ROOT, "index.html");
check(existsSync(indexPath), "public page exists");
if (existsSync(indexPath)) {
  const indexHtml = readFileSync(indexPath, "utf8");
  check(
    chartOutputHash && indexHtml.includes(`generated/chart-data.js?v=${chartOutputHash.slice(0, 12)}`),
    "public page cache-buster matches the generated chart-data output"
  );
}

const requiredOutputs = [
  "generated/project-summary.json",
  "electricity-capacity-data.csv",
  "global-benchmark-capacity-data.csv",
  "global-facility-register.csv",
  "coverage-summary.csv",
  "regional-coverage-breakdown.csv",
  "country-capacity-gaps.csv",
  "technology-scenario-data.csv",
  "audit/capacity-derivation.csv",
  "audit/china-provincial-capacity-crosschecks.csv",
  "audit/source-verification.csv",
  "audit/second-agent-review.md",
  "audit/verification-report.md"
];
for (const relativePath of requiredOutputs) check(existsSync(resolve(ROOT, relativePath)), `${relativePath} exists`);

// Parse quoted CSV independently of the generator so commas and quotes cannot
// silently move review findings into the wrong columns.
function parseCsv(raw) {
  const rows = [];
  let row = [], value = "", quoted = false;
  for (let index = 0; index < raw.length; index += 1) {
    const character = raw[index];
    if (character === '"') {
      if (quoted && raw[index + 1] === '"') { value += '"'; index += 1; }
      else quoted = !quoted;
    } else if (!quoted && character === ",") {
      row.push(value); value = "";
    } else if (!quoted && character === "\n") {
      row.push(value.replace(/\r$/, "")); rows.push(row); row = []; value = "";
    } else value += character;
  }
  if (row.length || value) { row.push(value); rows.push(row); }
  if (quoted) throw new Error("Unterminated CSV field");
  const headers = rows.shift();
  return rows.map((cells) => {
    if (cells.length !== headers.length) throw new Error("CSV column mismatch");
    return Object.fromEntries(headers.map((header, index) => [header, cells[index]]));
  });
}
const reviewCsv = parseCsv(readFileSync(resolve(ROOT, "audit/source-verification.csv"), "utf8"));
check(reviewCsv.length === sourceReview.records.length, "review CSV has one row per source");
for (const row of sourceReview.records) {
  const csv = reviewCsv.find((item) => item.source_id === row.sourceId);
  check(csv?.second_agent_status === row.status, `${row.sourceId}: CSV preserves review result`);
  check(csv?.second_agent_findings === row.findings && csv?.second_agent_required_action === row.action, `${row.sourceId}: CSV preserves complete findings and action`);
  check(csv?.reviewed_source_sha256 === row.sourceSha256 && csv?.second_agent_reviewed_on === sourceReview.reviewedOn, `${row.sourceId}: CSV preserves review fingerprint and date`);
}
const generatedSummary = JSON.parse(readFileSync(resolve(ROOT, "generated/project-summary.json"), "utf8"));
check(Object.values(generatedSummary.secondAgentReview.counts).reduce((sum, count) => sum + count, 0) === project.sources.length, "generated second-review counts cover the full register");

// Execute the page script with only its real static element IDs. This catches
// dangling references after presentation sections are removed, without a browser.
const indexHtml = readFileSync(resolve(ROOT, "index.html"), "utf8");
check(/<span>Electricity-only · Capacity-weighted · exploratory<\/span>/.test(indexHtml), "top ribbon labels the project exploratory");
check(!indexHtml.includes("China versus global benchmarks"), "headline eyebrow is removed");
check(/h1\s*\{[^}]*white-space:\s*nowrap;/.test(indexHtml), "main headline stays on one line");
check(/h2\s*\{[^}]*white-space:\s*nowrap;/.test(indexHtml), "Sources and methodology heading stays on one line");
check(/\.section-head\s*\{[^}]*display:\s*block;/.test(indexHtml), "sources heading uses the full content width");
check(/\.section-head\s*\{[^}]*overflow:\s*visible;/.test(indexHtml) && !/\.section-head\s*\{[^}]*overflow(?:-x)?:\s*(?:auto|scroll);/.test(indexHtml), "sources heading has no scrolling container");
check(/\.section-head\s*\{[^}]*container-type:\s*inline-size;/.test(indexHtml) && /h2\s*\{[^}]*font-size:\s*clamp\(1rem, 5\.8cqw, 3rem\);/.test(indexHtml), "sources title scales to its available width without scrolling");
check(/\.reading-note\s*\{[^}]*white-space:\s*normal;/.test(indexHtml) && /\.reading-note\s*\{[^}]*overflow-wrap:\s*anywhere;/.test(indexHtml), "scope paragraph wraps naturally, including long words on narrow screens");
check(/\.reading-note\s*\{[^}]*max-width:\s*none;/.test(indexHtml) && !/\.reading-note\s*\{[^}]*overflow(?:-x)?:\s*(?:auto|scroll);/.test(indexHtml), "scope paragraph uses full width without a scrolling container");
check(indexHtml.includes('href="https://github.com/qrlow/compute-cost-curve/blob/main/METHODOLOGY.md">Read the full methodology and limitations</a>.'), "scope link uses the requested full methodology wording");
check(!indexHtml.includes("Country gap queue") && !indexHtml.includes('href="country-capacity-gaps.csv"'), "country gap queue is no longer promoted on the webpage");
check(existsSync(resolve(ROOT, "country-capacity-gaps.csv")), "country gap dataset remains in the repository");
check((indexHtml.match(/class="download"/g) || []).length === 4 && /\.downloads\s*\{[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\);/.test(indexHtml), "four remaining resources fill the desktop grid");
check(indexHtml.includes("--font-display:") && indexHtml.includes("--font-body:"), "editorial typography separates display and body typefaces");
check(indexHtml.includes("--text-measure: 72ch;") && /\.matrix-head \.curve-intro\s*\{[^}]*max-width:\s*var\(--text-measure\);/.test(indexHtml), "introductory paragraph has a readable line length");
check(/@supports \(grid-template-rows: subgrid\)/.test(indexHtml), "paired chart cards share aligned rows when supported");
check(!indexHtml.includes("The build derives the charts from the registered inputs."), "removed build description is absent");
check(/id="curves-title"[^>]*>The two curves<\/p>\s*<p class="curve-intro">/.test(indexHtml), "technology explanation sits directly beneath The two curves");
check(indexHtml.includes('href="https://newsletter.semianalysis.com/p/huawei-ai-cloudmatrix-384-chinas-answer-to-nvidia-gb200-nvl72">estimated</a> to require 2.5×'), "technology explanation links the electricity-efficiency estimate");
check(indexHtml.includes("data centers operational by December 31, 2025, and electricity prices effective during 2025."), "curve introduction states the capacity cutoff and price year");
const publicPriceRefs = new Set(project.evidenceScenarios.find((scenario) => scenario.id === "comparable_proxy").blocks.map((block) => block.priceRef));
check(project.priceRecords.filter((price) => publicPriceRefs.has(price.id)).every((price) => price.effectiveDate >= "2025-01-01" && price.effectiveDate <= "2025-12-31"), "all public price effective dates support the 2025 introduction");
check(indexHtml.includes("<h1>An Exploratory Global Compute Cost Curve</h1>"), "main title uses the requested project name");
check(/<\/h1>\s*<p class="hero-subtitle">How far can cheap power carry China in the AI race\?<\/p>/.test(indexHtml), "China question appears directly beneath the main title as a subtitle");
check(indexHtml.includes("<title>An Exploratory Global Compute Cost Curve</title>"), "browser title matches the main project title");
check(/<\/header>\s*<main>\s*<section aria-labelledby="curves-title">/.test(indexHtml), "cost curves appear directly after the headline section");
check(/<div class="reading-note">[^\n]*<\/div>\s*<\/section>\s*<section class="section" aria-labelledby="audit-title">/.test(indexHtml), "source evidence section follows the curves and scope note directly");
check(indexHtml.includes('<p class="kicker">Reproduce and inspect</p>'), "Reproduce and inspect section is retained");
check(!/second[- ]?agent|sourceReview|source-review|AI review|human sign-off/i.test(indexHtml), "webpage omits second-agent review text, links and display code");
check(!indexHtml.includes("Montreal tariff applicability, Chinese time-of-use bills and provincial capacity estimates still need work."), "removed limitations paragraph is absent from the webpage");
for (const removedCopy of ["Two cost curves compare technology access", "Combined price evidence × technology access", "The y-axis is fixed across both charts."]) {
  check(!indexHtml.includes(removedCopy), `page omits removed introductory copy: ${removedCopy}`);
}
const pageElements = new Map([...indexHtml.matchAll(/\bid="([^"]+)"/g)].map((match) => [match[1], {
  innerHTML: "",
  textContent: "",
  insertAdjacentHTML(position, html) {
    if (position !== "beforeend") throw new Error(`Unsupported insertion: ${position}`);
    this.innerHTML += html;
  }
}]));
for (const removedId of ["global-coverage", "coverage-summary", "coverage-title", "registered-regions", "country-gaps"]) {
  check(!pageElements.has(removedId), `public page omits retired dashboard element ${removedId}`);
}
for (const removedId of ["registered-capacity", "plotted-capacity", "observation-cutoff", "capacity-definition", "method-title", "china-crosscheck-title", "china-crosscheck-count", "china-crosscheck-provinces", "china-crosscheck-subregions", "china-capacity-crosschecks", "corrections-title"]) {
  check(!pageElements.has(removedId), `page omits removed intermediate section element ${removedId}`);
}
check(!/globalCapacityCoveragePct|registeredCapacityCoveragePct|renderRegionalBreakdown|coverageCaveat/.test(indexHtml), "public page does not render legacy coverage percentages or their denominator caveat");
check(!/href="(?:coverage-summary|regional-coverage-breakdown)\.csv"/.test(indexHtml), "coverage-percentage downloads are no longer promoted on the public page");
check(existsSync(resolve(ROOT, "METHODOLOGY.md")) && indexHtml.includes("https://github.com/qrlow/compute-cost-curve/blob/main/METHODOLOGY.md"), "public page links to the blog methodology and limitations");
check(!pageElements.has("source-register") && !pageElements.has("input-hash"), "page omits source table and footer fingerprint elements");
check(!/<(?:details|footer)\b/.test(indexHtml), "page omits expandable source table and footer");
check(!indexHtml.includes('<div class="caveat">'), "removed limitations paragraph leaves no empty caveat container");
check(existsSync(resolve(ROOT, "audit/source-verification.csv")) && indexHtml.includes('href="audit/source-verification.csv"'), "source register remains available as a download");

try {
  const context = createContext({
    window: {},
    document: {
      getElementById(id) {
        const element = pageElements.get(id);
        if (!element) throw new Error(`Page script references missing element: ${id}`);
        return element;
      }
    }
  });
  runInContext(readFileSync(resolve(ROOT, "generated/chart-data.js"), "utf8"), context, {timeout: 1000});
  const inlineScripts = [...indexHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  check(inlineScripts.length === 1, "public page has one chart rendering script");
  for (const script of inlineScripts) runInContext(script[1], context, {timeout: 1000});
  const renderedCurves = pageElements.get("scenario-matrix").innerHTML;
  check(!renderedCurves.includes('class="evidence-head"'), "introductory evidence heading above charts is removed");
  check(!renderedCurves.includes("width and cannot be added without double counting"), "introductory evidence paragraph above charts is removed");
  check((renderedCurves.match(/class="cost-curve"/g) || []).length === 2, "page script renders both public technology curves");
  const xAxisLabels = [...renderedCurves.matchAll(/<text class="axis-title x-axis-title"[^>]*>([\s\S]*?)<\/text>/g)];
  check(xAxisLabels.length === 2, "both public curves display the updated x-axis label");
  check(xAxisLabels.every((match) => match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() === "Cumulative data center capacity operational by end 2025, Design IT Capacity excluding cooling etc (MW)"), "x-axis labels preserve the user's exact wording");
  check(xAxisLabels.every((match) => (match[1].match(/<tspan\b/g) || []).length === 2), "long x-axis labels use two lines at the existing font size");
  const expectedBlocks = scenarios.filter((scenario) => scenario.evidenceId === "comparable_proxy").reduce((sum, scenario) => sum + scenario.blocks.length, 0);
  check((renderedCurves.match(/<rect class="bar /g) || []).length === expectedBlocks, "all public chart blocks survive the dashboard removal");
} catch (error) {
  check(false, `page script smoke test: ${error.message}`);
}

if (warnings.length) {
  console.warn(`WARN (${warnings.length})`);
  warnings.forEach((warning) => console.warn(`  - ${warning}`));
}
if (failures.length) {
  console.error(`FAIL (${failures.length})`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}
console.log(`PASS (${passes.length} checks)`);
console.log(`Input SHA-256: ${inputHash}`);

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
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

const {project, benchmarks, geometry, inputHash} = loadInputs();
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
  "audit/verification-report.md"
];
for (const relativePath of requiredOutputs) check(existsSync(resolve(ROOT, relativePath)), `${relativePath} exists`);

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

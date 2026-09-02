import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ROOT,
  buildModel,
  calculateCapacity,
  calculateCost,
  calculatePrice,
  deriveProvinceCapacities,
  loadInputs
} from "./lib/project.mjs";

const {project, geometry, inputHash} = loadInputs();
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

check(project.schemaVersion === "1.0.0", "canonical schema version is supported");
check(project.capacityStandard.metricId === "commissioned_design_it_power_mw", "one harmonized capacity metric is declared");
check(unique(project.sources.map((source) => source.id)), "source IDs are unique");
check(unique(project.capacityRecords.map((record) => record.id)), "capacity-record IDs are unique");
check(unique(project.priceRecords.map((record) => record.id)), "price-record IDs are unique");
check(unique(project.technologyScenarios.map((scenario) => scenario.id)), "technology-scenario IDs are unique");
check(unique(project.evidenceScenarios.map((scenario) => scenario.id)), "price-evidence scenario IDs are unique");

const sourceIds = new Set(project.sources.map((source) => source.id));
for (const record of [...project.capacityRecords, ...project.priceRecords, ...project.technologyScenarios]) {
  for (const sourceId of record.sourceIds) check(sourceIds.has(sourceId), `${record.id} references source ${sourceId}`);
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

const generatedPath = resolve(ROOT, "generated/chart-data.js");
check(existsSync(generatedPath), "generated chart data exists");
if (existsSync(generatedPath)) {
  const generated = readFileSync(generatedPath, "utf8");
  check(generated.includes(`Input SHA-256: ${inputHash}`), "generated chart data matches the current canonical inputs");
}

const requiredOutputs = [
  "generated/project-summary.json",
  "electricity-capacity-data.csv",
  "global-benchmark-capacity-data.csv",
  "technology-scenario-data.csv",
  "audit/capacity-derivation.csv",
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

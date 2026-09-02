import fs from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputDir = resolve(root, "outputs/019fdb9f-161f-7b22-9a01-b1a28036fbf3");
const previewDir = "/private/tmp/compute-cost-workbook/final-previews";
const project = JSON.parse(await fs.readFile(resolve(root, "data/project-data.json"), "utf8"));
const chartText = await fs.readFile(resolve(root, "generated/chart-data.js"), "utf8");
const chartData = JSON.parse(chartText.slice(chartText.indexOf("{")).replace(/;\s*$/, ""));
const geometry = (await fs.readFile(resolve(root, project.treemap.geometryFile), "utf8"))
  .trim().split(/\r?\n/).slice(1).map((line) => {
    const [province, abbreviation, x0, y0, x1, y1] = line.split(",");
    return {province, abbreviation, x0: Number(x0), y0: Number(y0), x1: Number(x1), y1: Number(y1)};
  });

const workbook = Workbook.create();
workbook.comments.setSelf({displayName: "User"});
const summary = workbook.worksheets.add("Audit Summary");
const inputs = workbook.worksheets.add("Policy & Inputs");
const provinces = workbook.worksheets.add("Provincial Capacity");
const named = workbook.worksheets.add("Named Capacity");
const prices = workbook.worksheets.add("Price Evidence");
const scenarios = workbook.worksheets.add("Scenario Outputs");
const sources = workbook.worksheets.add("Source Verification");

const COLORS = {
  navy: "#17344F",
  pale: "#D9E8F3",
  paper: "#F7F5EF",
  white: "#FFFFFF",
  ink: "#17211D",
  muted: "#62706A",
  green: "#DCEFE5",
  red: "#F5DDD8",
  gold: "#F3E7C4",
  line: "#CCD3D0"
};

function styleSheet(sheet) {
  sheet.showGridLines = false;
}

function title(sheet, text, subtitle, endColumn) {
  sheet.getRange(`A1:${endColumn}1`).merge();
  sheet.getRange("A1").values = [[text]];
  sheet.getRange(`A1:${endColumn}1`).format = {
    fill: COLORS.navy,
    font: {name: "Aptos Display", size: 18, bold: true, color: COLORS.white},
    rowHeight: 31,
    verticalAlignment: "center"
  };
  sheet.getRange(`A2:${endColumn}2`).merge();
  sheet.getRange("A2").values = [[subtitle]];
  sheet.getRange(`A2:${endColumn}2`).format = {
    fill: COLORS.pale,
    font: {italic: true, color: "#35516A"},
    rowHeight: 28,
    verticalAlignment: "center",
    wrapText: true
  };
}

function header(range) {
  range.format = {
    fill: COLORS.navy,
    font: {bold: true, color: COLORS.white},
    verticalAlignment: "center",
    wrapText: true,
    rowHeight: 34,
    borders: {bottom: {style: "medium", color: COLORS.navy}}
  };
}

function bodyGrid(range) {
  range.format.borders = {insideHorizontal: {style: "thin", color: COLORS.line}};
  range.format.verticalAlignment = "top";
}

for (const sheet of [summary, inputs, provinces, named, prices, scenarios, sources]) styleSheet(sheet);

// Policy & Inputs
title(inputs, "Compute cost curve — policy and canonical inputs", "Blue cells are canonical assumptions. Derived outputs elsewhere in the workbook reference these cells.", "F");
inputs.getRange("A4:B4").values = [["Control", "Value"]];
header(inputs.getRange("A4:B4"));
const inputRows = [
  ["Observation cutoff", new Date(`${project.metadata.observationCutoff}T00:00:00Z`)],
  ["Research publication cutoff", new Date(`${project.metadata.researchPublicationCutoff}T00:00:00Z`)],
  ["Input SHA-256", chartData.metadata.inputSha256],
  ["National standard racks", project.treemap.nationalStandardRacks],
  ["Standard rack kW", project.assumptions.standardRackKw],
  ["Hours per month", project.assumptions.hoursPerMonth],
  ["Tariff load factor", project.assumptions.tariffLoadFactor],
  ["Common PUE", project.assumptions.commonPue],
  ["GB200 rack power kW", project.assumptions.gb200RackPowerKw],
  ["GB200 dense-BF16 PFLOP/s", project.assumptions.gb200DenseBf16Pflops],
  ["China efficiency penalty", project.assumptions.chinaEfficiencyPenalty],
  ["CNY per USD", project.assumptions.fxCurrencyPerUsd.CNY],
  ["CAD per USD", project.assumptions.fxCurrencyPerUsd.CAD],
  ["Treemap outer x0", project.treemap.outerBoundsPx.x0],
  ["Treemap outer y0", project.treemap.outerBoundsPx.y0],
  ["Treemap outer x1", project.treemap.outerBoundsPx.x1],
  ["Treemap outer y1", project.treemap.outerBoundsPx.y1]
];
inputs.getRange(`A5:B${4 + inputRows.length}`).values = inputRows;
inputs.getRange(`B5:B${4 + inputRows.length}`).format.fill = COLORS.pale;
inputs.getRange("B5:B6").format.numberFormat = "yyyy-mm-dd";
inputs.getRange("B11").format.numberFormat = "0.0%";
inputs.getRange("B15:B17").format.numberFormat = "0.0000";
bodyGrid(inputs.getRange(`A5:B${4 + inputRows.length}`));
inputs.getRange("D4:F4").values = [["Capacity standard", "Boundary", "Coverage caveat"]];
header(inputs.getRange("D4:F4"));
inputs.getRange("D5:F5").values = [[project.capacityStandard.definition, `${project.capacityStandard.chinaBoundary} ${project.capacityStandard.globalBoundary}`, project.capacityStandard.coverageCaveat]];
inputs.getRange("D5:F5").format = {wrapText: true, rowHeight: 120, verticalAlignment: "top", fill: COLORS.paper};
inputs.getRange("A25:F25").merge();
inputs.getRange("A25").values = [["Observation dates are explicit but not identical. Advancing older values to one exact date would require unsupported estimates; the workbook retains the mismatch."]];
inputs.getRange("A25:F25").format = {fill: COLORS.gold, font: {bold: true}, wrapText: true, rowHeight: 40};
inputs.freezePanes.freezeRows(4);
inputs.getRange("A:F").format.columnWidth = 19;
inputs.getRange("A:A").format.columnWidth = 28;
inputs.getRange("B:B").format.columnWidth = 22;
inputs.getRange("D:F").format.columnWidth = 31;
workbook.comments.addThread({cell: inputs.getRange("B15")}, "China technology penalty: SemiAnalysis engineering estimate of 2.5× electricity per dense-BF16 FLOP; not a primary metered full-system result.");
workbook.comments.addThread({cell: inputs.getRange("B16")}, "Source: https://www.federalreserve.gov/releases/g5a/current/ — 2025 annual average, currency units per USD.");

// Provincial capacity
title(provinces, "Provincial capacity — reproducible treemap derivation", "Formula cells reconstruct every width from stored pixel geometry and the matched 31 March 2025 national denominator.", "M");
const provinceHeaders = ["Province", "Abbrev.", "x0", "y0", "x1", "y1", "Width px", "Height px", "Area px²", "Area share", "Standard racks", "Design IT MW", "Observation date"];
provinces.getRange("A4:M4").values = [provinceHeaders];
header(provinces.getRange("A4:M4"));
provinces.getRange(`A5:F${4 + geometry.length}`).values = geometry.map((row) => [row.province, row.abbreviation, row.x0, row.y0, row.x1, row.y1]);
provinces.getRange("G5").formulas = [["=E5-C5"]];
provinces.getRange(`G5:G${4 + geometry.length}`).fillDown();
provinces.getRange("H5").formulas = [["=F5-D5"]];
provinces.getRange(`H5:H${4 + geometry.length}`).fillDown();
provinces.getRange("I5").formulas = [["=G5*H5"]];
provinces.getRange(`I5:I${4 + geometry.length}`).fillDown();
provinces.getRange("J5").formulas = [["=I5/(('Policy & Inputs'!$B$20-'Policy & Inputs'!$B$18)*('Policy & Inputs'!$B$21-'Policy & Inputs'!$B$19))"]];
provinces.getRange(`J5:J${4 + geometry.length}`).fillDown();
provinces.getRange("K5").formulas = [["=J5*'Policy & Inputs'!$B$8"]];
provinces.getRange(`K5:K${4 + geometry.length}`).fillDown();
provinces.getRange("L5").formulas = [["=K5*'Policy & Inputs'!$B$9/1000"]];
provinces.getRange(`L5:L${4 + geometry.length}`).fillDown();
provinces.getRange(`M5:M${4 + geometry.length}`).values = geometry.map(() => [new Date(`${project.treemap.observationDate}T00:00:00Z`)]);
provinces.getRange("I36").formulas = [["=SUM(I5:I35)"]];
provinces.getRange("J36").formulas = [["=SUM(J5:J35)"]];
provinces.getRange("K36").formulas = [["=SUM(K5:K35)"]];
provinces.getRange("L36").formulas = [["=SUM(L5:L35)"]];
provinces.getRange("A36:H36").merge();
provinces.getRange("A36").values = [["TOTAL — exact tiling and national reconciliation"]];
provinces.getRange("A36:M36").format = {fill: COLORS.pale, font: {bold: true}, borders: {top: {style: "medium", color: COLORS.navy}}};
provinces.getRange("J5:J36").format.numberFormat = "0.0000%";
provinces.getRange("K5:K36").format.numberFormat = "#,##0";
provinces.getRange("L5:L36").format.numberFormat = "#,##0.0";
provinces.getRange("M5:M35").format.numberFormat = "yyyy-mm-dd";
bodyGrid(provinces.getRange("A5:M35"));
provinces.freezePanes.freezeRows(4);
provinces.freezePanes.freezeColumns(2);
provinces.getRange("A:A").format.columnWidth = 20;
provinces.getRange("B:B").format.columnWidth = 9;
provinces.getRange("C:I").format.columnWidth = 11;
provinces.getRange("J:J").format.columnWidth = 13;
provinces.getRange("K:M").format.columnWidth = 17;

// Named capacity
title(named, "Named capacity — harmonized and excluded records", "Only records matching commissioned design IT power can supply displayed chart widths.", "N");
const namedHeaders = ["ID", "Location", "Country", "Metric", "Direct MW", "Data centers", "Racks / center", "Standard racks", "Rack kW", "Computed MW", "Observation date", "Grade", "Included boundary?", "Source IDs / note"];
named.getRange("A4:N4").values = [namedHeaders];
header(named.getRange("A4:N4"));
const namedRows = project.capacityRecords.map((record) => [
  record.id, record.location, record.country, record.metricId, record.valueMw ?? null,
  record.formula?.dataCenters ?? null, record.formula?.racksPerCenter ?? null,
  record.formula?.standardRacks ?? null, record.formula?.standardRackKw ?? null, null,
  record.observationDate ? new Date(`${record.observationDate}T00:00:00Z`) : null,
  record.harmonizationGrade, record.metricId === project.capacityStandard.metricId ? "Yes" : "No",
  `${record.sourceIds.join("; ")} — ${record.note}`
]);
named.getRange(`A5:N${4 + namedRows.length}`).values = namedRows;
namedRows.forEach((_, index) => {
  const row = index + 5;
  named.getRange(`J${row}`).formulas = [[`=IF(E${row}>0,E${row},IF(H${row}>0,H${row}*IF(I${row}>0,I${row},'Policy & Inputs'!$B$9)/1000,F${row}*G${row}*IF(I${row}>0,I${row},'Policy & Inputs'!$B$9)/1000))`]];
});
named.getRange(`E5:J${4 + namedRows.length}`).format.numberFormat = "#,##0.0000";
named.getRange(`K5:K${4 + namedRows.length}`).format.numberFormat = "yyyy-mm-dd";
bodyGrid(named.getRange(`A5:N${4 + namedRows.length}`));
named.getRange(`M5:M${4 + namedRows.length}`).conditionalFormats.add("containsText", {text: "Yes", format: {fill: COLORS.green, font: {bold: true, color: "#206044"}}});
named.getRange(`M5:M${4 + namedRows.length}`).conditionalFormats.add("containsText", {text: "No", format: {fill: COLORS.red, font: {bold: true, color: "#8D352C"}}});
named.freezePanes.freezeRows(4);
named.freezePanes.freezeColumns(2);
named.getRange("A:A").format.columnWidth = 24;
named.getRange("B:B").format.columnWidth = 34;
named.getRange("C:M").format.columnWidth = 16;
named.getRange("N:N").format.columnWidth = 58;
named.getRange(`N5:N${4 + namedRows.length}`).format.wrapText = true;

// Price evidence
title(prices, "Price evidence — reported observations and constructed proxies", "The evidence class remains visible. Local all-in prices and USD conversions are workbook formulas.", "P");
const priceHeaders = ["ID", "Location", "Country", "Evidence class", "Formula type", "Currency", "Energy / direct", "Demand / kW-mo", "Credit / kW-mo", "Local all-in / kWh", "FX / USD", "USD / kWh", "Effective date", "Eligibility", "Source IDs", "Note"];
prices.getRange("A4:P4").values = [priceHeaders];
header(prices.getRange("A4:P4"));
const priceRows = project.priceRecords.map((record) => [
  record.id, record.location, record.country, record.evidenceClass, record.formula.type, record.formula.currency,
  record.formula.valuePerKwh ?? record.formula.energyPerKwh ?? null,
  record.formula.demandPerKwMonth ?? null, record.formula.demandCreditPerKwMonth ?? 0,
  null, null, null,
  record.effectiveDate ? new Date(`${record.effectiveDate}T00:00:00Z`) : null,
  record.eligibility, record.sourceIds.join("; "), record.note ?? ""
]);
prices.getRange(`A5:P${4 + priceRows.length}`).values = priceRows;
priceRows.forEach((_, index) => {
  const row = index + 5;
  prices.getRange(`J${row}`).formulas = [[`=IF(E${row}="direct",G${row},G${row}+(H${row}-I${row})/('Policy & Inputs'!$B$10*'Policy & Inputs'!$B$11))`]];
  prices.getRange(`K${row}`).formulas = [[`=IF(F${row}="CNY",'Policy & Inputs'!$B$16,IF(F${row}="CAD",'Policy & Inputs'!$B$17,1))`]];
  prices.getRange(`L${row}`).formulas = [[`=J${row}/K${row}`]];
});
prices.getRange(`G5:L${4 + priceRows.length}`).format.numberFormat = "0.00000000";
prices.getRange(`M5:M${4 + priceRows.length}`).format.numberFormat = "yyyy-mm-dd";
bodyGrid(prices.getRange(`A5:P${4 + priceRows.length}`));
prices.getRange(`N5:N${4 + priceRows.length}`).conditionalFormats.add("containsText", {text: "included", format: {fill: COLORS.green, font: {bold: true, color: "#206044"}}});
prices.getRange(`N5:N${4 + priceRows.length}`).conditionalFormats.add("beginsWith", {text: "excluded", format: {fill: COLORS.red, font: {bold: true, color: "#8D352C"}}});
prices.freezePanes.freezeRows(4);
prices.freezePanes.freezeColumns(2);
prices.getRange("A:A").format.columnWidth = 28;
prices.getRange("B:B").format.columnWidth = 26;
prices.getRange("C:O").format.columnWidth = 16;
prices.getRange("D:D").format.columnWidth = 28;
prices.getRange("P:P").format.columnWidth = 54;
prices.getRange(`P5:P${4 + priceRows.length}`).format.wrapText = true;

// Scenario outputs
title(scenarios, "Scenario outputs — the four displayed cost curves", "Rows are generated in ascending cost order. Capacity, price and cost cells link back to formula-driven audit sheets.", "S");
const scenarioHeaders = ["Scenario", "Price case", "Technology case", "Cost order", "Block", "Location", "Country", "Capacity ref", "Capacity MW", "Capacity date", "Price ref", "USD / kWh", "Evidence class", "Price date", "Technology", "Multiplier", "USD / 10¹⁹ FLOPs", "10¹⁹ FLOPs / USD", "Source IDs"];
scenarios.getRange("A4:S4").values = [scenarioHeaders];
header(scenarios.getRange("A4:S4"));
const provinceRowByName = new Map(geometry.map((row, index) => [row.province, index + 5]));
const namedRowById = new Map(project.capacityRecords.map((row, index) => [row.id, index + 5]));
const priceRowById = new Map(project.priceRecords.map((row, index) => [row.id, index + 5]));
const blockRefByScenario = new Map(project.evidenceScenarios.flatMap((evidence) => evidence.blocks.map((block) => [`${evidence.id}:${block.id}`, block])));
const outputRows = chartData.scenarios.flatMap((scenario) => scenario.blocks.map((block, index) => {
  const canonicalBlock = blockRefByScenario.get(`${scenario.evidenceId}:${block.id}`);
  return [scenario.id, scenario.evidenceTitle, scenario.technologyTitle, index + 1, block.id, block.location, block.country,
    canonicalBlock.capacityRef, null, block.capacityObservationDate, canonicalBlock.priceRef, null,
    block.priceEvidenceClass, block.priceEffectiveDate, block.technology, null, null, null, block.sourceIds.join("; ")];
}));
scenarios.getRange(`A5:S${4 + outputRows.length}`).values = outputRows;
outputRows.forEach((rowValues, index) => {
  const row = index + 5;
  const capacityRef = rowValues[7];
  const capacityFormula = capacityRef.startsWith("province:")
    ? `='Provincial Capacity'!L${provinceRowByName.get(capacityRef.slice("province:".length))}`
    : `='Named Capacity'!J${namedRowById.get(capacityRef)}`;
  scenarios.getRange(`I${row}`).formulas = [[capacityFormula]];
  scenarios.getRange(`L${row}`).formulas = [[`='Price Evidence'!L${priceRowById.get(rowValues[10])}`]];
  scenarios.getRange(`P${row}`).formulas = [[`=IF(AND(G${row}="China",C${row}="Export-control-constrained technology"),'Policy & Inputs'!$B$15,1)`]];
  scenarios.getRange(`Q${row}`).formulas = [[`=('Policy & Inputs'!$B$12*'Policy & Inputs'!$B$13*L${row})/('Policy & Inputs'!$B$14*10^15*3600)*10^19*P${row}`]];
  scenarios.getRange(`R${row}`).formulas = [[`=1/Q${row}`]];
});
scenarios.getRange(`I5:I${4 + outputRows.length}`).format.numberFormat = "#,##0.0";
scenarios.getRange(`L5:L${4 + outputRows.length}`).format.numberFormat = "$0.000000";
scenarios.getRange(`Q5:R${4 + outputRows.length}`).format.numberFormat = "0.000000";
scenarios.getRange(`J5:J${4 + outputRows.length}`).format.numberFormat = "yyyy-mm-dd";
scenarios.getRange(`N5:N${4 + outputRows.length}`).format.numberFormat = "yyyy-mm-dd";
bodyGrid(scenarios.getRange(`A5:S${4 + outputRows.length}`));
scenarios.freezePanes.freezeRows(4);
scenarios.freezePanes.freezeColumns(6);
scenarios.getRange("A:A").format.columnWidth = 40;
scenarios.getRange("B:C").format.columnWidth = 30;
scenarios.getRange("D:E").format.columnWidth = 12;
scenarios.getRange("F:F").format.columnWidth = 28;
scenarios.getRange("G:R").format.columnWidth = 17;
scenarios.getRange("S:S").format.columnWidth = 65;

// Source verification
title(sources, "Source verification — complete source-by-source register", "Reproduction checks are complete. Independent human review remains pending and is not implied by automated validation.", "M");
const sourceHeaders = ["ID", "Publisher", "Title", "Tier", "Publication date", "Claim", "Exact locator", "Verification status", "Verification method", "Verified on", "Human review", "URL", "Used in display?"];
sources.getRange("A4:M4").values = [sourceHeaders];
header(sources.getRange("A4:M4"));
const displayedSourceIds = new Set(chartData.scenarios.flatMap((scenario) => scenario.blocks.flatMap((block) => block.sourceIds)));
const sourceRows = project.sources.map((source) => [
  source.id, source.publisher, source.title, source.tier,
  source.publicationDate ? new Date(`${source.publicationDate.length === 4 ? source.publicationDate + "-12-31" : source.publicationDate.length === 7 ? source.publicationDate + "-01" : source.publicationDate}T00:00:00Z`) : null,
  source.claim, source.locator, source.verificationStatus, source.verificationMethod,
  new Date(`${source.verifiedOn}T00:00:00Z`), source.independentHumanReview, source.url,
  displayedSourceIds.has(source.id) ? "Yes" : "No"
]);
sources.getRange(`A5:M${4 + sourceRows.length}`).values = sourceRows;
sources.getRange(`E5:E${4 + sourceRows.length}`).format.numberFormat = "yyyy-mm-dd";
sources.getRange(`J5:J${4 + sourceRows.length}`).format.numberFormat = "yyyy-mm-dd";
bodyGrid(sources.getRange(`A5:M${4 + sourceRows.length}`));
sources.getRange(`H5:H${4 + sourceRows.length}`).conditionalFormats.add("containsText", {text: "verified", format: {fill: COLORS.green, font: {bold: true, color: "#206044"}}});
sources.getRange(`H5:H${4 + sourceRows.length}`).conditionalFormats.add("containsText", {text: "partial", format: {fill: COLORS.gold, font: {bold: true}}});
sources.getRange(`H5:H${4 + sourceRows.length}`).conditionalFormats.add("containsText", {text: "not_verified", format: {fill: COLORS.red, font: {bold: true, color: "#8D352C"}}});
sources.getRange(`M5:M${4 + sourceRows.length}`).conditionalFormats.add("containsText", {text: "Yes", format: {fill: COLORS.green, font: {bold: true, color: "#206044"}}});
sources.freezePanes.freezeRows(4);
sources.freezePanes.freezeColumns(2);
sources.getRange("A:A").format.columnWidth = 30;
sources.getRange("B:B").format.columnWidth = 30;
sources.getRange("C:C").format.columnWidth = 42;
sources.getRange("D:E").format.columnWidth = 18;
sources.getRange("F:G").format.columnWidth = 48;
sources.getRange("H:H").format.columnWidth = 18;
sources.getRange("I:I").format.columnWidth = 52;
sources.getRange("J:K").format.columnWidth = 17;
sources.getRange("L:L").format.columnWidth = 65;
sources.getRange("M:M").format.columnWidth = 16;
sources.getRange(`C5:M${4 + sourceRows.length}`).format.wrapText = true;

// Audit summary
title(summary, "Compute cost curve — audit summary", "Formula-driven controls for capacity boundaries, treemap geometry, source status and scenario outputs.", "H");
summary.getRange("A4:C4").values = [["Control", "Result", "Status"]];
header(summary.getRange("A4:C4"));
const auditRows = [
  ["Provincial records", "=COUNTA('Provincial Capacity'!A5:A35)", "=IF(B5=31,\"PASS\",\"FAIL\")"],
  ["Treemap area share", "=SUM('Provincial Capacity'!J5:J35)", "=IF(ABS(B6-1)<0.0000001,\"PASS\",\"FAIL\")"],
  ["National design IT MW", "=SUM('Provincial Capacity'!L5:L35)", "=IF(ABS(B7-26075)<0.01,\"PASS\",\"FAIL\")"],
  ["Hohhot design IT MW", "='Named Capacity'!J5", "=IF(ABS(B8-442.5025)<0.0001,\"PASS\",\"FAIL\")"],
  ["Hohhot occupied facility MW cross-check", "='Named Capacity'!F5*'Named Capacity'!G5*60.9%*'Named Capacity'!I5*1.21/1000", "=IF(ABS(B9-326)<1,\"PASS\",\"FAIL\")"],
  ["Generated scenario rows", `=COUNTA('Scenario Outputs'!A5:A${4 + outputRows.length})`, `=IF(B10=${outputRows.length},\"PASS\",\"FAIL\")`],
  ["Displayed sources verified", `=COUNTIFS('Source Verification'!M5:M${4 + sourceRows.length},\"Yes\",'Source Verification'!H5:H${4 + sourceRows.length},\"verified\")+COUNTIFS('Source Verification'!M5:M${4 + sourceRows.length},\"Yes\",'Source Verification'!H5:H${4 + sourceRows.length},\"verified_derived\")`, `=IF(B11=COUNTIF('Source Verification'!M5:M${4 + sourceRows.length},\"Yes\"),\"PASS\",\"FAIL\")`],
  ["Independent human review", `=COUNTIF('Source Verification'!K5:K${4 + sourceRows.length},\"complete\")`, "=IF(B12=0,\"PENDING\",\"REVIEWED\")"]
];
summary.getRange("A5:A12").values = auditRows.map((row) => [row[0]]);
summary.getRange("B5:B12").formulas = auditRows.map((row) => [row[1]]);
summary.getRange("C5:C12").formulas = auditRows.map((row) => [row[2]]);
summary.getRange("B6").format.numberFormat = "0.000000%";
summary.getRange("B7:B9").format.numberFormat = "#,##0.0000";
bodyGrid(summary.getRange("A5:C12"));
summary.getRange("C5:C12").conditionalFormats.add("containsText", {text: "PASS", format: {fill: COLORS.green, font: {bold: true, color: "#206044"}}});
summary.getRange("C5:C12").conditionalFormats.add("containsText", {text: "FAIL", format: {fill: COLORS.red, font: {bold: true, color: "#8D352C"}}});
summary.getRange("C5:C12").conditionalFormats.add("containsText", {text: "PENDING", format: {fill: COLORS.gold, font: {bold: true}}});
summary.getRange("E4:H4").values = [["Scenario", "Blocks", "Total MW", "Cost span (USD / 10¹⁹ FLOPs)"]];
header(summary.getRange("E4:H4"));
summary.getRange("E5:H8").values = chartData.scenarios.map((scenario) => [scenario.id, scenario.blocks.length, scenario.totalCapacityMw, `${scenario.blocks[0].costUsdPer1e19Flops.toFixed(3)} – ${scenario.blocks.at(-1).costUsdPer1e19Flops.toFixed(3)}`]);
summary.getRange("G5:G8").format.numberFormat = "#,##0.0";
bodyGrid(summary.getRange("E5:H8"));
summary.getRange("E11:H11").merge();
summary.getRange("E11").values = [["Material corrections"]];
header(summary.getRange("E11:H11"));
summary.getRange("E12:H14").values = [
  ["Matched date", "CAICT March treemap scaled to the 10.43m-rack March denominator.", null, null],
  ["Capacity boundary", "Hohhot corrected from 269.4 MW occupied IT load to 442.5 MW commissioned design IT power.", null, null],
  ["Price evidence", "Unsupported Guangdong weighting removed; reported observations and tariff proxies separated.", null, null]
];
summary.getRange("F12:H12").merge();
summary.getRange("F13:H13").merge();
summary.getRange("F14:H14").merge();
summary.getRange("E12:H14").format = {fill: COLORS.paper, wrapText: true, rowHeight: 36, verticalAlignment: "center", borders: {insideHorizontal: {style: "thin", color: COLORS.line}}};
summary.getRange("E12:E14").format.font = {bold: true};
summary.getRange("A16:H16").merge();
summary.getRange("A16").values = [["Automated reproduction is complete; independent second-human review is pending. See Source Verification for exact locators and per-source methods."]];
summary.getRange("A16:H16").format = {fill: COLORS.gold, font: {bold: true}, wrapText: true, rowHeight: 38};
summary.freezePanes.freezeRows(4);
summary.getRange("A:A").format.columnWidth = 39;
summary.getRange("B:B").format.columnWidth = 20;
summary.getRange("C:C").format.columnWidth = 14;
summary.getRange("D:D").format.columnWidth = 4;
summary.getRange("E:E").format.columnWidth = 46;
summary.getRange("F:G").format.columnWidth = 16;
summary.getRange("H:H").format.columnWidth = 26;

await fs.mkdir(outputDir, {recursive: true});
await fs.mkdir(previewDir, {recursive: true});

const checks = [
  ["Audit Summary", "A1:H16"],
  ["Policy & Inputs", "A1:F25"],
  ["Provincial Capacity", "A1:M36"],
  ["Named Capacity", `A1:N${4 + namedRows.length}`],
  ["Price Evidence", `A1:P${4 + priceRows.length}`],
  ["Scenario Outputs", `A1:S${4 + outputRows.length}`],
  ["Source Verification", `A1:M${4 + sourceRows.length}`]
];
for (const [sheetName, range] of checks) {
  const preview = await workbook.render({sheetName, range, scale: 1, format: "png"});
  await fs.writeFile(resolve(previewDir, `${sheetName.replaceAll(" ", "-")}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const auditInspect = await workbook.inspect({kind: "table", range: "Audit Summary!A1:H16", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 10, maxChars: 12000});
console.log(auditInspect.ndjson);
const errors = await workbook.inspect({kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: {useRegex: true, maxResults: 300}, summary: "final formula error scan"});
console.log(errors.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
const outputPath = resolve(outputDir, "capacity-source-register.xlsx");
await output.save(outputPath);
await fs.rm(`${outputPath}.inspect.ndjson`, {force: true});
console.log(`Saved ${outputPath}`);

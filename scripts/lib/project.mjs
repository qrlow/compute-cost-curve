import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url)));

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function loadInputs() {
  const projectPath = resolve(ROOT, "data/project-data.json");
  const projectRaw = readFileSync(projectPath, "utf8");
  const project = JSON.parse(projectRaw);
  const benchmarkPath = resolve(ROOT, "data/global-market-benchmarks.json");
  const benchmarkRaw = readFileSync(benchmarkPath, "utf8");
  const benchmarks = JSON.parse(benchmarkRaw);
  const geometryPath = resolve(ROOT, project.treemap.geometryFile);
  const geometryRaw = readFileSync(geometryPath, "utf8");
  const geometry = parseSimpleCsv(geometryRaw).map((row) => ({
    province: row.province,
    abbreviation: row.abbreviation,
    x0: Number(row.x0_px),
    y0: Number(row.y0_px),
    x1: Number(row.x1_px),
    y1: Number(row.y1_px)
  }));

  return {
    project,
    projectRaw,
    benchmarks,
    benchmarkRaw,
    geometryRaw,
    geometry,
    inputHash: sha256(`${projectRaw}\n${benchmarkRaw}\n${geometryRaw}`)
  };
}

export function parseSimpleCsv(raw) {
  const lines = raw.trim().split(/\r?\n/);
  const headers = lines.shift().split(",");
  return lines.map((line) => Object.fromEntries(
    line.split(",").map((value, index) => [headers[index], value])
  ));
}

export function deriveProvinceCapacities(project, geometry) {
  const bounds = project.treemap.outerBoundsPx;
  const outerArea = (bounds.x1 - bounds.x0) * (bounds.y1 - bounds.y0);
  return geometry.map((rectangle) => {
    const widthPx = rectangle.x1 - rectangle.x0;
    const heightPx = rectangle.y1 - rectangle.y0;
    const areaPx2 = widthPx * heightPx;
    const areaShare = areaPx2 / outerArea;
    const standardRacks = areaShare * project.treemap.nationalStandardRacks;
    const capacityMw = standardRacks * project.assumptions.standardRackKw / 1000;
    return {
      id: `province:${rectangle.province}`,
      ...rectangle,
      location: rectangle.province,
      region: rectangle.province,
      regionType: "province",
      country: "China",
      iso3: "CHN",
      recordType: "regional_aggregate",
      coverageRole: "additive",
      status: "operational",
      widthPx,
      heightPx,
      areaPx2,
      areaShare,
      standardRacks,
      capacityMw,
      observationDate: project.treemap.observationDate,
      metricId: project.capacityStandard.metricId,
      sourceIds: [project.treemap.sourceId, project.treemap.nationalTotalSourceId, "nda_standard_rack"]
    };
  });
}

export function calculateCapacity(record, assumptions) {
  if (record.valueMw != null) return record.valueMw;
  const formula = record.formula;
  if (formula.type !== "rack_count") throw new Error(`Unsupported capacity formula: ${formula.type}`);
  const racks = formula.standardRacks ?? formula.dataCenters * formula.racksPerCenter;
  return racks * (formula.standardRackKw ?? assumptions.standardRackKw) / 1000;
}

export function calculatePrice(record, assumptions) {
  const formula = record.formula;
  let localCurrencyPerKwh;
  if (formula.type === "direct") {
    localCurrencyPerKwh = formula.valuePerKwh;
  } else if (formula.type === "energy_plus_demand") {
    localCurrencyPerKwh = formula.energyPerKwh + formula.demandPerKwMonth /
      (assumptions.hoursPerMonth * assumptions.tariffLoadFactor);
  } else if (formula.type === "energy_plus_net_demand") {
    localCurrencyPerKwh = formula.energyPerKwh +
      (formula.demandPerKwMonth - formula.demandCreditPerKwMonth) /
      (assumptions.hoursPerMonth * assumptions.tariffLoadFactor);
  } else {
    throw new Error(`Unsupported price formula: ${formula.type}`);
  }
  const fxCurrencyPerUsd = assumptions.fxCurrencyPerUsd[formula.currency];
  if (!fxCurrencyPerUsd) throw new Error(`Missing FX rate for ${formula.currency}`);
  return {
    localCurrencyPerKwh,
    currency: formula.currency,
    fxCurrencyPerUsd,
    usdPerKwh: localCurrencyPerKwh / fxCurrencyPerUsd
  };
}

export function calculateCost(usdPerKwh, multiplier, assumptions) {
  const facilityPowerKw = assumptions.gb200RackPowerKw * assumptions.commonPue;
  const denseFlopsPerSecond = assumptions.gb200DenseBf16Pflops * 1e15;
  const costUsdPer1e19Flops = facilityPowerKw * usdPerKwh /
    (denseFlopsPerSecond * 3600) * 1e19 * multiplier;
  return {
    costUsdPer1e19Flops,
    denseBf16FlopsPerUsdE19: 1 / costUsdPer1e19Flops
  };
}

export function buildModel(project, provinceCapacities) {
  const sourceById = new Map(project.sources.map((source) => [source.id, source]));
  const capacityById = new Map(project.capacityRecords.map((record) => [record.id, record]));
  const priceById = new Map(project.priceRecords.map((record) => [record.id, record]));
  const provinceByName = new Map(provinceCapacities.map((record) => [record.province, record]));

  function resolveCapacity(reference) {
    if (reference.startsWith("province:")) {
      const province = reference.slice("province:".length);
      const record = provinceByName.get(province);
      if (!record) throw new Error(`Unknown province capacity reference: ${reference}`);
      return {
        id: reference,
        location: record.location,
        region: record.region,
        regionType: record.regionType,
        country: record.country,
        iso3: record.iso3,
        recordType: record.recordType,
        coverageRole: record.coverageRole,
        status: record.status,
        valueMw: record.capacityMw,
        metricId: record.metricId,
        observationDate: record.observationDate,
        harmonizationGrade: "A-derived",
        sourceIds: record.sourceIds,
        note: "Derived from the reproducible CAICT treemap geometry."
      };
    }
    const record = capacityById.get(reference);
    if (!record) throw new Error(`Unknown capacity reference: ${reference}`);
    return {...record, valueMw: calculateCapacity(record, project.assumptions)};
  }

  const scenarios = [];
  for (const evidence of project.evidenceScenarios) {
    for (const technology of project.technologyScenarios) {
      const blocks = evidence.blocks.map((block) => {
        const capacity = resolveCapacity(block.capacityRef);
        const price = priceById.get(block.priceRef);
        if (!price) throw new Error(`Unknown price reference: ${block.priceRef}`);
        const priceResult = calculatePrice(price, project.assumptions);
        const technologyMultiplier = block.country === "China"
          ? technology.chinaEfficiencyMultiplier
          : technology.globalEfficiencyMultiplier;
        const cost = calculateCost(priceResult.usdPerKwh, technologyMultiplier, project.assumptions);
        const sourceIds = [...new Set([
          ...capacity.sourceIds,
          ...price.sourceIds,
          ...technology.sourceIds,
          "federal_reserve_fx_2025"
        ])];
        return {
          ...block,
          capacityMw: capacity.valueMw,
          capacityRegion: capacity.region,
          capacityRegionType: capacity.regionType,
          capacityRecordType: capacity.recordType,
          capacityCoverageRole: capacity.coverageRole,
          capacityMetricId: capacity.metricId,
          capacityObservationDate: capacity.observationDate,
          capacityHarmonizationGrade: capacity.harmonizationGrade,
          capacityNote: capacity.note,
          priceEffectiveDate: price.effectiveDate,
          priceEvidenceClass: price.evidenceClass,
          priceFormula: price.formula,
          priceLocalPerKwh: priceResult.localCurrencyPerKwh,
          priceCurrency: priceResult.currency,
          priceUsdPerKwh: priceResult.usdPerKwh,
          technologyMultiplier,
          technology: block.country === "China" ? technology.chinaTechnology : technology.globalTechnology,
          costUsdPer1e19Flops: cost.costUsdPer1e19Flops,
          denseBf16FlopsPerUsdE19: cost.denseBf16FlopsPerUsdE19,
          sourceIds,
          sources: sourceIds.map((sourceId) => sourceById.get(sourceId)).filter(Boolean)
        };
      }).sort((a, b) => a.costUsdPer1e19Flops - b.costUsdPer1e19Flops || a.location.localeCompare(b.location));
      scenarios.push({
        id: `${evidence.id}__${technology.id}`,
        evidenceId: evidence.id,
        evidenceTitle: evidence.title,
        evidenceSubtitle: evidence.subtitle,
        evidenceNote: evidence.note,
        technologyId: technology.id,
        technologyTitle: technology.title,
        chinaTechnology: technology.chinaTechnology,
        globalTechnology: technology.globalTechnology,
        blocks,
        totalCapacityMw: blocks.reduce((sum, block) => sum + block.capacityMw, 0)
      });
    }
  }

  return {scenarios, sourceById, resolveCapacity, priceById};
}

export function buildFacilityRegister(project, provinceCapacities) {
  const derivedProvinceRows = provinceCapacities.map((record) => ({
    id: record.id,
    location: record.location,
    region: record.region,
    regionType: record.regionType,
    country: record.country,
    iso3: record.iso3,
    recordType: record.recordType,
    coverageRole: record.coverageRole,
    status: record.status,
    metricId: record.metricId,
    capacityMw: record.capacityMw,
    observationDate: record.observationDate,
    datePrecision: "day",
    harmonizationGrade: "A-derived",
    sourceIds: record.sourceIds,
    note: "Derived provincial aggregate from the reproducible CAICT treemap geometry."
  }));
  const sourcedRows = project.capacityRecords.map((record) => ({
    ...record,
    capacityMw: calculateCapacity(record, project.assumptions)
  }));
  return [...derivedProvinceRows, ...sourcedRows];
}

function groupCapacityByCountry(rows) {
  const totals = new Map();
  for (const row of rows) totals.set(row.country, (totals.get(row.country) || 0) + row.capacityMw);
  return totals;
}

export function buildCoverage(project, benchmarks, facilityRegister, scenarios) {
  const additiveRows = facilityRegister.filter((row) =>
    row.coverageRole === "additive" && row.metricId === project.capacityStandard.metricId
  );
  const registeredCapacityMw = additiveRows.reduce((sum, row) => sum + row.capacityMw, 0);
  const globalBenchmarkMw = benchmarks.globalBenchmark.capacityMw;
  const registeredRegionCount = new Set(additiveRows.map((row) => `${row.country}|${row.region}`)).size;
  const registeredCountryCapacity = groupCapacityByCountry(additiveRows);

  const priceScenarios = project.evidenceScenarios.map((evidence) => {
    const scenario = scenarios.find((candidate) =>
      candidate.evidenceId === evidence.id && candidate.technologyId === "same_technology"
    );
    const priceCoveredMw = scenario.totalCapacityMw;
    return {
      evidenceId: evidence.id,
      label: evidence.title,
      regionsWithPrice: scenario.blocks.length,
      priceCoveredMw,
      priceMissingMw: Math.max(0, registeredCapacityMw - priceCoveredMw),
      registeredCapacityCoveragePct: priceCoveredMw / registeredCapacityMw * 100,
      globalCapacityCoveragePct: priceCoveredMw / globalBenchmarkMw * 100
    };
  });

  const marketCountryTotals = new Map();
  const isoByCountry = new Map();
  for (const market of benchmarks.markets) {
    marketCountryTotals.set(market.country, (marketCountryTotals.get(market.country) || 0) + market.capacityMw);
    isoByCountry.set(market.country, market.iso3);
  }
  const overrideByCountry = new Map(benchmarks.countryOverrides.map((record) => [record.country, record]));
  for (const record of benchmarks.countryOverrides) isoByCountry.set(record.country, record.iso3);
  for (const row of additiveRows) isoByCountry.set(row.country, row.iso3);

  const countries = new Set([
    ...marketCountryTotals.keys(),
    ...overrideByCountry.keys(),
    ...registeredCountryCapacity.keys()
  ]);
  const countryGaps = [...countries].map((country) => {
    const override = overrideByCountry.get(country);
    const marketSubtotalMw = marketCountryTotals.get(country) || 0;
    const benchmarkCapacityMw = override?.capacityMw ?? marketSubtotalMw;
    const registeredMw = registeredCountryCapacity.get(country) || 0;
    const benchmarkScope = override?.benchmarkScope ?? "named_market_forecast_minimum";
    return {
      country,
      iso3: isoByCountry.get(country) || "",
      benchmarkCapacityMw,
      registeredCapacityMw: registeredMw,
      missingCapacityMw: Math.max(0, benchmarkCapacityMw - registeredMw),
      benchmarkScope,
      observationDate: override?.observationDate ?? benchmarks.marketForecast.observationDate,
      benchmarkStatus: override ? "observed_or_retrospective" : benchmarks.marketForecast.status,
      sourceIds: override?.sourceIds ?? benchmarks.marketForecast.sourceIds,
      note: override?.note ?? "Minimum formed by summing the named markets in Knight Frank's 2025 forecast map; the true country gap may be larger."
    };
  }).sort((a, b) => b.missingCapacityMw - a.missingCapacityMw || a.country.localeCompare(b.country));

  return {
    globalBenchmark: benchmarks.globalBenchmark,
    marketForecast: benchmarks.marketForecast,
    capacityRegister: {
      registeredCapacityMw,
      registeredRegionCount,
      registeredCountryCount: registeredCountryCapacity.size,
      globalCapacityCoveragePct: registeredCapacityMw / globalBenchmarkMw * 100,
      compatibility: benchmarks.globalBenchmark.compatibility
    },
    priceScenarios,
    countryGaps
  };
}

export function csvCell(value) {
  if (value == null) return "";
  const string = typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\n]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}

export function toCsv(headers, rows) {
  return `${headers.join(",")}\n${rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")).join("\n")}\n`;
}

export function round(value, digits = 6) {
  return Number(value.toFixed(digits));
}

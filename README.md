# AI compute electricity cost curves

This project is an auditable, static cost-curve visualization for AI-compute electricity. It compares capacity-weighted electricity costs in China with selected North American benchmark markets under equal-technology and export-constrained technology assumptions.

[View the published curves](https://qrlow.github.io/compute-cost-curve/)

## How to read the curves

- **Width:** commissioned design IT power in MW.
- **Height:** electricity cost in USD per 10¹⁹ dense-BF16 FLOPs.
- **Order:** every curve runs from the lowest cost on the left to the highest on the right.
- **Inverse metric:** the downloadable data also report 10¹⁹ dense-BF16 FLOPs per electricity dollar.

The page shows four curves because it keeps two questions separate:

1. **Price evidence:** reported price observations versus constructed public-tariff proxies.
2. **Technology access:** NVIDIA GB200 NVL72 everywhere versus Huawei CloudMatrix384 in China and GB200 elsewhere.

Widths are comparable between the two technology curves in the same price-evidence row. Do not compare the total width of the reported-price row with the public-proxy row: the reported row omits locations without a qualifying reported price.

## Capacity standard

The canonical metric is **commissioned design IT power**: the non-redundant IT or critical-load power that commissioned data-center space is designed to support, excluding cooling and other facility overhead.

- China’s provincial widths are derived from all 31 rectangles in CAICT’s rack-distribution treemap. Pixel geometry is scaled to 10.43 million standard racks at 31 March 2025 and converted at 2.5 kW per standard rack. The rectangles exactly tile the treemap and sum to 26,075 MW.
- Hohhot / Helinger’s documented subset is 442.5025 MW: 11 centers × 16,091 standard racks × 2.5 kW. The source’s 326 MW figure reconciles as occupied facility load after utilization and PUE, so it is not used as design capacity.
- Montreal, Dallas–Fort Worth and Northern Virginia use CBRE H2 2025 commissioned wholesale inventory, treated as critical IT power delivered to the PDU.

The power definition is harmonized, but the coverage universe is not. China covers commissioned computing centers captured by CAICT; CBRE covers selected wholesale colocation markets.

## Evidence and dates

The observation cutoff is **31 December 2025**. Inputs use the latest qualifying observation available on or before that date, but they are not an exact same-day census. The page shows the capacity and price date for every block rather than silently advancing older data.

The research-publication cutoff is **24 August 2026**. It is a provenance freeze only; it does not change any observation date.

The project distinguishes:

- reported delivered or regional-average prices;
- constructed public-tariff bills at a common 90% load factor; and
- excluded targets, post-cutoff records, undated records, boundary mismatches and unverified claims.

## Reproduce the project

Requires Node.js 22 or later. No package installation is required.

```sh
npm run build
```

That one command:

1. reads [`data/project-data.json`](data/project-data.json) and [`data/caict-treemap-geometry.csv`](data/caict-treemap-geometry.csv);
2. derives capacities, tariff bills, technology adjustments and cost ordering;
3. regenerates the chart dataset, CSVs and audit outputs; and
4. runs geometry, definition, date, reference, source-status and arithmetic checks.

The main audit outputs are:

- [`audit/capacity-derivation.csv`](audit/capacity-derivation.csv): every rectangle, area share, rack estimate and MW result;
- [`audit/source-verification.csv`](audit/source-verification.csv): every source, exact locator, verification method and status;
- [`audit/verification-report.md`](audit/verification-report.md): material corrections and included-source audit;
- [`electricity-capacity-data.csv`](electricity-capacity-data.csv): all four generated scenario datasets.

Source-by-source reproduction is complete. The register intentionally records **independent human review as pending**; automated reconstruction is not represented as a second auditor’s sign-off.

## Scope

This is an electricity-only operating comparison. It excludes hardware acquisition, construction, financing, networking, labor, water, maintenance, utilization and model quality. The 2.5× China technology adjustment is a third-party engineering estimate of electricity per dense-BF16 FLOP, not a metered CloudMatrix384 full-system benchmark.

Detailed methodological decisions are in [`RESEARCH_NOTES.md`](RESEARCH_NOTES.md).

# AI compute electricity cost curves

This project is an auditable, static cost-curve visualization for AI-compute electricity. Capacity is registered independently of electricity-price availability, then joined to two price-evidence scenarios under equal-technology and export-constrained technology assumptions.

[View the published curves](https://qrlow.github.io/compute-cost-curve/)

## How to read the curves

- **Width:** commissioned design IT power in MW.
- **Height:** electricity cost in USD per 10¹⁹ dense-BF16 FLOPs.
- **Order:** every curve runs from the lowest cost on the left to the highest on the right.
- **Inverse metric:** the downloadable data also report 10¹⁹ dense-BF16 FLOPs per electricity dollar.

The page shows four curves because it keeps two questions separate:

1. **Price evidence:** comparable public-price proxies versus data-center tariff evidence.
2. **Technology access:** NVIDIA GB200 NVL72 everywhere versus Huawei CloudMatrix384 in China and GB200 elsewhere.

The additive capacity register currently contains **34,599.3 MW across 51 country-region keys**, equal to an indicative **55.8%** of Knight Frank’s 62 GW global 2025 headline. The comparable proxy covers 64.2% of registered capacity; data-center tariff evidence covers 1.9%. These percentages are generated rather than hand-maintained.

## Capacity standard

The canonical metric is **commissioned design IT power**: the non-redundant IT or critical-load power that commissioned data-center space is designed to support, excluding cooling and other facility overhead.

- China’s provincial widths are derived from all 31 rectangles in CAICT’s rack-distribution treemap. Pixel geometry is scaled to 10.43 million standard racks at 31 March 2025 and converted at 2.5 kW per standard rack. The rectangles exactly tile the treemap and sum to 26,075 MW.
- Hohhot / Helinger’s documented subset is 442.5025 MW: 11 centers × 16,091 standard racks × 2.5 kW. The source’s 326 MW figure reconciles as occupied facility load after utilization and PUE, so it is not used as design capacity.
- Quebec, Texas and Virginia currently use CBRE market subtotals as transparent regional lower bounds.
- Great Britain contributes 11 official ITL1 regional estimates totaling 1,566 MW.
- India contributes seven end-2025 live-IT market observations totaling 1,621.9 MW.

Every capacity row declares whether it is additive, a non-additive subset or excluded. Market subtotals are never silently relabelled as complete state or provincial totals.

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

1. reads [`data/project-data.json`](data/project-data.json), [`data/global-market-benchmarks.json`](data/global-market-benchmarks.json) and [`data/caict-treemap-geometry.csv`](data/caict-treemap-geometry.csv);
2. derives capacities, tariff bills, technology adjustments and cost ordering;
3. regenerates the chart dataset, CSVs and audit outputs; and
4. runs geometry, definition, date, reference, source-status and arithmetic checks.

The main audit outputs are:

- [`audit/capacity-derivation.csv`](audit/capacity-derivation.csv): every rectangle, area share, rack estimate and MW result;
- [`global-facility-register.csv`](global-facility-register.csv): all sourced or derived facility, campus, market and regional records with additive roles;
- [`coverage-summary.csv`](coverage-summary.csv): capacity coverage separated from the two price-evidence layers;
- [`country-capacity-gaps.csv`](country-capacity-gaps.csv): the ranked country research queue, with benchmark scope and status;
- [`audit/source-verification.csv`](audit/source-verification.csv): every source, exact locator, verification method and status;
- [`audit/verification-report.md`](audit/verification-report.md): material corrections and included-source audit;
- [`electricity-capacity-data.csv`](electricity-capacity-data.csv): all four generated scenario datasets.

Source-by-source reproduction is complete. The register intentionally records **independent human review as pending**; automated reconstruction is not represented as a second auditor’s sign-off.

## Scope

This is an electricity-only operating comparison. It excludes hardware acquisition, construction, financing, networking, labor, water, maintenance, utilization and model quality. The 2.5× China technology adjustment is a third-party engineering estimate of electricity per dense-BF16 FLOP, not a metered CloudMatrix384 full-system benchmark.

Detailed methodological decisions are in [`RESEARCH_NOTES.md`](RESEARCH_NOTES.md).

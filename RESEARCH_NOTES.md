# Research and audit notes

## Research question

The project asks how much China’s electricity-price advantage can lower the operating electricity cost of raw AI compute, and whether that advantage survives a technology-access penalty. It does not estimate the full cost of training or inference and does not claim that peak dense-BF16 FLOPs equal useful model output.

## Four separate scenarios

Two price-evidence cases are crossed with two technology cases.

### Price evidence

**Reported price observations** contain only:

- Hohhot / Helinger’s reported delivered green-power transaction price of about CNY 0.35/kWh;
- Texas’s EIA 2025 industrial average of USD 0.0655/kWh; and
- Virginia’s EIA 2025 industrial average of USD 0.0945/kWh.

Montreal is omitted from this case because the project found a public tariff, not a reported data-center transaction price.

**Public-grid-price proxies** contain constructed high-voltage tariff bills for eight China provinces and Montreal. Texas and Virginia retain EIA industrial averages because comparable public large-load bills have not yet been constructed. This mixture is stated on the chart and recorded per row.

The tariff convention is:

```text
local-currency price per kWh
  = published energy charge
    + net maximum-demand charge / (730 hours × 90% load factor)

USD per kWh
  = local-currency price per kWh / 2025 annual-average currency per USD
```

CNY uses 7.1875 per USD and CAD uses 1.3973 per USD, both from the Federal Reserve’s 2025 annual averages.

### Technology access

**Same technology everywhere** assigns every block an NVIDIA GB200 NVL72 rack with:

- 180 dense-BF16 PFLOP/s;
- approximately 120 kW full-load rack power; and
- PUE 1.20.

**Export-control-constrained technology** retains GB200 outside China and multiplies China’s electricity cost per fixed quantity of compute by 2.5. SemiAnalysis estimates CloudMatrix384 at 4.1× GB200 system power and 2.5× worse electricity per dense-BF16 FLOP. The latter is the relevant multiplier because the Huawei system also has higher quoted total compute. This remains an engineering model, not a primary metered full-system measurement.

```text
USD per 10¹⁹ dense-BF16 FLOPs
  = facility kW × USD/kWh
    / (dense FLOPs/second × 3,600 seconds)
    × 10¹⁹
    × technology-efficiency multiplier
```

## Harmonized capacity definition

The chart’s only included width metric is `commissioned_design_it_power_mw`:

> Non-redundant IT or critical-load power that commissioned data-center space is designed to support, excluding cooling and other facility overhead.

China and the North American benchmarks are harmonized to this power boundary, but their market coverage differs. The China denominator covers all commissioned computing centers captured by CAICT. CBRE covers existing or commissioned wholesale colocation inventory in selected markets.

Powered-on racks, occupied load, total facility power and public claims with an unclear IT-versus-facility boundary are excluded from displayed widths.

## Reproducible provincial-capacity derivation

CAICT Figure 6 publishes a 31-region treemap rather than numerical provincial values. The derivation is now fully recorded:

1. The source PDF and rendered page are identified by SHA-256 in the canonical dataset.
2. [`data/caict-treemap-geometry.csv`](data/caict-treemap-geometry.csv) stores `x0`, `y0`, `x1` and `y1` for every rectangle.
3. All 31 rectangles lie within the recorded outer bounds, have no positive-area overlaps and exactly tile the full area.
4. Each area share is multiplied by 10.43 million standard racks at 31 March 2025.
5. Standard racks are converted at the official 2.5 kW definition.

```text
provincial commissioned design IT MW
  = rectangle area / full treemap area
    × 10,430,000 standard racks
    × 2.5 kW / 1,000
```

The result sums exactly to 26,075 MW before display rounding. The derived top-ten order matches CAICT’s published order, every top-six estimate exceeds 1,500 MW, and the top six exceed half of the national total.

The earlier method captured only approximately 99.93% of the image and could not be independently reconstructed. The current geometry is the auditable replacement, not a claim that the source itself published numerical provincial MW values.

## Observation-date treatment

The observation cutoff is 31 December 2025. The project does not describe the inputs as an exact same-day census:

- China’s provincial treemap and national denominator are 31 March 2025.
- Hohhot / Helinger’s design-capacity inputs are reported for 2023.
- CBRE benchmark inventories are H2 2025.
- Electricity-price effective dates are stored separately from capacity dates.

Moving these values to an identical date would require an unsupported growth estimate. The site therefore displays both dates for every block and exposes the mismatch as a limitation.

The research-publication cutoff is 24 August 2026. A publication may appear after the observation it reports, provided it was available by this research cutoff. This is why, for example, CBRE’s March 2026 release can support H2 2025 inventory.

## Hohhot boundary correction

The source reports for a documented Hohhot / Helinger subset:

- 11 data centers;
- 16,091 standard racks per center;
- 60.9% utilization;
- 107,793 in-use racks;
- PUE 1.21; and
- 326 MW campus power.

Commissioned design IT capacity is:

```text
11 × 16,091 × 2.5 kW / 1,000 = 442.5025 MW
```

The 326 MW figure is an occupied facility-load cross-check:

```text
11 × 16,091 × 60.9% × 2.5 kW × 1.21 / 1,000 ≈ 326 MW
```

Dividing 326 MW by PUE produced 269.4 MW, but that represented occupied IT load rather than commissioned design IT capacity. It is no longer used as the chart width.

## Guangdong price correction

The previous project applied a weighted Guangdong price using an unsupported 169 MW regional mix. No source established that weighting. The current public-proxy scenario applies the Pearl River Delta 35–110 kV two-part tariff uniformly to Guangdong’s derived capacity and labels it as a conservative provincial proxy:

```text
CNY 0.66996875/kWh + CNY 31/kW-month / (730 × 90%)
  = CNY 0.71715292/kWh
```

This is not a claimed hyperscaler contract or a capacity-weighted Guangdong average.

## Montreal price treatment

Montreal uses Hydro-Québec Rate LG, not the cheaper industrial Rate L. The regulator filing establishes that large named data-center operators use LG; the calculation uses the 2025 Rate LG components and a high-voltage demand credit:

```text
CAD 0.04165/kWh
  + (CAD 15.963 − CAD 3.0063) / (730 × 90%)
  = CAD 0.061371/kWh
  = USD 0.043921/kWh
```

This makes Montreal the cheapest block in the public-proxy same-technology scenario. That result is conditional on the stated 90% load factor, voltage credit and regulated tariff. It is not presented in the reported-price scenario.

## Source verification standard

Each source record contains:

- publisher, title, URL and publication date;
- the exact claim used;
- a page, table, article or paragraph locator;
- verification status and method;
- verification date; and
- a separate human-review field.

All sources used by a displayed block must be `verified` or `verified_derived`. Partial, unverified, post-cutoff, undated and boundary-mismatched records remain in the ledger but cannot enter a displayed scenario.

The build independently reconstructs every displayed number from canonical inputs. This is source-by-source reproduction, not an independent second-human audit; every record currently retains `independentHumanReview: pending`.

## Automated pipeline

`npm run build` executes the entire data-to-chart process:

1. read canonical JSON and treemap geometry;
2. hash both inputs;
3. derive provincial capacity, named capacity formulas and tariff bills;
4. generate every price-evidence × technology scenario;
5. sort every curve from lowest to highest cost;
6. write the browser dataset, data extracts and audit registers; and
7. run definition, date, geometry, reference, source-status and arithmetic checks.

Every generated row carries the input SHA-256. The page reads only [`generated/chart-data.js`](generated/chart-data.js); it contains no separately maintained hard-coded chart values.

## Exclusions and remaining limitations

- Gui’an’s powered-on racks do not match commissioned design capacity, and its CNY 0.35/kWh value is a policy target.
- Shanxi’s available tariff record is post-cutoff.
- Shanghai’s linked source does not establish the claimed value.
- Saudi capacity does not establish the IT-versus-facility power boundary, and the tariff source has no effective date.
- Provincial treemap widths are image-derived estimates, even though the derivation is now exact and reproducible from the recorded geometry.
- The public-proxy scenario does not model direct-market contracts, taxes, hourly time-of-use schedules, subsidies or facility-specific voltage and load factor.
- The curves exclude hardware acquisition, construction, finance, networking, labor, water, maintenance, utilization and model quality.

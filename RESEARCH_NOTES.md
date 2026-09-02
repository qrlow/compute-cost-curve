# China electricity-only compute curves: evidence notes

## What the chart measures

The project compares the electricity cost of a fixed amount of raw dense-BF16
compute under two technology scenarios. Both curves use the same electricity-
price and capacity observations, the same PUE of 1.20, and the same vertical
unit: US dollars per 10¹⁹ peak dense-BF16 FLOPs.

The first curve uses an NVIDIA GB200 NVL72 rack everywhere:

- 180 dense-BF16 PFLOP/s;
- approximately 120 kW at full rack power; and
- a common PUE of 1.20.

```text
electricity USD per 10^19 dense-BF16 FLOPs
  = (120 kW x 1.20 x electricity USD/kWh)
    / (180e15 FLOP/s x 3,600 seconds) x 10^19
```

Electricity price alone determines block height and ordering in the first
curve. Lower-cost blocks appear on the left and the staircase rises toward
higher-cost blocks on the right. The result is not a measurement of useful
model output.

## Export-control-constrained technology scenario

The second curve assigns Huawei CloudMatrix384 to every included China block
and retains GB200 NVL72 for Montreal, Dallas–Fort Worth, and Northern Virginia.
It is a domestic-frontier counterfactual, not an inventory of installed
accelerators.

The technology inputs are:

- NVIDIA lists GB200 NVL72 at 360 sparse FP16/BF16 PFLOP/s and states that the
  dense figure is half, giving 180 dense-BF16 PFLOP/s. NVIDIA documents an
  approximately 120 kW full-load rack budget including rack components.
- Huawei says CloudMatrix384/Atlas 900 A3 connects 384 Ascend 910C chips and
  delivers up to 300 PFLOP/s.
- SemiAnalysis estimates CloudMatrix384 uses 4.1 times the total system power
  of GB200 NVL72 and has 2.5 times worse power per dense-BF16 FLOP. This is a
  third-party engineering model. No primary full-system metered load-power
  result for CloudMatrix384 was found.

The often-repeated claim that CloudMatrix384 uses about 3.9 times more power
depends on the selected system boundary and an earlier approximately 559 kW
estimate. The source used for the chart currently reports **4.1 times total
system power**. Total power is not the correct multiplier for a FLOPs-per-dollar
curve because CloudMatrix384 also has 1.67 times the peak dense-BF16 compute.
The relevant chart adjustment is therefore **2.5 times more electricity per
dense-BF16 FLOP**:

```text
constrained China electricity cost per fixed compute
  = same-location GB200 electricity cost per fixed compute x 2.5

2.5 approximately equals
  4.1 x total system power / (300 / 180 dense-BF16 compute)
```

As of **2 September 2026**, BIS permits H200, MI325X, and similar products to
approved China customers only through case-by-case licensing. The current EAR
provides case-by-case review only below stated performance and memory-bandwidth
thresholds and a presumption of denial for other covered applications to China.
The scenario therefore does not treat GB200 NVL72 as generally available to
PRC end users. This is a modeling boundary, not legal advice. Approved H200
imports, special licenses, legacy inventory, illicit access, and the actual
regional accelerator mix are not modeled.

Each curve is independently sorted from the lowest electricity cost per peak
dense-BF16 FLOP on the left to the highest on the right. Technology inputs and
source boundaries are recorded in
[`technology-scenario-data.csv`](technology-scenario-data.csv).

## Observation-date policy

The headline reference date is **31 December 2025**. Each plotted block uses
the latest capacity observation and electricity-price period ending on or
before that date. Exact source dates are displayed alongside the values so the
age of each input remains visible. This is not described as an exact same-day
census because the public series have different reporting schedules.

Month-, half-year-, and year-only observations are normalized to the relevant
period end and labelled with their precision. Targets, post-2025 values, prices
with no effective date, and unsupported price-source matches remain in the
ledger but are excluded from the headline curve.

The **24 August 2026 research publication cutoff is only a provenance note**.
It records when the research was frozen; it does not determine the observation
vintage or whether a value is plotted. The full dated record is in
[`capacity-source-register.xlsx`](outputs/019fdb9f-161f-7b22-9a01-b1a28036fbf3/capacity-source-register.xlsx).

## National and provincial capacity boundary

China reported 10.43 million in-use standard racks at the end of March 2025.
The national data standard converts physical racks at different densities to a
2.5 kW standard rack. CAICT defines an in-use standard rack as design rack
capacity in a commissioned computing center.

The resulting national design IT denominator is:

```text
10.43 million standard racks x 2.5 kW = 26.075 GW
```

This is commissioned design IT capacity, not measured load, occupied-rack
capacity, or GPU power.

CAICT's 2025 Comprehensive Computing Power Index publishes the provincial
distribution as a treemap without numerical provincial values. The provincial
widths in the chart were reconstructed from rectangle areas and rescaled to the
official 10.43-million-rack total. Areas cover 99.93% of the plotted treemap.
Values are rounded and must be described as estimates.

The top-ten provincial estimates sum to 18.203 GW, or 69.8% of the national
denominator. CAICT independently confirms the top-ten order, that each top-six
province exceeds 600,000 standard racks, and that the top six together exceed
50% of the national total.

## Hub-capacity splits

Two low-cost hub price records can be matched to capacity without assigning a
hub price to an entire province:

- Hohhot / Helinger: 269.4 MW for a documented 11-center subset. The figure is
  derived from 326 MW facility power divided by reported PUE 1.21.
- Gui'an: 137,400 powered-on standard racks, converted to 343.5 MW. This block
  is kept in the ledger but excluded from the headline because the CNY
  0.35/kWh input is a policy target rather than an observed price.

These blocks are deducted from their respective provincial estimates. The
remainder of Inner Mongolia and Guizhou uses the relevant grid-tariff proxy.

## Electricity-price boundary

Reported prices and tariff-derived estimates are not treated as the same type
of evidence.

### Reported prices

- Hohhot / Helinger: CNY 0.35/kWh reported delivered green-power transaction
  price.
- Gui'an: CNY 0.35/kWh 2025 policy-backed data-center price target.

### Tariff proxies

Where a current facility contract is not public, the chart calculates:

```text
tariff proxy
  = published non-time-of-use high-voltage energy charge
    + maximum-demand charge / (730 hours x 90% load factor)
```

The proxy represents a large, steady high-voltage grid customer. It is not a
claimed hyperscaler power-purchase agreement. Direct-market purchases,
time-of-use schedules, voltage, taxes, subsidies, and load factor can change an
actual bill. A future edition should replace the monthly snapshots with a full
12-month hourly tariff calculation and a direct-market price scenario.

### Montreal tariff correction

Montreal uses Hydro-Québec's **Rate LG**, not Rate L. Rate L is principally for
industrial activity; Rate LG applies to non-industrial annual contracts with a
minimum billing demand of 5 MW. Hydro-Québec's 2026 rate filing confirms that
the data centers covered in its 2025 customer table were billed on Rates M and
LG. The large Montreal block therefore uses Rate LG.

The 2025 Rate LG components effective 1 April 2025 are CAD 15.963/kW-month plus
CAD 0.04165/kWh. A customer supplied at 120 kV receives the CAD
3.0063/kW-month credit for the 80–170 kV band. Applying the same 90% load-factor
convention as the Chinese tariff proxies gives:

```text
Montreal Rate LG proxy
  = CAD 0.04165/kWh
    + (CAD 15.963 - CAD 3.0063) / (730 hours x 90%)
  = CAD 0.0613711/kWh
  = USD 0.0439211/kWh at CAD 1.3973 per USD
```

This remains a transparent regulated-tariff proxy, not a disclosed contract
price for any particular Montreal data center. It leaves Montreal slightly
cheaper than the reported Hohhot / Helinger price in the same-technology curve,
rather than giving Montreal the much larger advantage implied by industrial
Rate L.

Shanxi's available tariff observation is April 2026 because a machine-readable
2025 table was not obtained. It is therefore excluded from the headline curve.

## Comparison boundary

After applying the observation rule, each proportional-width curve covers
20.2909 GW. Included China observations contribute 14.9545 GW. Included global
observations contribute 5.3364 GW: Montreal 229.5 MW, Dallas-Fort Worth 1,067.3
MW, and Northern Virginia 4,039.6 MW. Saudi Arabia remains in the ledger but is
excluded because the tariff page does not state an effective date. Shanghai is
also excluded because the linked document does not establish the claimed June
2025 tariff proxy. The chart retains the measurement caveat: Montreal, Dallas,
and Northern Virginia are wholesale-market inventory, while China is
commissioned design IT capacity. The combined curve is a comparison of sourced
observations, not a complete or boundary-harmonized global census.

## Currency conversion

CNY values use the US Federal Reserve's 2025 annual average of CNY 7.1875 per US
dollar. Montreal uses the same release's 2025 annual average of CAD 1.3973 per
US dollar. The other benchmark values retain their documented source-specific
conversions.

Texas and Virginia now use EIA Electric Power Monthly table 5.6.B preliminary
calendar-2025 industrial averages: 6.55 and 9.45 cents/kWh respectively. This
replaces the earlier 2024 annual values so the US price observation matches the
2025 reference year.

## Main sources

- [CAICT Comprehensive Computing Power Index 2025](https://13115299.s21i.faiusr.com/61/1/ABUIABA9GAAg4pOYywYogpflxgc.pdf)
- [National standard-rack definition](https://www.nda.gov.cn/sjj/ywpd/szkjyjcss/0608/ff808081-96b465bf-0197-4f0dae39-0700.pdf)
- [Official 10.43-million-rack national total](https://english.scio.gov.cn/m/pressroom/node_8021725_2.html)
- [Hohhot capacity derivation](https://pdf.dfcfw.com/pdf/H3_AP202503031643671670_1.pdf)
- [Hohhot reported data-center price](https://www.nea.gov.cn/20250718/410e42d872e4417687cb5b0ab357d088/c.html)
- [Gui'an powered-on capacity](https://www.guiyang.gov.cn/zwgk/zwgkzdlyxxgkjyta/zwgkzdlyxxgkjytazxtawfws/zwgkzdlyxxgkjytazxtawfwsqs/202506/t20250603_87956837.html)
- [Gui'an 2025 price target](https://nyj.guizhou.gov.cn/zwgk/xxgkml/zdlyxx/czzj/202503/P020250307503578350701.pdf)
- [Federal Reserve exchange rates](https://www.federalreserve.gov/releases/g5a/current/default.htm)
- [Hydro-Québec electricity rates effective 1 April 2025](https://www.hydroquebec.com/data/documents-donnees/pdf/electricity-rates.pdf?v=HT-2025-v3)
- [Hydro-Québec filing identifying 2025 data-center customers on Rates M and LG](https://www.regie-energie.qc.ca/fr/participants/dossiers/R-4333-2026/doc/R-4333-2026-B-0004-Dem-Piece-2026_02_19.pdf)
- [NVIDIA GB200 NVL72 specifications](https://www.nvidia.com/en-us/data-center/gb200-nvl72/)
- [NVIDIA GB200 NVL72 rack-power estimate](https://docs.nvidia.com/mission-control/docs/systems-administration-guide/2.1.0/prs/faq.html)
- [Huawei CloudMatrix384 performance and deployment](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)
- [SemiAnalysis CloudMatrix384 system-power estimate](https://newsletter.semianalysis.com/p/huawei-ai-cloudmatrix-384-chinas-answer-to-nvidia-gb200-nvl72)
- [BIS January 2026 China licensing policy](https://media.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china)
- [Current EAR §742.6](https://www.bis.gov/regulations/ear/742)
- [CBRE H2 2025 North American market inventory](https://www.cbre.com/press-releases/northern-virginia-extends-lead-as-largest-u-s-data-center-market-in-2025)
- [Saudi Press Agency 2025 operational capacity](https://www.spa.gov.sa/ar/w2575816)

Every tariff source and calculation is recorded per row in
[`electricity-capacity-data.csv`](electricity-capacity-data.csv).
Global benchmark rows are recorded in
[`global-benchmark-capacity-data.csv`](global-benchmark-capacity-data.csv).

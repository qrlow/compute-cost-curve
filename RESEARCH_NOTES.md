# China electricity-only compute curve: evidence notes

## What the chart measures

The chart asks how much raw dense-BF16 compute one electricity dollar would buy
if every location used the same hardware and facility efficiency. The reference
system is an NVIDIA GB200 NVL72 rack:

- 180 dense-BF16 PFLOP/s;
- approximately 120 kW at full rack power; and
- a common PUE of 1.20.

```text
raw FLOPs per electricity dollar
  = 180e15 FLOP/s x 3,600 seconds
    / (120 kW x 1.20 x electricity USD/kWh)
```

Electricity price alone determines vertical ordering. The result is not a
measurement of useful model output.

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

Shanxi's available tariff observation is April 2026 because a machine-readable
2025 table was not obtained. It is therefore excluded from the headline curve.

## Comparison boundary

After applying the observation rule, the proportional-width curve covers
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
dollar. The benchmark values retain the earlier source-specific conversions.

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
- [NVIDIA GB200 NVL72 specifications](https://www.nvidia.com/en-us/data-center/gb200-nvl72/)
- [NVIDIA GB200 NVL72 rack-power estimate](https://docs.nvidia.com/mission-control/docs/systems-administration-guide/2.1.0/prs/faq.html)
- [CBRE H2 2025 North American market inventory](https://www.cbre.com/press-releases/northern-virginia-extends-lead-as-largest-u-s-data-center-market-in-2025)
- [Saudi Press Agency 2025 operational capacity](https://www.spa.gov.sa/ar/w2575816)

Every tariff source and calculation is recorded per row in
[`electricity-capacity-data.csv`](electricity-capacity-data.csv).
Global benchmark rows are recorded in
[`global-benchmark-capacity-data.csv`](global-benchmark-capacity-data.csv).

# Electricity-only compute curve: evidence notes

## What the chart measures

The chart is a counterfactual. It asks how much raw dense-BF16 compute one
electricity dollar would buy if every location filled its documented operating
IT capacity with the same hardware and ran the same workload.

The reference system is an NVIDIA GB200 NVL72 rack:

- 180 dense-BF16 PFLOP/s;
- approximately 120 kW at full rack power; and
- a common PUE of 1.20 in every location.

The calculation is:

```text
raw FLOPs per electricity dollar
  = 180e15 FLOP/s x 3,600 seconds
    / (120 kW x 1.20 x electricity USD/kWh)
```

Because hardware and PUE are fixed globally, electricity price alone determines
the vertical ordering. The absolute result is a hardware-based translation of
the price, not a claim about useful model output.

## Capacity boundary

Every width is backed by a published operating-capacity observation. They are
not all complete regional totals:

- CBRE's North American figures are wholesale data-center market inventory.
- Saudi Arabia is a national operational-capacity figure reported by the Saudi
  Press Agency.
- Zhongwei is one operating China Mobile campus.
- Hohhot is a documented 11-facility subset of the larger hub. Its 269.4 MW IT
  load is derived from 326 MW of reported facility power divided by a reported
  PUE of 1.21.

The blocks therefore show the capacity covered by the matched public evidence,
not total national data-center or AI capacity. The chart must not be used to
compare the total size of the US and Chinese data-center sectors.

## Electricity-price boundary

- The China observations are reported data-center or hub electricity costs.
- Hydro-Quebec Rate L is an effective large-load price at 120 kV and 100% load
  factor.
- Saudi Arabia's value is the regulated cloud-computing tariff.
- US values are EIA state industrial averages. They are not disclosed
  hyperscale contracts and may omit differences caused by demand charges,
  riders, tax treatment or negotiated procurement.

This is the most important remaining comparability limitation. The page labels
the price boundary rather than presenting the values as identical contracts.

## Currency conversion

- CNY and CAD use the US Federal Reserve's 2025 annual averages: CNY 7.1875 and
  CAD 1.3973 per US dollar.
- SAR uses the official fixed rate of SAR 3.75 per US dollar.

## Why some places are excluded

- Gui'an has a well-sourced electricity price, but no directly comparable public
  operating IT-MW figure was found.
- Beijing and Shanghai have published operational market-size estimates, but a
  single delivered data-center electricity price could not be established
  without selecting voltage, time-of-use and demand-charge assumptions.
- Quebec and Saudi Arabia are included because both a usable large-load tariff
  and an operating-capacity observation are public.
- Planned projects are excluded. Only operating capacity appears in the curve.

## Primary and research sources

- [China National Energy Administration: Hohhot price](https://www.nea.gov.cn/20250718/410e42d872e4417687cb5b0ab357d088/c.html)
- [NEA Northwest Bureau: Zhongwei operating IT load and price](https://xbj.nea.gov.cn/dtyw/hyxx/202606/t20260626_303639.html)
- [CBRE: H2 2025 North American market inventory](https://www.cbre.com/press-releases/northern-virginia-extends-lead-as-largest-u-s-data-center-market-in-2025)
- [US EIA: 2024 industrial electricity prices](https://www.eia.gov/electricity/annual/table.php?t=epa_02_10.html)
- [Hydro-Quebec: 2025 Rate L](https://www.hydroquebec.com/data/documents-donnees/pdf/rates-chart-2025.pdf)
- [Saudi regulator: cloud-computing electricity tariff](https://sera.gov.sa/en/consumer/electric-tariff/electric-tariff-categories/consumption-tariff)
- [Saudi Press Agency: 2025 operational capacity](https://www.spa.gov.sa/ar/w2575816)
- [Federal Reserve: 2025 exchange rates](https://www.federalreserve.gov/releases/g5a/current/default.htm)
- [Saudi Central Bank: fixed exchange rate](https://sama.gov.sa/en-US/Currency/FinExc/Pages/Currency.aspx)
- [NVIDIA: GB200 NVL72 specifications](https://www.nvidia.com/en-us/data-center/gb200-nvl72/)
- [NVIDIA: GB200 NVL72 rack-power estimate](https://docs.nvidia.com/mission-control/docs/systems-administration-guide/2.1.0/prs/faq.html)
- [Hohhot capacity derivation source](https://pdf.dfcfw.com/pdf/H3_AP202503031643671670_1.pdf)

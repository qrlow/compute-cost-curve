# Methodology

The project compares the electricity cost of a fixed amount of AI compute across selected regions. It asks how much cheap electricity can help, first with the same technology everywhere, then with a less electricity-efficient technology assumption for China.

The main steps were: 1) collating data-center capacities, 2) collating electricity prices, and 3) converting electricity prices into compute costs using explicit technology assumptions.

## 1) Collating data-center capacities

The target measure is **commissioned design IT power**: the non-redundant power capacity available to computing equipment in commissioned data-center space, excluding cooling and other facility overhead. It measures what the infrastructure is designed to support, rather than current electricity consumption or the number of GPUs installed.

Capacity must have been operational by **31 December 2025**. Planned projects, unfinished phases and capacity with an unresolved IT-versus-facility-power boundary are excluded from the plotted widths.

The [global facility register](https://qrlow.github.io/compute-cost-curve/global-facility-register.csv) records capacities, source references, observation dates and definitions. It contains regional, market and campus aggregates as well as facility records: public sources often disclose only these larger totals. Overlapping observations are marked as non-additive so that a campus is not counted again within its regional total. A named market is not assumed to represent its entire state or country.

China's provincial capacities are estimates derived from the rectangle areas in CAICT's 2025 provincial rack-distribution treemap. The areas are scaled to the matching national total of 10.43 million standard racks at 31 March 2025, then converted at 2.5 kW per standard rack:

```text
Provincial capacity (MW)
  = provincial rectangle area / total treemap area
    × 10,430,000 standard racks × 2.5 kW / 1,000
```

This derivation can be reproduced from the recorded geometry, but it is not a published table of provincial MW. It assumes rectangle areas are proportional to rack counts. [Direct provincial observations](https://qrlow.github.io/compute-cost-curve/audit/china-provincial-capacity-crosschecks.csv) are retained as cross-checks; the near-date Jiangsu observation conflicts with the treemap estimate and remains unresolved. Reproducing the calculation does not settle that discrepancy. This was the best estimation workaround at this time given the data limitations.

The other inputs include US leased and hyperscaler-owned market capacity, a Montreal market subtotal, Great Britain's regional colocation estimates and Indian live-IT market estimates. These sources cover different parts of their local markets, even where the power units can be aligned.

**The cutoff is an eligibility rule, not a same-day census.** US and Indian market observations are year-end 2025; China's provincial distribution is from March 2025; Great Britain's regional capacity estimate is from autumn 2024. Older observations are carried forward without inventing growth to December. Each plotted block shows its capacity and price dates. Supporting publications use a research-publication cutoff of **24 August 2026**; that date does not change when the underlying capacity or price was observed.

## 2) Collating electricity prices

Public data on the electricity bills actually paid by data centers are sparse. The curves therefore combine public large-load tariff calculations with official industrial or non-domestic averages:

- Selected Chinese provincial or utility-area industrial tariffs, including energy and demand charges;
- EIA calendar-2025 industrial averages for US states;
- Hydro-Québec Rate LG as a tariff scenario for Montreal;
- UK 2025 provisional non-domestic average, applied to Great Britain's regional capacities.

These are transparent proxies, not equally comparable observations of data-center contracts. Their evidence classes remain identified on each block and in the [source register](https://qrlow.github.io/compute-cost-curve/audit/source-verification.csv).

For demand-based tariffs, the monthly demand charge is spread over electricity consumption using a **90% load factor** and **730 hours per month**:

```text
Effective price in local currency per kWh
  = energy charge per kWh
    + net demand charge per kW-month / (730 × 0.90)

USD per kWh
  = local-currency price per kWh / local-currency units per USD
```

The net demand charge deducts any credit assumed in the selected tariff scenario. Load factor here describes average electrical demand relative to billed maximum demand; it does not assume GPUs achieve 90% of peak compute performance. Foreign prices use [Federal Reserve 2025 annual-average exchange rates](https://www.federalreserve.gov/releases/g5a/current/).

Several Chinese inputs use one month's base energy rate plus a demand charge, without fully weighting the applicable time-of-use schedule. Utility service areas also do not always match provincial boundaries. Montreal's calculation assumes Rate LG and a high-voltage credit, but eligibility across the plotted inventory in 2025 has not been established. State and national averages reflect a wider customer mix. Contracts, subsidies, taxes, voltage, demand patterns and seasonal rates can all change a facility's actual bill. The resulting rankings are conditional on these price assumptions.

## 3) Converting electricity prices into compute costs

The standardized-technology curve assumes GB200 NVL72 everywhere, using:

- **180 PFLOP/s of peak dense-BF16 performance.** NVIDIA lists 360 PFLOP/s with sparsity and states that dense performance is half that figure. [NVIDIA specifications](https://www.nvidia.com/en-us/data-center/gb200-nvl72/).
- **Approximately 120 kW of rack power**, including nodes and rack components, from NVIDIA's full-load engineering example. This is not a metered workload benchmark. [NVIDIA power guidance](https://docs.nvidia.com/mission-control/docs/systems-administration-guide/2.1.0/prs/faq.html).
- **PUE of 1.20**, a common assumption rather than a measured regional value. PUE is total facility power divided by IT power, so this adds 20% for cooling and other facility overhead.

BF16 is a 16-bit floating-point number format used in AI computation. Dense performance avoids crediting the extra throughput associated with supported sparse calculations. FLOPs count arithmetic operations; FLOP/s measures how many can be performed per second.

```text
Facility power (kW) = IT rack power (kW) × PUE

Electricity cost (USD per 10¹⁹ FLOPs)
  = facility power (kW) × electricity price (USD/kWh)
    × 10¹⁹ / [compute performance (FLOP/s) × 3,600]
    × technology multiplier
```

The factor of **3,600** converts seconds into hours. With the standardized assumptions, 10¹⁹ operations require about 2.22 kWh. At $0.10/kWh, their modeled electricity cost is approximately **$0.22**.

The export-constrained curve applies a **2.5× multiplier to China's electricity cost per FLOP**, leaving the other regions unchanged. This represents CloudMatrix384 in China versus GB200 elsewhere, based on [SemiAnalysis's April 2025 engineering estimate](https://newsletter.semianalysis.com/p/huawei-ai-cloudmatrix-384-chinas-answer-to-nvidia-gb200-nvl72). Its approximately 4.1× whole-system power comparison is not the cost multiplier: CloudMatrix384 also has higher quoted total compute performance.

The 2.5× adjustment is an engineering sensitivity scenario, not a controlled, metered comparison or an inventory of hardware actually installed in 2025. PUE stays at 1.20 in both curves. Neither curve models the real mix of chips, availability of enough accelerators, or workload-specific software efficiency.

## Reading the curves and their limitations

Each block's width represents the included regional or market IT capacity in MW; its height represents electricity cost per 10¹⁹ dense-BF16 FLOPs. Blocks are sorted independently in each curve, from lowest cost on the left to highest on the right. Width remains electrical capacity in both scenarios, not equal compute throughput: less efficient hardware produces fewer FLOPs from the same MW.

**The curves are an incomplete, uneven sample of global capacity.** A region can appear in the capacity register without appearing on the chart if a usable price is missing. Regions with more accessible public data are more likely to be represented, and this selection can affect the apparent China-versus-world comparison. No global coverage percentage is claimed because a global denominator matching the regional figures' definitions and dates has not been established. Removing that percentage does not make the underlying sample complete or representative.

**Existing IT capacity is not necessarily AI-ready capacity.** Older facilities may need additional cooling, electrical distribution and rack-density upgrades to support the assumed systems. The curves do not establish that all recorded MW could run GB200 or CloudMatrix384 without further investment.

**This is an electricity-only scenario, not the full cost of AI.** Cooling electricity is included through PUE, and the rack-power assumption includes rack components. Peak FLOPs do not measure useful tokens, training quality or actual application throughput. Other costs such as hardware acquisition, construction, financing, labor, maintenance, separate networking and water costs, downtime and utilization economics are not accounted for. 

The chart values and audit exports are generated from the registered inputs by one automated build. A [second-agent source review](https://github.com/qrlow/compute-cost-curve/blob/main/audit/second-agent-review.md) records qualifications, discrepancies and unsuccessful verification attempts. Passing the automated checks establishes reproducibility, not that every input is accurate.

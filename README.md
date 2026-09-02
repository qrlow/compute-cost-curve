# China + global benchmark electricity-only AI compute cost curve

This project is a static, source-backed visualization of how much raw AI
compute one electricity dollar would buy across China's largest data-center
provinces and four global benchmark locations if every location used the same
hardware, workload, and facility efficiency.

[View the published curve](https://qrlow.github.io/compute-cost-curve/)

## Observation standard

The headline curve has one reference date: **31 December 2025**. Each displayed
block uses the latest capacity observation and electricity-price period ending
on or before that date. The evidence ledger shows source timing and, where a
source reports only a month, half-year, or year, the normalized period end.
Targets, post-2025 values, prices with no effective date, and unsupported
price-source matches are excluded from the plotted curve.

This is a reference-date convention rather than a claim that every public
dataset was measured on the same day. The research publication cutoff—**24
August 2026**—is retained only as a provenance note; it does not determine the
data vintage.

The dated audit is in
[`capacity-source-register.xlsx`](outputs/019fdb9f-161f-7b22-9a01-b1a28036fbf3/capacity-source-register.xlsx).
It records the observation or effective date, publication date, date precision,
source boundary, and observation eligibility for every current chart input and the direct
provincial capacity cross-checks found so far. Unknown publication dates remain
explicitly blank rather than being inferred from an undated webpage.

The height of each block is dense-BF16 FLOPs per electricity dollar. Its width
is the capacity covered by that observation. After applying the observation
rule, the plotted curve covers 20.2909 GW: 14.9545 GW across the Chinese sample
and 5.3364 GW across Montreal, Dallas-Fort Worth, and Northern Virginia. China's March 2025 national
denominator is 10.43 million in-use standard racks, or 26.075 GW at the official
2.5 kW standard-rack conversion.

Provincial widths are estimates derived from the rectangle areas in CAICT's
2025 provincial rack-distribution treemap and rescaled to the official national
total. Reported Hohhot and Gui'an data-center prices are applied only to matched
capacity. Other blocks use clearly labelled high-voltage tariff proxies rather
than claiming undisclosed hyperscaler contract prices.

The calculation uses an NVIDIA GB200 NVL72 rack at 180 dense-BF16 PFLOP/s,
approximately 120 kW, and a common PUE of 1.20. Construction, financing,
hardware purchases, labor, utilization, and model quality are excluded.

The underlying China observations are in
[`electricity-capacity-data.csv`](electricity-capacity-data.csv). The sourced
capacity behind the Montreal, Saudi Arabia, Dallas-Fort Worth, and Northern
Virginia benchmarks is in
[`global-benchmark-capacity-data.csv`](global-benchmark-capacity-data.csv). All
eligible observations appear as proportional-width blocks on one curve,
ordered by electricity-only compute yield. Excluded records remain visible in
the evidence ledger. The chart labels the included records' different boundaries:
the North American figures are wholesale-market inventory and China is
commissioned design IT capacity.
Source choices, derivations, and exclusions are explained in
[`RESEARCH_NOTES.md`](RESEARCH_NOTES.md).

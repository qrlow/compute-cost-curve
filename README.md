# China electricity-only AI compute cost curve

This project is a static, source-backed visualization of how much raw AI
compute one electricity dollar would buy across China's largest data-center
provinces if every location used the same hardware, workload, and facility
efficiency.

[View the published curve](https://qrlow.github.io/compute-cost-curve/)

The height of each block is dense-BF16 FLOPs per electricity dollar. Its width
is commissioned design IT capacity. The March 2025 national denominator is
10.43 million in-use standard racks, or 26.075 GW at the official 2.5 kW
standard-rack conversion. The chart prices the ten largest provinces, covering
an estimated 18.203 GW, or about 70% of the national total.

Provincial widths are estimates derived from the rectangle areas in CAICT's
2025 provincial rack-distribution treemap and rescaled to the official national
total. Reported Hohhot and Gui'an data-center prices are applied only to matched
capacity. Other blocks use clearly labelled high-voltage tariff proxies rather
than claiming undisclosed hyperscaler contract prices.

The calculation uses an NVIDIA GB200 NVL72 rack at 180 dense-BF16 PFLOP/s,
approximately 120 kW, and a common PUE of 1.20. Construction, financing,
hardware purchases, labor, utilization, and model quality are excluded.

The underlying China observations are in
[`electricity-capacity-data.csv`](electricity-capacity-data.csv). A separate,
proportional-width panel shows the sourced capacity behind the Montreal, Saudi
Arabia, Dallas-Fort Worth, and Northern Virginia price benchmarks; those rows
are in [`global-benchmark-capacity-data.csv`](global-benchmark-capacity-data.csv).
The panels remain separate because the North American figures are wholesale
market inventory while Saudi Arabia is a national operational total. Source
choices, derivations, and exclusions are explained in
[`RESEARCH_NOTES.md`](RESEARCH_NOTES.md).

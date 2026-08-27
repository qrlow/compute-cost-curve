# Electricity-only AI compute cost curve

This project is a static, source-backed visualization of data-center electricity
economics. It shows how much raw AI compute one electricity dollar would buy if
every location used the same hardware, model workload and facility efficiency.

[View the published curve](https://qrlow.github.io/compute-cost-curve/)

The height of each block is dense-BF16 FLOPs per electricity dollar. The width
is the operating IT capacity covered by a matched public observation. Capacity
coverage varies: some observations are markets, one is a national figure and
others are Chinese campuses or cluster subsets. The page labels those boundaries
and must not be read as a complete country-capacity ranking.

The calculation uses an NVIDIA GB200 NVL72 rack at 180 dense-BF16 PFLOP/s,
approximately 120 kW, and a common PUE of 1.20. Construction, financing,
hardware purchases, labor and model quality are excluded.

The underlying observations are in
[`electricity-capacity-data.csv`](electricity-capacity-data.csv). Source choices,
derivations and exclusions are explained in
[`RESEARCH_NOTES.md`](RESEARCH_NOTES.md).

# Source-verification report

Input SHA-256: `d892c5f4789bd81657c742c32a755801fd756df200e7787470a86b11df6f8249`

Observation cutoff: **2025-12-31**

Research-publication cutoff: **2026-08-24**

Reproduction check: **complete**

Independent human review: **pending**

“Independent” here means the build reconstructs each displayed value from canonical inputs and checks it against a source-specific locator. It does **not** mean a second human auditor has signed off.

## Material corrections in this audit pass

- Capacity is now registered independently of price availability. The additive register contains **57,077.4 MW** across **58** country-region keys.
- Price coverage is explicit: the combined observed-price-or-tariff category covers **68.7%** of registered capacity, while the strict data-center-specific audit subset covers **1.2%**.
- Ten non-overlapping JLL US market records add **27,585 MW** of year-end 2025 leased plus hyperscaler-owned capacity. The earlier CBRE Virginia and Dallas wholesale records remain as non-additive source comparisons.
- Official regional capacity for Great Britain and end-2025 live market capacity for India are in the register even where a qualifying regional price is absent.
- The country-gap queue is generated from observed country totals where available and otherwise from named-market forecast minima; it is not presented as a complete country census.
- The CAICT treemap is paired with the **10.43 million racks at 2025-03-31** denominator. The separately published June 2025 total is not mixed into the derivation.
- CAICT does not publish the 31 province-level values behind Figure 6. The image-area result is therefore labelled an estimate, and **17** direct official observations covering **11 provinces** plus **5 subregional observations** are published separately for triangulation.
- The closest-date direct Jiangsu observation is **473,000 in-use standard racks at 2025-03-20**, materially below the image-implied estimate. This unresolved conflict is exposed in the cross-check file; direct observations with different dates or boundaries are not silently substituted into the matched March national total.
- Hohhot / Helinger is **442.5 MW of commissioned design IT capacity**, derived from 11 × 16,091 standard racks × 2.5 kW. The reported 326 MW is an occupied facility-load cross-check, not the chart width.
- The unsupported 169 MW Guangdong regional weighting was removed. The proxy scenario applies the Pearl River Delta public tariff uniformly to the derived Guangdong capacity and labels it as a conservative proxy.
- Applicable tariffs and official industrial averages are combined in the public curves, while every block retains its evidence class and the strict data-center-specific subset remains separately quantified. Hohhot's delivered-price observation is retained only in that subset because its capacity is nested inside Inner Mongolia's provincial width.

## Included source checks (52)

| ID | Publisher | Status | Exact locator | Verification |
|---|---|---|---|---|
| `caict_treemap_2025` | China Academy of Information and Communications Technology | verified_derived | PDF page 22 / report page 16, Figure 6 and surrounding text; Appendix 1 states unspecified data are through 2025-03-31 and lists the China Computing Power Platform, MIIT, CAICT, local policy documents, literature and public data; Appendix 3 defines in-use racks. | Downloaded and rendered the source PDF, recorded its SHA-256, and reconciled all 31 rectangles. The project assumes treemap area is proportional to rack count; this reproduces an estimate, not CAICT's unpublished row-level inputs. |
| `china_computing_platform_2025` | China Computing Power Platform / China Academy of Information and Communications Technology | verified | Sections describing provincial-platform access, Shanxi's resource-registration functions and the July 2025 operating statistics. | Checked the official platform description and searched the public platform and report materials for a downloadable 31-province rack table; none was linked in the reviewed materials. |
| `miit_monitoring_network_2026` | Ministry of Industry and Information Technology | verified | Paragraph beginning '《通知》提出，到2026年底'. | Checked the target date, 31-region scope and monitoring description on MIIT's official page. This supports the conclusion that a complete public automated-monitoring census was not yet established in early 2026; it does not prove that no internal provincial table exists. |
| `jiangsu_racks_2025_03` | Jiangsu Provincial People's Government | verified | Paragraph beginning '算力是数字经济的底座', sentence beginning '截至目前'. | Checked the figure, province-wide wording and date on the provincial government page; the same paragraph reports 37.9 EFLOPS and a 60% intelligent-compute share. |
| `jiangsu_racks_2025_08` | Jiangsu Communications Administration | verified | Opening paragraph, sentence beginning '截至8月底'. | Checked the rack count, observation month and in-use boundary on the provincial communications regulator's page. |
| `shandong_racks_2025_06` | Shandong Provincial Department of Industry and Information Technology | verified | Section '四是推进数字基础设施建设', sentence beginning '算力产业发展势头迅猛'. | Checked the lower-bound wording and province-wide in-use-rack boundary on the department's official page. |
| `shanxi_racks_2025_06` | Xinhua, republished by Jincheng Municipal Government | verified | Paragraph quoting Shanxi Department of Industry and Information Technology deputy director Liu Yong. | Checked the figure, observation month and province-wide boundary in the attributed official statement. |
| `hebei_racks_2025_12` | Hebei Provincial Department of Industry and Information Technology | verified | Paragraph beginning '据工信部近日发布的2025年算力统筹监测数据显示'. | Checked the reported MIIT dataset attribution, year-end observation date, rack figure and in-use boundary on the department's page. |
| `guangdong_racks_2025_12` | Guangdong Provincial People's Government Overseas Chinese Affairs Office, republishing Nanfang Daily | verified | Province computing-capacity paragraph following the discussion of the Shaoguan cluster. | Checked the value, in-use wording and year-end context on the government-hosted article; no underlying provincial table is linked. |
| `guangxi_racks_2024_12` | Guangxi Communications Administration | verified | Second paragraph, sentence beginning '截至2024年底'. | Checked the value, year-end date and explicit in-use design-capacity boundary on the provincial communications regulator's page. |
| `hubei_racks_2025_06` | Hubei Daily, citing Hubei Provincial Data Bureau | verified | Newspaper page 2, paragraph beginning '据湖北省数据局统计'. | Checked the lower-bound rack figure, observation month and attribution to the provincial Data Bureau in the newspaper PDF. |
| `hubei_racks_2025_06_official_republication` | Wuhan Science and Technology Innovation Bureau, republishing Hubei Daily | verified | Section headed '全省总算力规模同比增长173%', paragraph beginning '据湖北省数据局统计'. | Checked the lower-bound count, in-use wording, observation month and Hubei Data Bureau attribution on the municipal government bureau's republication. |
| `zhejiang_racks_2025_12` | Zhejiang Communications Administration | verified | Section 4(c), '数据中心建设协调推进'. | Checked the year, exact value and communications-industry boundary in the official statistical bulletin. |
| `guizhou_racks_2025_12` | Guizhou Provincial Development and Reform Commission | verified | Opening section under '算力规模加快壮大'. | Checked the official report of the provincial government press conference, the 320,000 value and the combined under-construction/in-operation key-centre boundary. |
| `ningxia_racks_2025_10` | Ningxia Hui Autonomous Region Development and Reform Commission | verified | Digital-information paragraph beginning '数字信息逐步成势'. | Checked the exact figure and province-wide context on the commission's page. The page does not state whether the count is in-use, built or installed, so the boundary is retained as unresolved. |
| `shanghai_racks_2023_09` | Beijing Municipal Government Data Portal, citing Shanghai Communications Administration | verified | Section headed '算赋百业生态初具规模'. | Checked the exact value, in-use boundary, date and regulator attribution on the government-hosted republication; the original regulator release was not located. |
| `shanghai_pudong_racks_2025_11` | Shanghai Municipal People's Government | verified | Section '数字底座坚实筑基智慧政务提升治理效能', cloud-network and computing paragraph. | Checked the subregional scope, data-centre count and standard-rack figure on the municipal government page. |
| `helingeer_racks_2025_07` | Xinhua Inner Mongolia | verified | Conference report paragraph describing the cluster's evaluation indicators. | Checked the rack figure and cluster context in the Xinhua report; the commissioned-versus-built boundary is not explicit and is preserved as a caveat. |
| `wulanchabu_racks_2025_01` | Wulanchabu Daily, republished by Inner Mongolia News | verified | Paragraph beginning '乌兰察布市经过10多年的发展'. | Checked the built and actually used rack counts and preserved the distinction between them in the cross-check boundary. |
| `wulanchabu_racks_2025_12` | Guangming Daily, republished by Inner Mongolia News | verified | Paragraph beginning '截至2025年底'. | Checked the built, operational and utilization figures in the Guangming Daily report and retained the operational 330,000 as the cross-check value. |
| `scio_racks_2025_03` | State Council Information Office of China | verified | Briefing answer by Xie Cun, paragraph beginning 'Network capabilities have been enhanced.' | Exact figure and observation date checked against the official briefing text. |
| `nda_standard_rack` | National Data Administration | verified | Section 6.2.3, Table 3: rack total formula = rack power / 2.5 kW × rack count. | Formula checked in the official technical document. |
| `jll_na_active_capacity_2025` | JLL | verified | Paragraph beginning 'The report marks a significant evolution'. | The active-versus-under-construction boundary, 39 GW total and leased/hyperscaler scope were checked on JLL's official release. |
| `dominion_jll_markets_2025` | Dominion Energy, citing JLL | verified | Slide 49, 'Top North American markets (MW capacity)'. | All ten labels and values were checked in Dominion's published table, which explicitly attributes the data to JLL's Year-End 2025 North America Data Center Report. |
| `cbre_inventory_h2_2025` | CBRE | verified | Top 10 Largest North American Data Center Markets by Inventory table. | All three values checked in CBRE's published table. |
| `cbre_capacity_glossary` | CBRE Research | verified | PDF page 17, Market Definitions. | CBRE glossary language checked in a university-hosted copy of the report. |
| `hohhot_capacity_2023` | Guojin Securities, citing Tsinghua IGI | verified_derived | PDF report page 10, Figure 18. | Downloaded PDF and checked every input. Recomputed 442.5 MW design IT capacity and separately reconciled the reported 326 MW occupied facility load. |
| `hohhot_price_2025` | National Energy Administration | verified | Paragraph beginning '目前，和林格尔新区已落地'. | Exact price and boundary checked in the official article. |
| `mongxi_tariff_2025_06` | Inner Mongolia Power Group / Xilingol League Administration | verified | Attached tariff table, 110 kV two-part row. | Official announcement checked; exact table values cross-checked against a machine-readable transcription. |
| `zhejiang_tariff_2025_06` | State Grid Zhejiang Electric Power | verified | Tariff table, industrial/commercial 110 kV row. | Exact values and effective period checked in the source PDF. |
| `guizhou_tariff_2025_06` | Guizhou Power Grid / Liupanshui municipal government | verified | Tariff table, 110 kV two-part row. | Exact values and effective period checked in the government-hosted PDF. |
| `jibei_tariff_2025_04` | State Grid Jibei Electric Power | verified | Appendix 4, 110 kV two-part row. | Exact values and effective period checked in the published table. |
| `jiangsu_tariff_2025_06` | State Grid Jiangsu / Jintan District Government | verified | Appendix 2, lines/table row for 110 kV two-part users. | Exact values, formula components and effective period checked in the government page. |
| `beijing_tariff_2025_04` | State Grid Beijing Electric Power | verified | Tariff table, 35–110 kV two-part row. | Exact values and effective period checked in the published table. |
| `guangdong_tariff_2025_04` | Guangdong Power Grid / Shaoguan municipal government | verified | Pearl River Delta five-city table, 35–110 kV two-part row. | Exact tariff row and effective month checked in the official PDF; earlier unsupported regional capacity weighting removed. |
| `shandong_tariff_2025_03` | State Grid Shandong / Yantai municipal government | verified | Tariff table, 35–110 kV two-part row. | Exact values and effective period checked in the government page. |
| `hydroquebec_rate_lg_2025` | Hydro-Québec | verified | Articles 5.14–5.15 and high-voltage credit table in Chapter 12. | Rate applicability and each price component checked in Hydro-Québec's rate book. |
| `hydroquebec_datacenter_classes_2026` | Régie de l'énergie du Québec | verified | One-page member table listing current tariffs for Cologix, Compass, Equinix, eStruxture, QScale and Vantage. | Data-center tariff classes checked in the regulator filing. |
| `eia_industrial_prices_2025` | U.S. Energy Information Administration | verified | Table 5.6.B, year-to-date through December 2025. | All seven state values and the calendar-2025 boundary were checked in EIA's annual retail-sales API and reconciled to Electric Power Monthly Table 5.6.B. |
| `federal_reserve_fx_2025` | Federal Reserve Board | verified | Annual exchange-rate table, Canada, China and United Kingdom rows, 2025 column. | All annual-average rates and the asterisked USD-per-GBP convention were checked in the Federal Reserve release; the GBP inverse is explicit in the model. |
| `nvidia_gb200_spec` | NVIDIA | verified | GB200 NVL72 Specs table and footnote 2. | Specification and dense/sparse footnote checked on the vendor page during the research window. |
| `nvidia_gb200_power` | NVIDIA | verified | Example 1: Configuring a PD for a GB200 NVL72 rack. | Power boundary and value checked in NVIDIA documentation. |
| `huawei_cloudmatrix_performance` | Huawei | verified | Paragraph beginning 'In March 2025, Huawei officially launched'. | Chip count and performance claim checked on Huawei's page; precision boundary is supplemented by SemiAnalysis. |
| `semianalysis_cloudmatrix_power` | SemiAnalysis | verified | Paragraph beginning 'The drawback here', before the paywall. | Exact current figures checked on the source page. They remain modeled estimates, not metered measurements. |
| `bis_china_policy_2026` | U.S. Bureau of Industry and Security | verified | Policy summary and stated performance thresholds. | Scenario boundary checked against the BIS policy release; it is not treated as an installed-fleet fact. |
| `guian_capacity_2025` | Guiyang municipal government | verified | Capacity paragraph in the official response. | Exact value checked, then excluded because powered-on racks do not match commissioned design capacity. |
| `knight_frank_global_capacity_2025` | Knight Frank | verified | Demand shock section, first paragraph. | The 2025 global headline was checked on the publisher's page. It is retained as an indicative denominator because no same-boundary country table is published there. |
| `knight_frank_global_forecast_2025` | Knight Frank / DC Byte | verified | PDF pages 46–47, Global Forecasts map and note. | Every 2025 market label and the regional/global summary were transcribed from the report. Forecast values rank research gaps but are not used as observed chart widths. |
| `dcbyte_canada_live_2025` | Data Center Dynamics, reporting DC Byte | verified | Paragraphs beginning 'As of Q2 2025' and 'Of this 9GW'. | The live-versus-pipeline distinction, observation quarter and country total were checked in the article quoting DC Byte. |
| `uk_dsit_regional_capacity_2024` | UK Department for Science, Innovation and Technology | verified | Methodology and PQ answer table, lines 80–106. | All 11 regional values, the IT-power boundary and exclusions were checked against the official table; rows sum to 1,566 MW. |
| `knight_frank_india_capacity_2025` | Knight Frank India | verified | PDF page 6, 'Live Data Centre Capacity (in MW) Across Key Cities'. | All seven city values and the live-capacity definition were checked in the report; the values sum to 1,621.9 MW. |
| `uk_desnz_nondomestic_price_2025` | UK Department for Energy Security and Net Zero | verified | Average electricity and gas prices table, lines 551–561. | The 2025 value, provisional status, all-size-band boundary and tax treatment were checked in the official table. |

## Full register

The machine-readable register, including excluded or only partially verified candidates, is in [source-verification.csv](source-verification.csv). Each record retains its URL, publication date, exact locator, check method, and human-review status.

The Chinese provincial evidence comparison is in [china-provincial-capacity-crosschecks.csv](china-provincial-capacity-crosschecks.csv). It preserves each observation date, geographic scope, capacity boundary and replacement decision.

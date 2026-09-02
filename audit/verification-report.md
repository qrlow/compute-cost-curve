# Source-verification report

Input SHA-256: `89e6dd1b32d23cfdfa86adc5146997642ed6f7ffd2fb53f12729638cca6b0410`  
Observation cutoff: **2025-12-31**  
Research-publication cutoff: **2026-08-24**  
Reproduction check: **complete**  
Independent human review: **pending**

“Independent” here means the build reconstructs each displayed value from canonical inputs and checks it against a source-specific locator. It does **not** mean a second human auditor has signed off.

## Material corrections in this audit pass

- The CAICT treemap is paired with the **10.43 million racks at 2025-03-31** denominator. The separately published June 2025 total is not mixed into the derivation.
- Hohhot / Helinger is **442.5 MW of commissioned design IT capacity**, derived from 11 × 16,091 standard racks × 2.5 kW. The reported 326 MW is an occupied facility-load cross-check, not the chart width.
- The unsupported 169 MW Guangdong regional weighting was removed. The proxy scenario applies the Pearl River Delta public tariff uniformly to the derived Guangdong capacity and labels it as a conservative proxy.
- Reported observations and constructed tariff proxies are displayed as different evidence scenarios.

## Included source checks (24)

| ID | Publisher | Status | Exact locator | Verification |
|---|---|---|---|---|
| `caict_treemap_2025` | China Academy of Information and Communications Technology | verified | PDF page 22 / report page 16, Figure 6; Appendix 1 states unspecified data are through 2025-03-31; Appendix 3 defines in-use racks. | Downloaded PDF, extracted text, rendered Figure 6, recorded SHA-256 and independently reconciled all 31 rectangles. |
| `scio_racks_2025_03` | State Council Information Office of China | verified | Briefing answer by Xie Cun, paragraph beginning 'Network capabilities have been enhanced.' | Exact figure and observation date checked against the official briefing text. |
| `nda_standard_rack` | National Data Administration | verified | Section 6.2.3, Table 3: rack total formula = rack power / 2.5 kW × rack count. | Formula checked in the official technical document. |
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
| `eia_industrial_prices_2025` | U.S. Energy Information Administration | verified | Table 5.6.B, year-to-date through December 2025. | Both state values and the preliminary monthly-series boundary checked in Table 5.6.B. |
| `federal_reserve_fx_2025` | Federal Reserve Board | verified | Annual exchange-rate table, Canada and China rows, 2025 column. | Both annual-average rates and unit convention checked in the Federal Reserve release. |
| `nvidia_gb200_spec` | NVIDIA | verified | GB200 NVL72 Specs table and footnote 2. | Specification and dense/sparse footnote checked on the vendor page during the research window. |
| `nvidia_gb200_power` | NVIDIA | verified | Example 1: Configuring a PD for a GB200 NVL72 rack. | Power boundary and value checked in NVIDIA documentation. |
| `huawei_cloudmatrix_performance` | Huawei | verified | Paragraph beginning 'In March 2025, Huawei officially launched'. | Chip count and performance claim checked on Huawei's page; precision boundary is supplemented by SemiAnalysis. |
| `semianalysis_cloudmatrix_power` | SemiAnalysis | verified | Paragraph beginning 'The drawback here', before the paywall. | Exact current figures checked on the source page. They remain modeled estimates, not metered measurements. |
| `bis_china_policy_2026` | U.S. Bureau of Industry and Security | verified | Policy summary and stated performance thresholds. | Scenario boundary checked against the BIS policy release; it is not treated as an installed-fleet fact. |

## Full register

The machine-readable register, including excluded or only partially verified candidates, is in [source-verification.csv](source-verification.csv). Each record retains its URL, publication date, exact locator, check method, and human-review status.

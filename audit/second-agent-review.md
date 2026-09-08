# Second-agent source review

Reviewed on **2026-09-08**. Input SHA-256: `ff1e8ce94ab2cf3a06d6317e2982e5d04361ff7412dda11aabb26b02428cd7d9`.

Fresh source-by-source reading of all 57 registered citations, including failed-access attempts. Checks the claim, date, units, geographic/status boundary and use in the model. This is an AI review, not human sign-off or assurance of the underlying statistics. Original input values and first-review decisions are preserved; actions below remain unresolved. The review date does not advance the 24 August 2026 research-publication cutoff.

## Results

| Result | Sources | Meaning |
|---|---:|---|
| confirmed | 12 | The cited figure, date and stated boundary were supported by the evidence read. This does not certify the underlying measurement or whole model. |
| qualified | 29 | Relevant evidence was read, but access, dating, scope, estimation or applicability limits prevent unqualified acceptance. |
| discrepancy | 9 | A specific error or unsupported assertion was identified in the registered citation, claim, date, locator or interpretation. |
| not verified | 7 | This pass did not obtain sufficient readable evidence to verify the claim. This is not proof the claim is false. |

These counts describe source-review outcomes, not the percentage of capacity independently verified. Source counts are not capacity weights. Several qualified sources support large parts of the model.

## Issues preventing overall sign-off

- **Global coverage:** the 62 GW denominator is not reconciled to the mixed inventory boundaries; the displayed coverage ratio is only indicative.
- **Provincial capacity:** the treemap is an estimate, and the direct March Jiangsu observation remains inconsistent with it. Guangdong's exact year-end observation date is not established by the cited passage.
- **Electricity bills:** several Chinese tariffs have time-of-use schedules omitted from the base-rate calculation. Shandong's chosen voltage row excludes 110 kV.
- **Montreal:** the 2026 operator-class filing does not establish 2025 classes, qualifying voltages or tariff coverage for all 229.5 MW.
- **Technology:** the power/performance comparison is an engineering scenario, not controlled metering; the 2026 BIS release alone does not establish the 2025 export-control boundary.
- **Citation quality:** incorrect locators, a dead EIA URL and inaccessible sources are recorded below. A recovered alternative is identified explicitly rather than presented as a successful read of the original URL.

The review is stored in [the canonical review file](../data/source-second-review.json). The build checks that each source has one review and that its fingerprint still matches. It will not silently reuse a review after the source record changes. Evidence documents can still change at their URLs; these fingerprints cover the registered source metadata, not remote document contents.

## Source-by-source findings

### caict_treemap_2025

Result: **qualified**. Original first-pass status: verified_derived.

Access: Downloaded PDF; text extraction and visual inspection.

Locator: PDF 22 / printed 16, Figure 6; PDF 45 and 46, Appendices 1 and 3.

The top-ten order and top-six >600,000-rack statement match. Appendix 1 dates unspecified data to March 2025; Appendix 3 defines in-use racks as design capacity in commissioned centres, normalized to 2.5 kW. The figure does not supply 31 raw values or explicitly state area proportionality. The direct March Jiangsu count conflicts with the treemap.

Follow-up: Keep provincial widths labelled estimates; resolve the Jiangsu conflict before treating them as verified provincial measurements.

Evidence: [Registered source](https://13115299.s21i.faiusr.com/61/1/ABUIABA9GAAg4pOYywYogpflxgc.pdf).

### china_computing_platform_2025

Result: **discrepancy**. Original first-pass status: verified.

Access: Official-hosted article read in full.

Locator: Provincial-platform paragraph versus separate end-July operating-statistics paragraph.

Ten connected provincial platforms are described at the 2025 conference; the explicit end-July date applies to operating statistics, not clearly to the ten-platform count. The page credits People's Posts and Telecommunications News, rather than being the platform's own dataset.

Follow-up: Separate the observation dates and correct the publisher/tier attribution. Do not claim this proves that a public provincial table does not exist.

Evidence: [Registered source](https://www.digitalchina.gov.cn/2025/xwzx/qwfb/202509/t20250904_5073458.htm).

### miit_monitoring_network_2026

Result: **qualified**. Original first-pass status: verified.

Access: Regulator article read in full.

Locator: Paragraph setting the end-2026 target.

The 31-region automated-monitoring target is supported. A future monitoring target does not establish whether a public census or an internal provincial table already exists.

Follow-up: Retain the target as context; remove the broader inference about absence of an existing public census from the first-review method.

Evidence: [Registered source](https://www.miit.gov.cn/xwfb/gxdt/sjdt/art/2026/art_d9a97da3826d4072beed83c66c19f81f.html).

### jiangsu_racks_2025_03

Result: **confirmed**. Original first-pass status: verified.

Access: Official government republication read in full.

Locator: Computing-infrastructure paragraph, as-of-now sentence.

473,000 in-use standard racks, 37.9 EFLOPS and the publication date of 20 March 2025 match. The observation is described as current at publication, not as a precisely timed census.

Follow-up: Retain this direct cross-check and its conflict with the treemap; do not infer intervening growth without another observation.

Evidence: [Registered source](https://www.js.gov.cn/art/2025/3/20/art_91704_11521202.html).

### jiangsu_racks_2025_08

Result: **confirmed**. Original first-pass status: verified.

Access: Provincial regulator article read in full.

Locator: Opening paragraph, end-August statement.

670,000 in-use standard racks at the end of August 2025 and the 27 October publication date match.

Follow-up: Retain as a later observation, not a replacement inside a March national allocation.

Evidence: [Registered source](https://jsca.miit.gov.cn/xwdt/gzdt/art/2025/art_86a6ff1669a749b7acf3e6498ade8c15.html).

### shandong_racks_2025_06

Result: **not verified**. Original first-pass status: verified.

Access: Official URL attempted in web reader and browser; targeted search.

Locator: Registered section could not be reread.

The live page timed out and the browser reported a certificate-name error. Targeted searches did not recover the stated source passage. The >350,000 claim and its date were not independently confirmed in this pass.

Follow-up: Keep the first review separate; obtain a readable official copy before treating this cross-check as second-agent verified.

Evidence: [Registered source](https://gxt.shandong.gov.cn/art/2025/6/26/art_123005_38703.html).

### shanxi_racks_2025_06

Result: **qualified**. Original first-pass status: verified.

Access: Government-hosted Xinhua article read in browser.

Locator: Liu Yong quotation; header and Xinhua dateline.

514,000 in-use standard racks as of June 2025 match. The host published on 26 August; the Xinhua dateline is 22 August. The quotation says as of June, without explicitly specifying the last day.

Follow-up: Retain the count; describe the observation as June 2025 and distinguish the original and republication dates.

Evidence: [Registered source](https://www.jcgov.gov.cn/dtxx/gnyw/202508/t20250826_2190958.shtml).

### hebei_racks_2025_12

Result: **confirmed**. Original first-pass status: verified.

Access: Government-hosted article read in browser.

Locator: Paragraph attributing figures to MIIT's 2025 monitoring data.

2.396 million in-use standard racks at year-end 2025 and the 9 March 2026 host publication date match. This is a Hebei Daily report hosted by the department, quoting MIIT; the underlying monitoring table is not provided.

Follow-up: Retain the attributed observation. Do not describe the hosted article as direct access to MIIT's underlying dataset.

Evidence: [Registered source](https://gxt.hebei.gov.cn/hbgyhxxht/xwzx32/snxw40/2026030909350910674/index.html).

### guangdong_racks_2025_12

Result: **discrepancy**. Original first-pass status: verified.

Access: Search-indexed text of the registered government article; live TLS failure.

Locator: Rack-count paragraph and preceding renewable-power paragraph.

The indexed article supports 1.42 million in-use racks and second-place ranking. The explicit year-end-2025 wording occurs in the renewable-generation paragraph; it does not unambiguously date the rack count. The stored year-end rack observation is unsupported by this passage.

Follow-up: Mark the rack observation date unconfirmed until a dated primary capacity statement is obtained; do not infer it from nearby energy statistics.

Evidence: [Registered source](https://www.qb.gd.gov.cn/jrqx/content/post_1326148.html).

### guangxi_racks_2024_12

Result: **confirmed**. Original first-pass status: verified.

Access: Provincial regulator article read in full.

Locator: Second paragraph, end-2024 statement.

164,000 standard racks of design capacity in in-use data centres at year-end 2024 match. This is commissioned design capacity, not occupied racks. Publication is 13 May 2025.

Follow-up: Retain the explicit design-capacity boundary and 2024 observation date.

Evidence: [Registered source](https://gxca.miit.gov.cn/xwdt/gzdt/art/2025/art_ca101c47ce624793868f3a9256998089.html).

### hubei_racks_2025_06

Result: **confirmed**. Original first-pass status: verified.

Access: Downloaded newspaper PDF; extracted and checked the attributed paragraph.

Locator: PDF 1 / newspaper page 2, Hubei Data Bureau paragraph.

The 23 July 2025 newspaper states 243 in-use centres and more than 210,000 in-use standard racks at the end of June. The lower bound and observation month match.

Follow-up: Retain the lower-bound sign. The government republication is the same report, not a second independent measurement.

Evidence: [Registered source](https://epaper.hubeidaily.net/pc/attachment/202507/23/b16aa3fd-a816-44c6-a647-6a83a211b04f.pdf).

### hubei_racks_2025_06_official_republication

Result: **confirmed**. Original first-pass status: verified.

Access: Government republication read in full and compared with newspaper PDF.

Locator: Section on 173% computing-capacity growth; Data Bureau paragraph.

The June-end date, 243 centres and >210,000 standard racks match the newspaper version. The host date is 23 July 2025.

Follow-up: Retain as an accessible corroborating copy, not independent statistical confirmation of the original report.

Evidence: [Registered source](https://kjj.wuhan.gov.cn/xwzx_8/kjspxw/202507/t20250723_2623861.html).

### zhejiang_racks_2025_12

Result: **qualified**. Original first-pass status: verified.

Access: Provincial regulator annual review read in full.

Locator: Infrastructure paragraph, all-industry built standard racks.

579,000 built standard racks are reported for the communications industry. This describes a stock built, not 579,000 additions during 2025, and does not explicitly establish the same commissioned boundary as CAICT.

Follow-up: Keep as a sector/boundary-limited cross-check; avoid interpreting built racks as newly added or all-province operational racks.

Evidence: [Registered source](https://zjca.miit.gov.cn/zwgk/xysjtj/art/2026/art_40707d7bde224d0bafe17cb5bbac9980.html).

### guizhou_racks_2025_12

Result: **qualified**. Original first-pass status: verified.

Access: Registered page inaccessible; search-indexed original newspaper report read.

Locator: Guizhou Daily, 20 March 2026, front-page report of 19 March press conference.

The original report confirms growth from 80,000 to 320,000 standard racks during the 14th Five-Year Plan and 50 key centres under construction or in operation. It does not establish a province-wide commissioned-only rack total.

Follow-up: Keep the mixed project-status boundary and seek a commissioned-only total. Record the original newspaper as supporting evidence.

Evidence: [Registered source](https://drc.guizhou.gov.cn/xwzx/zwyw/202603/t20260320_89890350.html); [Supporting evidence 1](https://szb.eyesnews.cn/pc/att/202603/20/0f9d075a-643d-423e-8c4c-8077e1ffd1fe.pdf).

### ningxia_racks_2025_10

Result: **qualified**. Original first-pass status: verified.

Access: Search-indexed text of the registered government page; live access failed.

Locator: 31 October 2025 industry-development summary.

208,900 standard racks are supported in the indexed text. It does not clearly separate built, commissioned and occupied capacity or give an exact census date.

Follow-up: Retain as a qualified cross-check; do not upgrade to a precise operational census based on publication date alone.

Evidence: [Registered source](https://fzggw.nx.gov.cn/ztzl/sww/202510/t20251031_5070621.html).

### shanghai_racks_2023_09

Result: **not verified**. Original first-pass status: verified.

Access: Registered government URL attempted; targeted search.

Locator: Registered September-2023 statement not recovered from the cited official page.

The government-hosted source could not be reread. Secondary search results repeat 423,000 racks, but this pass did not recover a readable official or original source supporting the registered date and boundary.

Follow-up: Obtain the regulator's original release or an accessible official copy; do not count repetitions as second-agent verification.

Evidence: [Registered source](https://data.beijing.gov.cn/publish/bjdata/xydt/qtss/2942db54cb4444cba9801068082aa2bc.htm).

### shanghai_pudong_racks_2025_11

Result: **qualified**. Original first-pass status: verified.

Access: Shanghai government article read in full.

Locator: Pudong data-centre paragraph.

The 25 November 2025 article reports 59 centres and 280,000 standard racks in Pudong. It does not report the entire Shanghai municipality or explicitly distinguish commissioned from built racks.

Follow-up: Retain only as a subregional check, with the status boundary unresolved.

Evidence: [Registered source](https://www.shanghai.gov.cn/nw15343/20251125/fd22ee263f8d4ba296fd5ec989bd47a8.html).

### helingeer_racks_2025_07

Result: **qualified**. Original first-pass status: verified.

Access: Search-indexed Xinhua article read; alternate www host recovered.

Locator: 12 July 2025 report of the green-computing-index launch.

339,000 standard racks and 7,683 PFLOPS for Helingear New Area match. The article reports a research launch, not an explicit July-day census, and does not define commissioned versus built racks.

Follow-up: Keep the subregional scope and distinguish publication date from a precise observation date.

Evidence: [Registered source](https://nmg.news.cn/20250712/8bdd43f119184da0be15ac00aa9fe5c6/c.html); [Supporting evidence 1](https://www.nmg.news.cn/20250712/8bdd43f119184da0be15ac00aa9fe5c6/c.html).

### wulanchabu_racks_2025_01

Result: **qualified**. Original first-pass status: verified.

Access: Search-indexed text of the original registered article.

Locator: 16 January 2025 article; cumulative-development paragraph.

240,000 built racks and 170,000 actually used racks match. The source is a Wulanchabu Daily report; signed capacity above 1.1 million is explicitly separate.

Follow-up: Retain the built-versus-used distinction and publication-date upper bound; do not add signed projects to operational capacity.

Evidence: [Registered source](https://inews.nmgnews.com.cn/system/2025/01/16/030087913.shtml).

### wulanchabu_racks_2025_12

Result: **not verified**. Original first-pass status: verified.

Access: Registered URL attempted in browser and web reader; targeted search.

Locator: Registered 26 January 2026 article not recovered.

The original article could not be reread. Repetitions on other sites do not independently verify 500,000 built racks, 330,000 operational racks or the year-end date.

Follow-up: Recover the original report or an official statistical statement before accepting this row as independently checked.

Evidence: [Registered source](https://inews.nmgnews.com.cn/system/2026/01/26/030300987.shtml).

### scio_racks_2025_03

Result: **qualified**. Original first-pass status: verified.

Access: Search-indexed official SCIO press-conference transcript.

Locator: 18 July 2025 briefing, end-March computing-capacity statement.

The transcript supports 10.43 million standard racks in use at the end of March 2025. This verifies the national denominator, not the 31 provincial allocations.

Follow-up: Retain the March denominator; record that this pass used the indexed transcript because live retrieval timed out.

Evidence: [Registered source](https://english.scio.gov.cn/pressroom/node_9016674.html).

### nda_standard_rack

Result: **discrepancy**. Original first-pass status: verified.

Access: Downloaded official consultation PDF; text checked.

Locator: Cover; section 6.2.1, Table 3, PDF 9 / printed 5.

The 2.5 kW standard-rack conversion is supported. However, the document is the consultation draft of computing-centre capability-assessment requirements, not the monitoring-indicators document named in the register. The cited section 6.2.3 is not the relevant rack-count section.

Follow-up: Correct the title, draft status and locator. CAICT Appendix 3 also directly supports the 2.5 kW conversion.

Evidence: [Registered source](https://www.nda.gov.cn/sjj/ywpd/szkjyjcss/0608/ff808081-96b465bf-0197-4f0dae39-0700.pdf).

### jll_na_active_capacity_2025

Result: **qualified**. Original first-pass status: verified.

Access: JLL release read in full.

Locator: Release header and opening active-capacity paragraph.

39 GW of active North American capacity in 2025, split about equally between leased and hyperscaler-owned, is supported. The header is 17 February 2026; the body dateline says 2025, an apparent source typo.

Follow-up: Use the 2026 header with a source-date note. Do not equate this North American series with a different provider's global denominator without reconciliation.

Evidence: [Registered source](https://www.jll.com/en-us/newsroom/jll-north-america-data-center-report-year-end-2025).

### dominion_jll_markets_2025

Result: **confirmed**. Original first-pass status: verified.

Access: Downloaded investor PDF; table and footnotes checked.

Locator: PDF/slide 49, active data-centre market table.

All ten market MW values match and sum to 27,585 MW. Virginia's 8,315 MW includes 6,315 MW Northern Virginia and 2,000 MW Southern Virginia. These are market aggregates reproduced by Dominion from JLL, not facility-level records.

Follow-up: Retain the exact market boundaries and attribution; do not relabel the ten markets as a complete US or state census.

Evidence: [Registered source](https://s2.q4cdn.com/510812146/files/doc_financials/2025/q4/2026-02-23-DE-IR-4Q-2025-earnings-call-slides-vTCI.pdf).

### cbre_inventory_h2_2025

Result: **confirmed**. Original first-pass status: verified.

Access: CBRE report page and market table read.

Locator: H2 2025 market inventory table.

Northern Virginia 4,039.6 MW, Dallas/Fort Worth 1,067.3 MW and Montreal 229.5 MW match. These are CBRE inventory observations, distinct from JLL's broader leased-plus-self-build series.

Follow-up: Keep overlapping US observations non-additive and retain Montreal's inventory-subset scope.

Evidence: [Registered source](https://www.cbre.com/press-releases/northern-virginia-extends-lead-as-largest-u-s-data-center-market-in-2025).

### cbre_capacity_glossary

Result: **discrepancy**. Original first-pass status: verified.

Access: University-hosted CBRE PDF read via web PDF extraction.

Locator: PDF 16 for H1 2018 glossary; PDF 34 / printed 17 for H2 2017 glossary.

The file concatenates two reports. The glossary supports commissioned wholesale power and the PDU boundary, but the registered PDF-page-17 locator does not identify it. The stored January-2018 publication month is not established by the reviewed glossary.

Follow-up: Correct the locator and verify the publication date; do not use this historical glossary alone to establish other providers' coverage.

Evidence: [Registered source](https://trerc.tamu.edu/wp-content/uploads/files/PDFs/MktResearch/US_DataCenterTrends_CBRE_Semiannual.pdf).

### hohhot_capacity_2023

Result: **qualified**. Original first-pass status: verified_derived.

Access: Downloaded broker report; Figure 18 inputs and surrounding context checked.

Locator: PDF 10, Figures 17–18.

11 centres, 16,091 average design racks, 107,793 used racks, 60.9% utilization, 2.5 kW per rack, PUE 1.21 and the 326 MW load comparison match. 442.5025 MW is calculated from rounded reported inputs, not directly measured capacity.

Follow-up: Retain as an attributed derived subset with rounding uncertainty; avoid presenting four-decimal precision as measurement accuracy.

Evidence: [Registered source](https://pdf.dfcfw.com/pdf/H3_AP202503031643671670_1.pdf).

### hohhot_price_2025

Result: **confirmed**. Original first-pass status: verified.

Access: NEA-hosted article read in full.

Locator: 18 July 2025 article; delivered electricity-price paragraph.

The article reports a delivered electricity transaction price of about CNY 0.35/kWh and green electricity above 80%. It is a reported local price, not an invoice establishing identical tariffs for all facilities.

Follow-up: Retain the approximate sign and local scope; do not apply it to the whole province without evidence.

Evidence: [Registered source](https://www.nea.gov.cn/20250718/410e42d872e4417687cb5b0ab357d088/c.html).

### mongxi_tariff_2025_06

Result: **qualified**. Original first-pass status: verified.

Access: Government notice and both original tariff images inspected visually.

Locator: June 2025 industrial/commercial table; 110 kV two-part row and footnote 3.

CNY 0.442525/kWh and 31.2/kW-month match. Time-of-use rates and special peak/trough periods apply. The utility territory is western Inner Mongolia, not the entire autonomous region.

Follow-up: Treat the calculation as a base-rate tariff proxy. Reconstruct the time-weighted bill and distinguish western/eastern grid coverage before calling it a province-wide annual bill.

Evidence: [Registered source](https://www.xlgl.gov.cn/xlgl/zw/zwgk/tzgg/2025090509233740836/index.html); [Supporting evidence 1](https://www.xlgl.gov.cn/xlgl/zw/zwgk/tzgg/2025090509233740836/2025090509221635776.jpg).

### zhejiang_tariff_2025_06

Result: **qualified**. Original first-pass status: verified.

Access: Downloaded PDF; tariff page visually inspected.

Locator: PDF 4, Table 1, 110 kV two-part rows and footnote 2.

CNY 0.5672/kWh and 41.6/kW-month match June 2025. Separate large-industrial and general-commercial time-of-use schedules apply. June has seven peak, seven flat and ten low-price hours, so a constant-load bill does not equal the flat rate.

Follow-up: Model time-of-use and customer class before treating the rate as a realized bill; keep the current simplified base-rate proxy clearly labelled.

Evidence: [Registered source](https://zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web2241/site/attach/0/d94d1693bc7042f0a4349368bbb18419.pdf).

### guizhou_tariff_2025_06

Result: **qualified**. Original first-pass status: verified.

Access: Search-indexed table from the registered official PDF; live download failed.

Locator: PDF/printed 3, June 2025 table, 110 kV two-part row.

The indexed table supports CNY 0.583744/kWh, 31/kW-month, and 1–30 June. Peak, flat and low rates and their hour schedules are separately stated.

Follow-up: Retain only as a dated tariff proxy; record indexed access and obtain an archived readable PDF for a fully reproducible document check.

Evidence: [Registered source](https://www.lp.gov.cn/xwdt/gsgg/202505/P020250805466901120249.pdf).

### jibei_tariff_2025_04

Result: **discrepancy**. Original first-pass status: verified.

Access: Downloaded published utility-copy PDF; tariff and footnotes checked.

Locator: PDF 1, Appendix 1, 110 kV two-part row.

CNY 0.58196875/kWh and 34.6/kW-month match April 2025. The table is Appendix 1, not Appendix 4. Jibei is a utility service territory, not all Hebei; time-of-use prices are separate.

Follow-up: Correct the locator. Keep the geographic extrapolation and simplified tariff calculation explicit.

Evidence: [Registered source](https://ele.aiit.org.cn/static/elefile/99303281758074622710101893155890.pdf).

### jiangsu_tariff_2025_06

Result: **qualified**. Original first-pass status: verified.

Access: Government-hosted notice and tariff table read in full.

Locator: Appendix 2, 110 kV two-part row; time-of-use footnote.

CNY 0.5999/kWh and 44.8/kW-month match. June's eight peak, eight flat and eight low-price hours imply an energy-only constant-load average of about CNY 0.621267/kWh, not 0.5999.

Follow-up: Reconstruct the time-weighted bill before calling the displayed calculation a standard-load electricity cost; retain the current base-rate proxy label.

Evidence: [Registered source](https://www.jintan.gov.cn/html/czjt/2025/JFKEQAOD_0624/281022.html).

### beijing_tariff_2025_04

Result: **qualified**. Original first-pass status: verified.

Access: Downloaded utility-copy PDF; row and footnotes checked.

Locator: PDF 1, April 2025 table, 35–110 kV two-part row.

CNY 0.61971175/kWh and 48/kW-month match. The source is a utility document hosted by an industry association, not a customer invoice; it describes one effective month.

Follow-up: Retain as an April tariff scenario, with voltage and assumed load factor explicit; it is not a measured annual data-centre average.

Evidence: [Registered source](https://ele.aiit.org.cn/static/elefile/99303281924019507384201247156397.pdf).

### guangdong_tariff_2025_04

Result: **not verified**. Original first-pass status: verified.

Access: Official PDF retrieval attempted; targeted exact-value search.

Locator: Registered five-city tariff table could not be reread.

The official download failed TLS validation and the table was not recovered through the web reader or targeted search. Neither numeric input was independently reverified in this pass.

Follow-up: Obtain an accessible official copy before sign-off. The existing whole-province use also requires justification beyond a five-city tariff.

Evidence: [Registered source](https://www.gdsx.gov.cn/sgsxgdj/attachment/0/272/272080/2734391.pdf).

### shandong_tariff_2025_03

Result: **discrepancy**. Original first-pass status: verified.

Access: Government tariff table and notes read in full.

Locator: March 2025 two-part table, voltage rows.

CNY 0.67486875/kWh and 35.2/kW-month belong to 35 kV to below 110 kV. At 110 kV to below 220 kV the energy rate is 0.65986875. The register's 35–110 kV label obscures the excluded upper endpoint.

Follow-up: Correct the voltage label or use the actual 110 kV row if that is the chosen common voltage; also account for time-of-use before claiming a standardized bill.

Evidence: [Registered source](https://www.yantai.gov.cn/art/2025/3/20/art_70253_3244147.html).

### hydroquebec_rate_lg_2025

Result: **qualified**. Original first-pass status: verified.

Access: Original rate-book URL geographically restricted; official Gazette tariff tables read.

Locator: Gazette officielle du Québec, 30 April 2025, PDF 12/printed 1453 and PDF 21/printed 1462.

Official Gazette tables confirm Rate LG CAD 15.963/kW-month, 0.04165/kWh and the 3.0063 high-voltage credit for 80 kV to below 170 kV, applicable 1 April 2025. These terms do not establish that all Montreal capacity qualifies for that rate and voltage credit.

Follow-up: Retain alternate official evidence. Check facility eligibility and voltage before classifying all 229.5 MW as strict tariff-covered capacity.

Evidence: [Registered source](https://www.hydroquebec.com/data/documents-donnees/pdf/electricity-rates.pdf?v=HT-2025-v3); [Supporting evidence 1](https://www.publicationsduquebec.gouv.qc.ca/fileadmin/gazette/pdf_encrypte/gaz_entiere/2518-A.pdf).

### hydroquebec_datacenter_classes_2026

Result: **qualified**. Original first-pass status: verified.

Access: Downloaded one-page regulator filing; member table checked.

Locator: 15 April 2026 coalition-member current-tariff table.

The named operators and M/LG classes match. This is a coalition filing describing current classes in April 2026, not proof of their 2025 classes, connection voltages or the share of Montreal's 229.5 MW served under each class.

Follow-up: Do not use this alone to certify the entire Montreal block as 2025 strict tariff evidence; obtain dated operator/capacity and voltage evidence.

Evidence: [Registered source](https://www.regie-energie.qc.ca/fr/participants/dossiers/R-4333-2026/doc/R-4333-2026-C-Coalition-0009-DemInterv-Annexe-2026_04_15.pdf).

### eia_industrial_prices_2025

Result: **discrepancy**. Original first-pass status: verified.

Access: Broken registered URL checked; official archived PDF downloaded and table read.

Locator: Archived February 2026 Electric Power Monthly, PDF 138, Table 5.6.B, industrial December-2025 YTD column.

All seven stored values match: TX 6.55, VA 9.45, OH 8.52, GA 7.81, AZ 8.10, IL 10.14 and IN 8.89 cents/kWh. The registered current_month URL now redirects to EIA's homepage. The table labels 2025 values preliminary estimates, not final statistics.

Follow-up: Replace the dead citation with the dated archive and label values preliminary industrial averages. They do not establish data-centre customer classification.

Evidence: [Registered source](https://www.eia.gov/electricity/monthly/current_month/february2026.pdf); [Supporting evidence 1](https://www.eia.gov/electricity/monthly/archive/february2026.pdf).

### federal_reserve_fx_2025

Result: **confirmed**. Original first-pass status: verified.

Access: Official annual-release table read.

Locator: 5 January 2026 release, 2025 Canada/China/United Kingdom column.

CNY 7.1875/USD, CAD 1.3973/USD and USD 1.3192/GBP match. Inverting the sterling convention yields about GBP 0.758035173/USD.

Follow-up: Retain the explicit inverse. Prefer a dated archival release over the mutable current URL for long-term reproducibility.

Evidence: [Registered source](https://www.federalreserve.gov/releases/g5a/current/).

### nvidia_gb200_spec

Result: **qualified**. Original first-pass status: verified.

Access: Vendor specification table and footnote read.

Locator: GB200 NVL72 Specs, FP16/BF16 row and footnote 2.

360 sparse PFLOP/s and half that for dense operation support the derived 180 PFLOP/s. This is theoretical peak hardware throughput; the vendor page is undated.

Follow-up: Keep dense versus sparse explicit and do not present the result as measured model-serving throughput.

Evidence: [Registered source](https://www.nvidia.com/en-us/data-center/gb200-nvl72/).

### nvidia_gb200_power

Result: **qualified**. Original first-pass status: verified.

Access: Versioned vendor documentation read.

Locator: Example 1, full-load rack components; page footer.

The approximate 120 kW example includes nodes and switches at full load. It is engineering guidance, not a metered benchmark. The current version's footer says last updated 16 July 2026; it does not establish the stored March-2026 publication month.

Follow-up: Record the observable document-version date separately from an unconfirmed original publication date; keep power labelled approximate.

Evidence: [Registered source](https://docs.nvidia.com/mission-control/docs/systems-administration-guide/2.1.0/prs/faq.html).

### huawei_cloudmatrix_performance

Result: **qualified**. Original first-pass status: verified.

Access: Vendor keynote article read.

Locator: Paragraph describing the March 2025 Atlas 900 A3 launch.

384 Ascend 910C chips and up to 300 PFLOP/s match. The paragraph does not specify arithmetic precision; CloudMatrix cloud services and the Atlas hardware are related but distinct descriptions.

Follow-up: Retain vendor peak-performance attribution; identify SemiAnalysis, rather than this paragraph alone, as support for dense-BF16 precision.

Evidence: [Registered source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech).

### semianalysis_cloudmatrix_power

Result: **qualified**. Original first-pass status: verified.

Access: Public portion of original engineering article read.

Locator: 16 April 2025 article, drawback paragraph before paywall.

The public text reports 4.1 times system power and 2.5 times power per dense-BF16 FLOP. 4.1 divided by 300/180 is about 2.46, consistent with rounding to 2.5; the subtitle instead rounds efficiency to 2.6. These are analyst estimates, not controlled metering.

Follow-up: Use the 2.5 multiplier only as an engineering sensitivity scenario; preserve rounding and measurement uncertainty.

Evidence: [Registered source](https://newsletter.semianalysis.com/p/huawei-ai-cloudmatrix-384-chinas-answer-to-nvidia-gb200-nvl72).

### bis_china_policy_2026

Result: **qualified**. Original first-pass status: verified.

Access: BIS press release read in full.

Locator: 13 January 2026 licensing-policy announcement.

The release supports case-by-case review for H200, MI325X and similar products. It is a 2026 policy announcement, not a standalone record of rules effective during 2025. The press-release text does not contain the numerical performance thresholds claimed by the locator.

Follow-up: Cite the operative rule and 2025 rules separately before describing this as a factual 2025 export-restriction boundary; keep the curve a technology scenario.

Evidence: [Registered source](https://media.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china).

### guian_capacity_2025

Result: **qualified**. Original first-pass status: verified.

Access: Search-indexed government response read; live page timed out.

Locator: Response dated 27 May, published 3 June 2025; January–February capacity paragraph.

137,400 powered-on racks and 1.4449 million planned standard racks are separate figures. The response also distinguishes commissioned, under-construction and planned centres. Powered-on racks are not the same boundary as commissioned design racks.

Follow-up: Keep excluded from like-for-like chart widths and retain the January–February observation period.

Evidence: [Registered source](https://www.guiyang.gov.cn/zwgk/zwgkzdlyxxgkjyta/zwgkzdlyxxgkjytazxtawfws/zwgkzdlyxxgkjytazxtawfwsqs/202506/t20250603_87956837.html).

### guian_price_target_2025

Result: **qualified**. Original first-pass status: verified.

Access: Search-indexed table from registered official budget PDF; live URL returned 404.

Locator: Printed page 40, project 52000022P00846010008H.

The budget performance table sets a data-centre electricity-price quality target at no more than CNY 0.35/kWh. It does not demonstrate the achieved bill or that all facilities received this price.

Follow-up: Keep excluded from observed-price scenarios and improve the locator to the project row and printed page.

Evidence: [Registered source](https://nyj.guizhou.gov.cn/zwgk/xxgkml/zdlyxx/czzj/202503/P020250307503578350701.pdf).

### shanxi_tariff_2026_04

Result: **not verified**. Original first-pass status: verified.

Access: Browser retrieval returned HTTP 403; web reader exposed no tariff content.

Locator: Registered 110 kV row inaccessible.

The source could not be reread, so this pass did not confirm the numeric transcription or document date.

Follow-up: Keep excluded. Obtain the original utility notice before independently verifying this candidate; a 2026 effective tariff is outside the chart period regardless.

Evidence: [Registered source](https://energydc.cn/policy/sx/2026-04/cbe2e026-2c0e-11f1-9e60-f679c2336431).

### shanghai_source_mismatch

Result: **not verified**. Original first-pass status: not_verified.

Access: Downloaded scanned PDF; title page visually inspected.

Locator: PDF 1, Shanghai development-reform notice [2025]31.

The inspected document is a general notice about grid-company proxy purchasing, not an identified June-2025 tariff table. This pass did not establish support for CNY 0.7484/kWh; visual inspection of the cover alone does not prove the number is absent from every page.

Follow-up: Keep excluded until an exact effective-month numeric row is supplied. Do not upgrade an absence-of-evidence check to numeric verification.

Evidence: [Registered source](https://www.shanghai.gov.cn/cmsres/8d/8dbc9d8c392e43b791295f493f1d247e/5b1658885ab19ab927050e05dfbb83f9.pdf).

### knight_frank_global_capacity_2025

Result: **qualified**. Original first-pass status: verified.

Access: Publisher article read in full.

Locator: 8 April 2026 article, Demand shock section.

The 62 GW 2025 headline is present, but no matching country table or clear reconciliation to this project's mixed source boundaries is supplied. JLL's 39 GW North America plus China's derived 26.075 GW already exceed 62 GW before other countries.

Follow-up: Keep 62 GW as an external indicative benchmark only. The resulting 92.1% ratio is not independently verified global coverage.

Evidence: [Registered source](https://www.knightfrank.co.uk/research/article/2026/4/artificial-intelligence-trillion-dollar-question).

### knight_frank_global_forecast_2025

Result: **discrepancy**. Original first-pass status: verified.

Access: Downloaded PDF; global map visually inspected and all 38 labels compared.

Locator: PDF 3 / printed pages 4–5, Global Forecasts map and note.

All 38 stored 2025 market labels and the 55,646 MW total match. The linked file has six PDF pages, so the registered PDF pages 46–47 locator is wrong. This is an early-2025 forecast, not a retrospective year-end observation.

Follow-up: Correct the locator; continue using these forecasts only for indicative research gaps, never as observed 2025 chart widths.

Evidence: [Registered source](https://content.knightfrank.com/research/2960/documents/en/data-centres-global-forecast-report-2025-11877.pdf).

### dcbyte_canada_live_2025

Result: **qualified**. Original first-pass status: verified.

Access: Original DCD reporting and linked DC Byte publisher page read.

Locator: DCD 25 September 2025 report, Q2 live-capacity paragraph; DC Byte 24 September spotlight.

DCD reports 1.4 GW live IT capacity in Q2 and distinguishes it from nearly 9 GW of pipeline. DC Byte's public page confirms the overall >10 GW pipeline-inclusive framing and 93% hub concentration, but does not expose a 1.4 GW live table.

Follow-up: Retain the secondary-source attribution and Q2 date. Do not apply the 93% pipeline-inclusive concentration claim as a verified live-only distribution.

Evidence: [Registered source](https://www.datacenterdynamics.com/en/news/canadian-data-center-market-to-see-exponential-growth-pipeline-almost-9gw-dc-byte/); [Supporting evidence 1](https://www.dcbyte.com/market-spotlights/canada-data-centre-market-spotlight-2025/).

### uk_dsit_regional_capacity_2024

Result: **confirmed**. Original first-pass status: verified.

Access: Official methodology and all regional table rows read.

Locator: Methodology and parliamentary-answer regional table.

All 11 rows match and sum to 1,566 MW: North East 17, North West 52, Yorkshire/Humber 16, East Midlands 9, West Midlands 15, East of England 44, London 1,048, South East 128, South West 53, Wales 154, Scotland 30. The source explicitly calls these autumn-2024 modelled maximum IT-load estimates for colocation.

Follow-up: Keep the 2024 vintage, modelled status and exclusions of enterprise facilities and Northern Ireland visible.

Evidence: [Registered source](https://www.gov.uk/government/publications/estimate-of-data-centre-capacity-great-britain-2024/estimate-of-data-centre-capacity-great-britain-2024).

### knight_frank_india_capacity_2025

Result: **confirmed**. Original first-pass status: verified.

Access: Downloaded PDF; introduction, map and definition checked.

Locator: PDF 5, end-2025 statement; PDF 6, city map and live-capacity note.

NCR 174.5, Mumbai 766.6, Pune 145.3, Hyderabad 151.4, Bengaluru 169.5, Chennai 191.5 and Kolkata 23.1 MW match, totaling 1,621.9 MW. The definition is built IT capacity available to lease, and the introduction explicitly states end-2025.

Follow-up: Retain this commercial live-capacity boundary; do not label it a complete inventory of enterprise and self-built facilities.

Evidence: [Registered source](https://content.knightfrank.com/research/3111/documents/en/india-data-centre-market-update-2025-12895.pdf).

### uk_desnz_nondomestic_price_2025

Result: **qualified**. Original first-pass status: verified.

Access: Official performance report and update history read.

Locator: Average electricity/gas prices table, 2025 non-domestic electricity column.

24.3 pence/kWh is supported as a provisional 2025 all-size-band non-domestic average including Climate Change Levy. This is national, not a measured regional or data-centre price.

Follow-up: Retain the national-proxy and provisional labels; the source does not establish that it is a conservative upper bound for every region.

Evidence: [Registered source](https://www.gov.uk/government/publications/desnz-annual-report-and-accounts-2025-to-2026/performance-report).

### saudi_capacity_2025

Result: **discrepancy**. Original first-pass status: partial.

Access: SPA page read in browser; article body recovered from page output.

Locator: Operational-capacity paragraph and following Q1-2026 paragraph.

440 MW operational in 2025 is supported, but the article also reports Q1-2026 capacity of 467 MW. The register's publication year 2025 is therefore inconsistent with the document. IT versus facility power remains unspecified.

Follow-up: Correct the publication metadata after verifying the article date; retain the 2025 observation and exclusion for unresolved power boundary.

Evidence: [Registered source](https://www.spa.gov.sa/ar/w2575816).

### saudi_tariff

Result: **not verified**. Original first-pass status: partial.

Access: Regulator URL attempted in browser and web reader.

Locator: Cloud-computing category could not be reread.

The regulator page timed out and no qualifying tariff table or effective date was recovered. USD 0.048/kWh was not independently verified in this pass.

Follow-up: Keep excluded; obtain a dated regulator tariff, eligibility conditions and the explicit SAR-to-USD conversion.

Evidence: [Registered source](https://sera.gov.sa/en/consumer/electric-tariff/electric-tariff-categories/consumption-tariff).

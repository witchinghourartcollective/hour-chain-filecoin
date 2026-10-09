# FedRAMP — what it actually requires (small-org view)

**Audience:** Fletcher Vaughn / Witching Hour / Chief of Staff  
**Written:** 2026-09-27 (EDT)  
**Policy:** FedRAMP **deferred** until a named federal buyer (or an equally concrete use case). This note is readiness literacy, not a go-spend order.

---

## What FedRAMP is (and is not)

**Is:** A U.S. government program that assesses and certifies **cloud service offerings (CSOs)** so federal agencies can reuse security-assessment work. Certification applies to a **specified offering**, not to “the company is FedRAMP.”

**Is not:**

- An Authority to Operate (ATO) for every agency’s system — each agency still authorizes *its* use of the service in *its* information system  
- A GitHub repo that mirrors Marketplace JSON / marketplace data (those are data, not an ATO)  
- A SOC 2 sticker, a GRC SaaS subscription, or a binder of policies bought from a consultant  
- Automatically the same as **CMMC** (see below)

---

## High-level requirements for a small org

Regardless of path (legacy Rev5 Agency Certification vs FedRAMP **20x Program Certification**), expect roughly this shape of work:

1. **Define the CSO boundary** — What exactly is the cloud product federal users would consume? What is in scope vs out (apps, wallets, Filecoin nodes, creator pilots, Mirrorizm storefronts)?  
2. **Impact / class** — Match the sensitivity of federal data the offering would handle (Low/Moderate/High historically; 20x uses certification classes such as A/B/C/D). Higher class ⇒ more evidence and cost.  
3. **Security controls + evidence** — Implement and continuously demonstrate controls (Rev5 baseline packages historically; 20x emphasizes Key Security Indicators / persistent validation).  
4. **Independent assessment** — Typically a FedRAMP-recognized assessor / 3PAO (timing and exact role depend on class and path). Assessor queues and fees are non-trivial for a cash-tight org.  
5. **Marketplace presence** — Under Consolidated Rules for 2026, providers generally need an **Initial Implementation Phase** Marketplace listing before applying for certification; listing requires demonstrating intended **direct or indirect agency use**, continuous progress (at least quarterly), and (for Class B/C/D) a scheduled assessment within **2 years** of initial listing.  
6. **Ongoing monitoring** — Certification is not a one-time PDF; expect continuous validation / monitoring obligations.

**Money truth:** Even with process modernization, FedRAMP is engineering + process + assessor time. For Witching Hour today, that is **out of band** until revenue and a buyer exist.

---

## Why “named federal buyer” still matters

FedRAMP **20x** is designed so providers can pursue **Program Certification** and work more directly with FedRAMP, reducing dependence on legacy **agency sponsorship**. Legacy sponsored Rev5 Agency Certifications are being wound down (FedRAMP stops accepting new sponsored Agency Certification applications on **2026-06-11** per current sponsorship rules; agencies are steered toward 20x for new work).

That does **not** mean “no buyer needed”:

| Fact | Implication for Fletcher |
| --- | --- |
| Marketplace Initial Implementation listing requires **direct or indirect agency use** intent | Listing without a plausible federal use case is theater |
| Certification ≠ every agency’s ATO | A named customer still decides whether to use you |
| Continuous progress + 2-year assessment schedule | Listing starts a clock and quarterly homework |
| Assessor / engineering cost | Buy first (or clear LOI), then spend |
| Prior FedRAMP GitHub “marketplace” repos | Look like **marketplace data forks**, not an ATO — do not treat them as compliance |

**Named federal buyer** (or a written use case from a program office / lab that will put federal information into your CSO) is the gate that makes boundary, class, and spend decisions rational. Until then: document literacy only.

---

## CMMC vs FedRAMP (do not confuse)

| | **FedRAMP** | **CMMC** |
| --- | --- | --- |
| Who it’s for | Cloud service providers selling **to federal agencies** (and CSOs in that ecosystem) | Mostly **DoD contractors / subcontractors** in the defense supply chain |
| What is assessed | A **specific cloud service offering** | Often the contractor’s **environment** handling FCI/CUI |
| Typical trigger | Agency wants to use your SaaS/IaaS/PaaS with federal info | DoD contract clauses (e.g. DFARS / CMMC program rules) |
| Overlap | DoD contractors using external cloud for CUI often need that CSP to meet **FedRAMP Moderate** (or DoD-defined equivalency) under DFARS 252.204-7012 | That does **not** mean Witching Hour needs CMMC tomorrow |

**For this pack:** Assume Fletcher’s near-term question is **FedRAMP-for-federal-cloud**, not CMMC-for-DoD-prime. Do not buy CMMC tooling “just in case.” If a future DoD subcontract appears, reopen the question with counsel.

Industry reporting also notes that **FedRAMP 20x Class C may not currently satisfy CMMC / DFARS 7012** expectations that were built around Rev5 Moderate — another reason not to chase a class without a buyer’s written requirement.

---

## What NOT to do yet (anti-theater)

- Buy GRC platforms, continuous-monitoring suites, or “FedRAMP in a box” retainers  
- Hire a 3PAO or start a paid gap assessment with no CSO boundary and no buyer  
- Apply for Marketplace Initial Implementation listing with no federal use case (starts clocks)  
- Confuse SOC 2 / ISO marketing with FedRAMP certification  
- Treat scraped FedRAMP Marketplace GitHub datasets as authorization evidence  
- Expand product scope “for federal” (classified handling, IL4/IL5 fantasies) before commercial evidence layer works  
- Spend cloud credits solely to look FedRAMP-shaped while Filecoin #2182 is still the funding priority  

---

## Affordable staged readiness ladder

Spend ≈ **$0** until Stage 3 is unlocked by a named buyer or clear LOI.

### Stage 0 — Now (literacy)
- Read this file + FedRAMP sponsorship / Marketplace rules pages  
- Keep FedRAMP **off** the critical path while Filecoin #2182 and Mirrorizm revenue run  

### Stage 1 — Docs on disk (near-zero cost)
- One-page **system inventory**: what runs where (Base, Filecoin evidence, apps, wallets, Mirrorizm)  
- Draft **authorization boundary sketch**: proposed CSO vs explicitly out-of-scope  
- Data classes: public creator metadata vs anything that could become federal CUI/FCI (today: assume none federal)  
- Roles: who would be Authorizing Official counterparts *if* a buyer appeared (internal owner = Fletcher)  

### Stage 2 — Engineering hygiene (still cheap)
- MFA everywhere that matters; secret hygiene; least privilege on cloud accounts  
- Basic logging / backup story for the evidence path  
- SECURITY.md + incident contact already in public repos — keep accurate  
- Prefer building on clouds that already publish FedRAMP-authorized *infrastructure* you can inherit later (decision deferred; no credits chase that blocks Filecoin)  

### Stage 3 — Only after named federal buyer
- Confirm required path: **20x Program Certification** class vs any remaining Rev5 path  
- Confirm whether buyer accepts 20x for their ATO decision  
- Then: formal SSP-class docs / KSI mapping, assessor quotes, Marketplace listing, cloud credits sized to the CSO  

### Stage 4 — Maintain
- Continuous validation, quarterly Marketplace progress narrative, change control on boundary  

---

## Decision rule (fridge magnet)

> **No named federal use of a defined CSO → no FedRAMP spend.**  
> Domain literacy and Stage 1–2 hygiene are allowed; GRC theater is not.

---

## Sources

- FedRAMP sponsoring (legacy agency path; 20x preference; June 11, 2027 cutoff): https://fedramp.gov/2026/agencies/sponsoring/  
- Marketplace listing / Initial Implementation / agency use / 2-year assessment: https://fedramp.gov/2026/providers/implement/marketplace/marketplace-listing/  
- M-24-15 authorization process (preview / consolidated rules context): https://preview.fedramp.gov/2026/authority/m-24-15/process/  
- CMMC vs FedRAMP (industry explainer): https://www.huntress.com/cmmc-compliance-guide/cmmc-vs-fedramp  
- DFARS 252.204-7012 / FedRAMP Moderate for cloud handling CUI (context): https://www.cmmcaudit.org/fedramp-equivalent-memo-released/  

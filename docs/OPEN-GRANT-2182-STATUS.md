# Filecoin Open Grant #2182 — Status

**Checked:** Sunday 2026-09-27 (EDT)  
**Workstream:** Fletcher Vaughn / Witching Hour / hOUR Chain (Chief of Staff)  
**Scope:** Public status only. No emails, messages, or GitHub comments were sent.

## Verified status

| Field | Value |
| --- | --- |
| Issue | [filecoin-project/devgrants#2182](https://github.com/filecoin-project/devgrants/issues/2182) |
| Title | Open Grant Proposal: hOUR Chain — Verifiable Creator-Rights Evidence on Filecoin |
| State | **OPEN** |
| Labels | `Open Grant` only |
| Assignees | None |
| Award / acceptance signal | **None public** (no award label, no reviewer comments, `closed_at` null) |
| Filed | 2026-09-06 02:21 UTC (~2026-09-05 22:21 EDT) by `witchinghourartcollective` |
| Last issue activity | 2026-09-12 08:16 UTC (~04:16 EDT) — proposer update only |
| Ask | **$50,000** across **4 milestones** ($8k / $15k / $15k / $12k) — still accurate vs proposal body |
| Contact on proposal | fletchervaughn@witchinghourmac.com |
| Delivery repo | [witchinghourartcollective/hour-chain-filecoin](https://github.com/witchinghourartcollective/hour-chain-filecoin) |

## Timeline vs Open Grants SLA

Per [Open Grants README](https://github.com/filecoin-project/devgrants/blob/master/Program%20Resources/Open%20Grants%20README.md) (post–2024-12-01 process):

- Preliminary review update: aim **within 2 weeks** of submission → ~**2026-09-20**
- Final decision: generally **within 4 weeks** → ~**2026-10-04**
- No grant-funded work until OSS Grant Agreement signed by both parties

As of 2026-09-27 (~**21 days** after filing):

- **Preliminary-review window is overdue** (~1 week past the 2-week aim).
- Final-decision window still open (~1 week remaining to the 4-week aim).
- Proposal roadmap assumes agreement executed by **2026-10-31**; milestone dates shift if contracting slips.

## Public engagement on #2182

- **1 comment total**, from the proposer (`witchinghourartcollective`) on 2026-09-12 announcing that `hour-chain-filecoin` is live (MIT/Apache-2, architecture, privacy boundaries, initial verifier + tests).
- **Zero comments** from Filecoin Foundation / grants reviewers / assignees.
- Reactions: none.

## Delivery repo activity (`hour-chain-filecoin`)

| Fact | Detail |
| --- | --- |
| Created | 2026-09-06 19:03 UTC |
| Last push | 2026-09-06 19:05 UTC |
| Commits | 13, all on creation day (init → docs → evidence-bundle + tests) |
| Since then | **~21 days of silence** (no further commits, issues, or PRs) |
| Contents | Dual license, README, SECURITY, CONTRIBUTING, `docs/`, `src/` evidence-bundle + verifier, `test/`, `package.json` |
| Status in README | Explicit pre-funding baseline; Filecoin/Synapse/Calibration/pilot marked as planned grant milestones |

Contrast: parent protocol repo [hOUR-Chain](https://github.com/witchinghourartcollective/hOUR-Chain) remains active (last commit 2026-09-21: pilot/funding baseline + post-quantum signature suite work).

GitHub tools used as `witchinghourartcollective` (`user-GitHub-xai` / `cursor-github`). Repo is public; authenticated identity matches the grant proposer account. No write actions taken.

## Blockers / risks

1. **No public reviewer signal** — cannot tell from GitHub alone whether the proposal is in queue, waiting on private email, or stalled.
2. **SLA slip on preliminary reply** — polite chase is justified; aggressive chase is not.
3. **Delivery repo looks frozen** while hOUR-Chain moves — reviewers who click through may underrate momentum unless the Filecoin boundary shows recent life (without claiming grant-funded execution before contract).
4. **No technical sponsor** assigned on the issue (proposal invited one).
5. **Do not start Milestone 1–4 as “grant work”** until the agreement is signed; keep any prep clearly marked pre-funding / unfunded.

## Concrete next actions for Fletcher

Priority order (Filecoin first per override):

1. **Email `grants@fil.org`** (from `fletchervaughn@witchinghourmac.com`) — short status ping: link #2182, note filing date, note 2-week preliminary-review aim passed, ask for timeline / any questions / whether a technical sponsor is being assigned. **Do not** re-pitch the whole proposal.
2. **Optional parallel:** one short comment on #2182 asking for preliminary-review status (same tone; keep public record). Draft only until Fletcher authorizes posting.
3. **Optional:** Filecoin Slack `#grants-help` for routing/process questions (same facts, no pressure).
4. **Delivery-repo signal (careful):** if there is genuine unfunded polish already done (docs clarity, CI for existing tests, README “last checked” note pointing at #2182), a small public commit shows the module is alive — **without** representing Synapse/Calibration pilot work as grant progress.
5. **Hold ladder:** do not divert primary chase energy to Base/Microsoft/Google credits until Filecoin replies or the ~4-week decision window clearly passes without signal; then reassess.
6. **Contract readiness:** entity docs, dual-license confirmation, and milestone acceptance criteria already in the issue body — keep them ready for a fast signature path if accepted around early October.
7. **After decision:** if awarded → sign before coding grant milestones; if declined or silent past ~2026-10-11 → document outcome in this STATUS file and activate next ladder rungs (credits) while keeping Filecoin relationship polite.

## Sources

- https://github.com/filecoin-project/devgrants/issues/2182  
- https://github.com/filecoin-project/devgrants/blob/master/Program%20Resources/Open%20Grants%20README.md  
- https://github.com/witchinghourartcollective/hour-chain-filecoin  
- https://github.com/witchinghourartcollective/hOUR-Chain  
- https://devgrantsdaily.com/items/2026-09-19-filecoin-open-grants/ (program still active / rolling as of mid-Sep 2026)

## Agent constraints honored

- No external email, Slack, or GitHub comment/send.  
- Drafts only on disk under `/workspace/funding/`.  
- Not pushed to GitHub.

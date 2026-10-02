# Funding — hOUR Chain

**Witching Hour Music**  
**Contact:** fletchervaughn@witchinghourmac.com · [witchinghourmac.com](https://witchinghourmac.com)  
**Published for review:** 2026-09-27

---

## Headline ask

**Filecoin Foundation Open Grant track — ~$50,000 / four milestones** for verifiable creator-rights evidence on Filecoin ([devgrants#2182](https://github.com/filecoin-project/devgrants/issues/2182)). Delivery repo: [`hour-chain-filecoin`](https://github.com/witchinghourartcollective/hour-chain-filecoin).

---

## What hOUR Chain is

hOUR Chain is creator-rights infrastructure: provenance, access, and settlement for music and other recorded creative work. It models creator identity, works and recordings, contributor and rights-split graphs, signed provenance events, access credentials, agent permissions, and settlement instructions — so the hours behind creative work become attributable, licensable, and auditable instead of trapped in private chats and cloud folders.

**Phase 1 stack**

- **Base** — payments/settlement and canonical EVM records (planned)  
- **Solana** — primary chain for contributor approvals/consent and attestations, in progress in [`hour-chain-solana`](https://github.com/witchinghourartcollective/hour-chain-solana) (hOUR Chain ADR-0004)  
- **Lightning adapter** — planned payment rail  
- **Filecoin** — durable, retrievable evidence layer (Open Grant #2182)  
- **Post-quantum-native design** — signature suites and envelopes built so algorithms stay replaceable under governance; no component claims end-to-end PQC while a settlement rail is not

Clients and adapters in the wider Witching Hour stack (Phigit OS, Witching Hour App, live/production surfaces, onchain agent) consume the protocol; grant-funded Filecoin work stays in the public dual-licensed `hour-chain-filecoin` boundary.

---

## Near-term money context

This one-pager is about **grants and cloud/platform credits**.

Separately, **Mirrorizm** (Shopify trial / storefronts and related sites) is a revenue path for merch and brand commerce. It is not the funding vehicle for protocol R&D and should not be conflated with Open Grant milestones or credit applications.

---

## Funding ladder (Fletcher override)

1. **Filecoin first** — Open Grant #2182 (~$50k / 4 milestones) until decided or clearly stalled  
2. **Then credits** — Base, Microsoft, Google (and peers) as relevant for infra, AI, and builder programs  
3. **Product revenue** — Mirrorizm / sites in parallel, not as a substitute for the Filecoin chase

Do not dilute the Filecoin relationship with simultaneous noise pitches while #2182 is still open.

### Milestone sketch (Filecoin #2182)

| # | Focus | Amount |
| ---: | --- | ---: |
| 1 | Spec, licensing boundary, security/privacy design | $8,000 |
| 2 | Filecoin storage/retrieval + verifier (Synapse / Onchain Cloud path) | $15,000 |
| 3 | hOUR Chain SDK hooks, Base mapping, reference workflow | $15,000 |
| 4 | Creator pilot, hardening, docs, final report | $12,000 |
|  | **Total** | **$50,000** |

Grant-funded work does not start until the Open Source Software Grant Agreement is signed by both parties.

---

## DOE interest (partnership track)

Fletcher’s deep reading on highly enriched uranium and the nuclear fuel cycle is treated as a **partnership path into DOE-adjacent collaboration**, not a hiring or employment pitch. The angle is durable, auditable evidence and provenance patterns that could matter for regulated or high-integrity records — explored as partnership conversations when a named federal buyer or lab partner exists. **FedRAMP is deferred** until there is a named federal buyer; no premature compliance theater.

---

## Repos

- Protocol: https://github.com/witchinghourartcollective/hOUR-Chain  
- Filecoin grant delivery: https://github.com/witchinghourartcollective/hour-chain-filecoin  
- Solana consent and attestations: https://github.com/witchinghourartcollective/hour-chain-solana  
- Grant issue: https://github.com/filecoin-project/devgrants/issues/2182  

---

*One-pager for Fletcher / Witching Hour review. Published to `hour-chain-filecoin` on 2026-09-27.*

# hOUR Chain × Filecoin

**Record the art. Protect the rights. Make every hOUR count.**

hOUR Chain is creator-rights infrastructure for music, visual art, film, performance, design, and other recorded creative work. It helps creators register a work, document contributions, preserve evidence, approve rights and splits, and produce auditable ownership and settlement records.

The larger product idea is simple: the hours behind creative work should not disappear into disconnected messages and files. hOUR Chain turns those **hOURS** into attributable value that can be licensed, paid, and settled.

This repository is the public Filecoin integration boundary for hOUR Chain and the delivery repository for [Filecoin Open Grant proposal #2182](https://github.com/filecoin-project/devgrants/issues/2182).


## hOURs and real creative time

**Spending hOURS like currency: make the real hours behind creative work visible, attributable, and compensable.**

The hOUR Chain (HBC) product model connects hOURs to actual hours spent producing, engineering, rehearsing, performing, designing, and doing other creative work. Participants should be able to document their time, attach supporting evidence, mutually approve contributions, and connect approved records to agreed fees, rights splits, or revenue-sharing terms.

An approved hour is a contribution record. Its monetary value and any associated rights depend on the participants' agreement. The time record, rights agreement, payment obligation, and settlement receipt must remain distinct and traceable. This concept does not establish a token conversion rate or change the current token model.

This is a product and implementation requirement; the complete time-recording and approval workflow is not claimed as implemented. See [Real-hours contribution model](https://github.com/witchinghourartcollective/hOUR-Chain/blob/main/docs/TIME-CONTRIBUTIONS.md) for the workflow, integration boundaries, and future GCUL adapter requirements.

## Product workflow

1. A creator registers a song, image, video, performance, design, or other work.
2. Contributor evidence and content-addressed asset references are attached.
3. Contributors review and approve rights or payment splits.
4. Filecoin provides durable evidence storage and retrieval verification.
5. Contributor approvals and settlement records target the Cosmos EVM hOUR Chain L1. The earlier Solana consent/Base payments plan is superseded by [ADR-0005](https://github.com/witchinghourartcollective/hOUR-Chain/blob/main/docs/ADR-0005-cosmos-evm-l1.md); the Solana adapter is paused. The L1 remains a devnet scaffold.

## Why this is a separate repository

All grant-funded specifications, adapters, SDK code, reference applications, tests, deployment tooling, and documentation will live here under an open dual license. Unrelated Witching Hour platform code and private creator data stay outside this repository.

## Current status

This is the public pre-funding baseline. It includes:

- a deterministic evidence-bundle manifest and digest utility;
- a minimal verifier for manifest integrity;
- exact-byte archive checkpoints with linked renewal history and pinned-head integrity verification (see [Evidence renewal](docs/EVIDENCE-RENEWAL.md));
- the proposed system boundary and grant scope; and
- a dependency-free test suite.

Filecoin storage, retrieval, Synapse/Filecoin Onchain Cloud, Calibration, chain hooks, and the creator pilot are planned grant milestones. Checkpoint integrity does not establish signer authenticity, trusted time, or actual Filecoin storage.

## Related repositories

- Protocol: [hOUR-Chain](https://github.com/witchinghourartcollective/hOUR-Chain)
- Filecoin evidence (this repo): [hour-chain-filecoin](https://github.com/witchinghourartcollective/hour-chain-filecoin)
- Solana consent and attestations: [hour-chain-solana](https://github.com/witchinghourartcollective/hour-chain-solana) (pre-alpha)

## Quick start

Requires Node.js 20 or newer.

```bash
npm test
```

Example:

```js
import { createEvidenceBundle, verifyEvidenceBundle } from "./src/index.js";

const bundle = createEvidenceBundle({
  schemaVersion: "0.1.0",
  workId: "hour:work:demo-001",
  workType: "music",
  title: "Example Work",
  createdAt: "2026-09-06T00:00:00.000Z",
  contributors: [{ id: "did:example:creator", role: "producer", shareBps: 10000 }],
  assets: [{ name: "master.wav", cid: "bafy...", mediaType: "audio/wav" }]
});

console.log(bundle.digest);
console.log(verifyEvidenceBundle(bundle));
```

## Grant milestones

| Milestone | Deliverable | Budget |
| --- | --- | ---: |
| 1 | Architecture, schemas, privacy model, and implementation specification | $8,000 |
| 2 | Filecoin storage/retrieval adapter and verifier | $15,000 |
| 3 | SDK, hOUR Chain hooks, Base integration, and reference workflow | $15,000 |
| 4 | Creator pilot, documentation, deployment guidance, and final report | $12,000 |
| **Total** |  | **$50,000** |

See [Grant scope](docs/grant-scope.md) and [Architecture](docs/architecture.md).

## Commercial boundary

The code in this repository is open infrastructure. Commercial products may charge for hosted workflows, creator/organization subscriptions, rights administration, integrations, AI-assisted media operations, pilot implementation, and settlement services. The dual license does not transfer ownership of private creator content or unrelated proprietary platform code.

## Licensing

Licensed at your option under either:

- [Apache License 2.0](LICENSE-APACHE), or
- [MIT License](LICENSE-MIT).

The SPDX expression is `MIT OR Apache-2.0`.

## Contact

Witching Hour Music  
[witchinghourmac.com](https://witchinghourmac.com)  
fletchervaughn@witchinghourmac.com

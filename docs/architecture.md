# Architecture boundary

## Product layers

| Layer | Responsibility | Planned public deliverable |
| --- | --- | --- |
| Creator application | Register work, collect contributors, review evidence, approve rights and splits | Reference workflow only |
| Evidence bundle | Deterministic manifest linking work metadata, contributors, approvals, and content identifiers | Schema, library, CLI, tests |
| Filecoin | Durable storage, retrieval verification, and integrity evidence | Synapse/Filecoin Onchain Cloud adapter; local/test and Calibration support |
| Base | Authorized approvals, settlement actions, and auditable receipts | hOUR Chain hooks and reference integration |
| Private services | Authentication, encrypted creator content, commercial operations, and hosted product features | Interfaces only; unrelated proprietary code excluded |

## Privacy rule

Public integrity proofs must not require publication of private drafts, unreleased media, personal data, wallet secrets, or confidential agreements. The implementation will separate encrypted/private payloads from public content identifiers and authorization receipts.

## Economic framing

“Spend hOURS” describes hOUR Chain's product principle: creative time should become attributable value that can be licensed, paid, or settled. This repository does not announce or issue a public token. Any future token or regulated payment feature requires separate legal, economic, securities, money-transmission, and disclosure analysis.

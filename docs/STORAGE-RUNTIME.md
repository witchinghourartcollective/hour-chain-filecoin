# Filecoin storage runtime

`createFilecoinStorage` wraps an initialized Synapse SDK v2 storage manager. It
checks the SDK's configured chain ID against the explicitly selected network,
requests distinct provider copies, rejects incomplete uploads, and downloads the
same PieceCID to compare the exact byte count and SHA-512 digest. Provider/data-set/
piece IDs are retained in a JSON-safe receipt. This adds executable transport logic;
the test suite uses an injected SDK double and is not a live-network attestation.

The consuming service must install and lock a compatible `@filoz/synapse-sdk`
release and initialize it with a managed transaction signer. The library does not
accept a seed/private key, deposit funds, approve an allowance or set a payment
budget. The ML-DSA event signer and the Filecoin transaction signer have different
responsibilities. Start with Calibration test assets and a capped payment policy.

```js
import { createFilecoinStorage } from '../src/index.js';
const storage = createFilecoinStorage({ synapse, network: 'calibration', copies: 2 });
const receipt = await storage.upload(encryptedEvidenceBytes);
// Save receipt independently before accepting the evidence reference on hOUR Chain.
const originalEncryptedBytes = await storage.retrieve(receipt);
```

Upload success includes an immediate verified retrieval. Subsequent retrieval
requires the independently persisted receipt; trusting a digest fetched alongside
untrusted data defeats the integrity check. The adapter trusts the injected SDK's
chain/commit result and does not independently verify chain proofs or PieceCID
encoding. Add independent confirmation/PDP and retention policy checks in the service.

The bounded input is held in memory; large media needs a separate streaming/encrypted
chunk design. Encrypt private media/evidence before calling this API, store recovery
keys separately, and verify authorized signatures after decrypting. Byte integrity
is not identity, rights approval, trusted time or end-to-end post-quantum security.

## Calibration canary

Provide a local ESM module exporting `createSynapse()` that returns a configured
SDK v2 instance on Calibration (chain ID 314159) using the managed signer. The
module belongs in the private service, never in a public repo if it contains setup
details. SDK initialization must not auto-fund or grant unbounded allowances.

```sh
node scripts/calibration-canary.mjs /secure/managed-synapse-factory.mjs /secure/new-canary-receipt.json
```

The CLI uploads only 256 random public test bytes, requests two copies, verifies
retrieval and writes a mode-0600 receipt without overwriting an existing file.
It can incur testnet storage operations. Re-run retrieval from the saved receipt
after a service restart before marking recovery verified. A partial upload may
already be committed; exceptions preserve `uploadResult` or `receipt` for manual
reconciliation. Do not blindly retry paid uploads. Build durable jobs, deduplication,
retry/backoff, retention renewals and monitoring around the adapter before production.

## Remaining launch gates

- Pinned SDK/managed signer service and funded Calibration payment setup.
- Actual provider commitments and independent confirmation/PDP evidence.
- Encryption/key recovery, durable receipts, renewal and retrieval monitoring.
- hOUR application hooks, consent linkage, Cosmos acceptance and first creator pilot.
- An explicitly selected/verified IBC route if required; this storage API is not IBC.

Solana is an active major consent workstream under hOUR-Chain ADR-0008, alongside
the Cosmos EVM L1, Filecoin archive and existing Base integrations.

Official API references (checked 2026-11-01):
- https://docs.filecoin.cloud/getting-started/
- https://docs.filecoin.cloud/developer-guides/storage/upload-pipeline/
- https://github.com/FilOzone/synapse-sdk/blob/master/packages/synapse-sdk/src/synapse.ts

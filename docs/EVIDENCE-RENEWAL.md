# Evidence archive checkpoints

The exported checkpoint functions preserve signed authorization evidence and
renewal receipts as exact bytes. They link checkpoints with SHA-512 and require
an independently pinned head and retrieval of every referenced artifact. Tests
cover altered bytes, missing history, reordered checkpoints and truncation.

This is an archive integrity boundary. It does not verify the identity of a
signer, establish trusted time, upload to Filecoin or validate a storage receipt.
Run hOUR-Chain's `packages/pqc-profile/src/evidence.mjs` verifier with the
application's authorized key resolver before treating an artifact as authorized.
Verify external timestamp/anchor receipts separately. Archive those receipts,
historical public-key bindings and revocation evidence alongside the signed
record. Never archive private seeds, signing keys or access credentials.

Usage:

```js
import { readFile } from 'node:fs/promises';
import { createArchiveCheckpoint, archiveCheckpointHash } from '../src/index.js';
const content = await readFile('signed-evidence.json');
const checkpoint = createArchiveCheckpoint([{ name: 'signed-evidence.json', content }]);
const head = archiveCheckpointHash(checkpoint);
// Persist the original bytes and checkpoint. Pin head independently.
```

Renew by creating a new checkpoint whose `previous` is the prior head. Old
artifacts remain byte-for-byte intact; no re-signing or rewriting of the original
is implied. A Filecoin CID remains an adapter concern, distinct from this digest.

Current architecture is Cosmos EVM L1 per hOUR-Chain ADR-0005. The earlier Solana
consent/Base settlement plan is superseded; this utility is chain-independent.

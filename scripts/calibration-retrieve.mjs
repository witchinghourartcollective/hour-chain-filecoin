import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createFilecoinStorage } from '../src/index.js';

// Retrieval only: never uploads, rewrites the receipt, or emits evidence bytes.
// The private factory must initialize the SDK without deposits/allowance changes.
const [factoryPath, receiptPath, ...extra] = process.argv.slice(2);
if (!factoryPath || !receiptPath || extra.length) {
  console.error('Usage: node scripts/calibration-retrieve.mjs <managed-synapse-factory.mjs> <saved-receipt.json>');
  process.exitCode = 1;
} else {
  try {
    const record = JSON.parse(await readFile(receiptPath, 'utf8'));
    // Failed/partial uploads require explicit reconciliation, not automatic recovery.
    if (record.status !== 'round-trip-verified' || record.receipt?.network !== 'calibration') {
      throw new Error('A successful Calibration canary receipt is required');
    }
    const { createSynapse } = await import(pathToFileURL(resolve(factoryPath)).href);
    const synapse = await createSynapse();
    const storage = createFilecoinStorage({ synapse, network: 'calibration', copies: 2 });
    await storage.retrieve(record.receipt);
    console.log(JSON.stringify({ checkedAt: new Date().toISOString(),
      network: 'calibration', retrievalVerified: true, uploaded: false,
      retentionVerified: false, pdpVerified: false, creatorWorkflowVerified: false }));
  } catch {
    console.error('Calibration retrieval failed. Check the independently retained receipt, SDK factory and network; no upload was attempted.');
    process.exitCode = 1;
  }
}

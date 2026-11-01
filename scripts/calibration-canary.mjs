import { open } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { randomBytes } from 'node:crypto';
import { createFilecoinStorage } from '../src/index.js';
import { writeReceipt, canaryFailureRecord } from '../src/receipt-file.js';

// The factory owns SDK initialization and managed transaction signing. No raw keys
// are accepted by this CLI. This deliberately only uploads public test bytes.
const [factoryPath, receiptPath] = process.argv.slice(2);
if (!factoryPath || !receiptPath) {
  console.error('Usage: node scripts/calibration-canary.mjs <managed-synapse-factory.mjs> <new-receipt.json>');
  process.exitCode = 1;
} else {
  let file;
  let committedReceipt;
  const write = value => writeReceipt(file, value);
  try {
    const { createSynapse } = await import(pathToFileURL(resolve(factoryPath)).href);
    const synapse = await createSynapse();
    const storage = createFilecoinStorage({ synapse, network: 'calibration', copies: 2 });
    // Refuse to replace a prior receipt, and check writability before any paid upload.
    file = await open(receiptPath, 'wx', 0o600);
    await write({ status: 'started', network: 'calibration', startedAt: new Date().toISOString() });
    committedReceipt = await storage.upload(randomBytes(256));
    await write({ status: 'round-trip-verified', receipt: committedReceipt, checkedAt: new Date().toISOString() });
    console.log('Calibration upload and exact-byte retrieval verified; receipt saved. Retention/PDP and application integration remain separate checks.');
  } catch (error) {
    if (file) await write(canaryFailureRecord(error, committedReceipt));
    console.error('Calibration canary failed. Check signer/network/payment setup and any saved receipt before retrying.');
    process.exitCode = 1;
  } finally {
    await file?.close();
  }
}

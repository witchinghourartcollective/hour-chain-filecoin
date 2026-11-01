import { open } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { randomBytes } from 'node:crypto';
import { createFilecoinStorage } from '../src/index.js';

// The factory owns SDK initialization and managed transaction signing. No raw keys
// are accepted by this CLI. This deliberately only uploads public test bytes.
const [factoryPath, receiptPath] = process.argv.slice(2);
if (!factoryPath || !receiptPath) {
  console.error('Usage: node scripts/calibration-canary.mjs <managed-synapse-factory.mjs> <new-receipt.json>');
  process.exitCode = 1;
} else {
  let file;
  const write = async value => {
    const data = Buffer.from(JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2) + '\n');
    await file.truncate(0);
    await file.write(data, 0, data.length, 0);
    await file.sync();
  };
  try {
    const { createSynapse } = await import(pathToFileURL(resolve(factoryPath)).href);
    const synapse = await createSynapse();
    const storage = createFilecoinStorage({ synapse, network: 'calibration', copies: 2 });
    // Refuse to replace a prior receipt, and check writability before any paid upload.
    file = await open(receiptPath, 'wx', 0o600);
    await write({ status: 'started', network: 'calibration', startedAt: new Date().toISOString() });
    const receipt = await storage.upload(randomBytes(256));
    await write({ status: 'round-trip-verified', receipt, checkedAt: new Date().toISOString() });
    console.log('Calibration upload and exact-byte retrieval verified; receipt saved. Retention/PDP and application integration remain separate checks.');
  } catch (error) {
    if (file) await write({ status: 'failed-reconcile-before-retry', receipt: error.receipt,
      uploadResult: error.uploadResult && {
        pieceCid: error.uploadResult.pieceCid?.toString(), complete: error.uploadResult.complete,
        size: error.uploadResult.size,
        copies: error.uploadResult.copies?.map(({ providerId, dataSetId, pieceId }) => ({ providerId, dataSetId, pieceId })),
      }, checkedAt: new Date().toISOString() });
    console.error('Calibration canary failed. Check signer/network/payment setup and any saved receipt before retrying.');
    process.exitCode = 1;
  } finally {
    await file?.close();
  }
}

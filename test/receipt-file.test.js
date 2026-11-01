import test from 'node:test';
import assert from 'node:assert/strict';
import { writeReceipt, canaryFailureRecord } from '../src/receipt-file.js';

test('receipt persistence handles short writes and rejects zero progress', async () => {
  let result = Buffer.alloc(1000), synced = false;
  await writeReceipt({ async truncate() {}, async write(bytes, offset, length, position) {
    assert.equal(position, offset);
    const count = Math.min(length, 3);
    bytes.copy(result, position, offset, offset + count);
    return { bytesWritten: count };
  }, async sync() { synced = true; } }, { pieceId: 4n });
  assert.equal(synced, true);
  assert.deepEqual(JSON.parse(result.toString().replace(/\0+$/, '')), { pieceId: '4' });
  await assert.rejects(writeReceipt({ async truncate() {}, async write() {
    return { bytesWritten: 0 };
  } }, {}), /no progress/);
});

test('filesystem failure retains the committed receipt for reconciliation', async () => {
  const receipt = { pieceCid: 'committed-cid', copies: [{ providerId: '1' }] };
  let error;
  try { await writeReceipt({ async truncate() {}, async write(_bytes, _offset, length) {
    return { bytesWritten: length };
  }, async sync() { throw new Error('sync failed'); } }, { receipt }); }
  catch (failure) { error = failure; }
  assert.equal(canaryFailureRecord(error, receipt).receipt, receipt);
});

test('partial-upload recovery includes failed provider attempts and copy policy', () => {
  const error = { uploadResult: { pieceCid: 'partial', requestedCopies: 2,
    copies: [{ providerId: 1n, dataSetId: 2n, pieceId: 3n }],
    failedAttempts: [{ providerId: 4n, error: new Error('provider unavailable') }] } };
  const record = canaryFailureRecord(error);
  assert.equal(record.uploadResult.requestedCopies, 2);
  assert.deepEqual(record.uploadResult.failedAttempts, [{ providerId: 4n, error: 'provider unavailable' }]);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { createFilecoinStorage } from '../src/index.js';

function fixture(change = {}) {
  let stored;
  let downloads = 0;
  const storage = {
    async upload(bytes, options) {
      stored = new Uint8Array(bytes);
      assert.equal(options.copies, 2);
      return { pieceCid: { toString: () => 'test-piece-cid' }, size: bytes.length, complete: true,
        copies: [1n, 2n].map((providerId) => ({ providerId, dataSetId: 4n, pieceId: 5n })), ...change };
    },
    async download() { downloads++; return stored; },
  };
  return { storage, downloads: () => downloads, adapter: () => createFilecoinStorage({
    synapse: { storage, chain: { id: 314159 } }, network: 'calibration',
  }) };
}

test('upload waits for complete replicas, round trips exact bytes, and returns a JSON receipt', async () => {
  const f = fixture();
  const original = Buffer.from('signed evidence\r\n');
  const pending = f.adapter().upload(original);
  original.fill(0);
  const receipt = await pending;
  assert.equal(receipt.retrievalVerified, true);
  assert.equal(f.downloads(), 1);
  const restored = JSON.parse(JSON.stringify(receipt));
  assert.deepEqual(Buffer.from(await f.adapter().retrieve(restored)), Buffer.from('signed evidence\r\n'));
});

test('partial or duplicate-provider storage never reports success', async () => {
  for (const change of [{ complete: false }, { size: 99 }, { copies: [] },
    { copies: [1, 1].map(providerId => ({ providerId, dataSetId: 4, pieceId: 5 })) }]) {
    const f = fixture(change);
    await assert.rejects(f.adapter().upload(Buffer.from('test')), error => {
      assert.ok(error.uploadResult);
      return /storage policy/.test(error.message);
    });
    assert.equal(f.downloads(), 0);
  }
});

test('modified and missing downloads fail with a recoverable committed receipt', async () => {
  for (const download of [Buffer.from('tEst'), Buffer.from('tes'), null]) {
    const f = fixture();
    f.storage.download = async () => download;
    await assert.rejects(f.adapter().upload(Buffer.from('test')), error => {
      assert.equal(error.receipt.sdkComplete, true);
      return /retrieval verification failed/.test(error.message);
    });
  }
});

test('network mismatch rejects before retrieval; SDK failures propagate', async () => {
  const f = fixture();
  assert.throws(() => createFilecoinStorage({ synapse: { storage: f.storage, chain: { id: 314 } },
    network: 'calibration' }), /Synapse chain/);
  const receipt = await f.adapter().upload(Buffer.from('test'));
  await assert.rejects(f.adapter().retrieve({ ...receipt, network: 'mainnet' }), /wrong Filecoin network/);
  assert.equal(f.downloads(), 1);
  f.storage.upload = async () => { throw new Error('signer unavailable'); };
  await assert.rejects(f.adapter().upload(Buffer.from('test')), /signer unavailable/);
});

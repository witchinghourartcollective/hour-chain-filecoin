import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

test('fresh-process recovery retrieves exact bytes without uploading or changing the receipt', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hour-retrieval-'));
  try {
    const bytes = Buffer.from('test evidence\r\n');
    const good = { status: 'round-trip-verified', receipt: { version: 1,
      network: 'calibration', pieceCid: 'test-piece', bytes: bytes.length,
      digest: `sha512:${createHash('sha512').update(bytes).digest('hex')}` } };
    const factory = join(dir, 'factory.mjs');
    const receipt = join(dir, 'receipt.json');
    const script = fileURLToPath(new URL('../scripts/calibration-retrieve.mjs', import.meta.url));
    const run = () => spawnSync(process.execPath, [script, factory, receipt], { encoding: 'utf8' });
    for (const [chain, download, record, success] of [
      [314159, bytes.toString('hex'), good, true],
      [314159, Buffer.from('changed').toString('hex'), good, false],
      [314, bytes.toString('hex'), good, false],
      [314159, bytes.toString('hex'), { ...good, status: 'failed-reconcile-before-retry' }, false],
      [314159, bytes.toString('hex'), { ...good, receipt: { ...good.receipt, digest: 'invalid' } }, false],
    ]) {
      await writeFile(factory, `export async function createSynapse() { return { chain: { id: ${chain} }, storage: {
        upload() { throw new Error('UPLOAD MUST NEVER RUN'); },
        async download({pieceCid}) { if (pieceCid !== 'test-piece') throw new Error('wrong CID'); return Buffer.from('${download}', 'hex'); }
      } }; }`);
      const original = JSON.stringify(record);
      await writeFile(receipt, original);
      const result = run();
      assert.equal(result.status, success ? 0 : 1, result.stderr);
      assert.equal(await readFile(receipt, 'utf8'), original);
      if (success) {
        const report = JSON.parse(result.stdout);
        assert.equal(report.retrievalVerified, true);
        assert.equal(report.uploaded, false);
        assert.equal(report.pdpVerified, false);
      } else assert.equal(result.stdout, '');
    }
    await writeFile(receipt, '{malformed');
    assert.equal(run().status, 1);
    const missingArgs = spawnSync(process.execPath, [script], { encoding: 'utf8' });
    assert.equal(missingArgs.status, 1);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

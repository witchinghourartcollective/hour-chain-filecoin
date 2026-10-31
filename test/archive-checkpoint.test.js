import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { archiveCheckpointHash, createArchiveCheckpoint, verifyArchiveChain } from "../src/index.js";

test("raw signed evidence survives archival without reserialization", () => {
  const content = Buffer.from('{ "signed": "original bytes" }\n');
  const receipt = Buffer.from("opaque renewal receipt\n");
  const a = createArchiveCheckpoint([{ name: "evidence.json", content }]);
  const b = createArchiveCheckpoint([{ name: "renewal.bin", content: receipt }], { previous: archiveCheckpointHash(a) });
  const policy = { expectedHead: archiveCheckpointHash(b), resolveArtifact: ({ name }) => name === "evidence.json" ? content : receipt };
  assert.deepEqual(verifyArchiveChain([a, b], policy), { ok: true, head: policy.expectedHead, authenticityVerified: false, timeAnchored: false });
  assert.equal(verifyArchiveChain([a], policy).ok, false);
  assert.equal(verifyArchiveChain([b, a], policy).ok, false);
  assert.equal(verifyArchiveChain([a, b], { ...policy, resolveArtifact: () => Buffer.from("tampered") }).ok, false);
  assert.equal(verifyArchiveChain([a, b], { ...policy, resolveArtifact: async () => content }).ok, false);
  assert.equal(verifyArchiveChain([a, b], {}).ok, false);
  assert.throws(() => createArchiveCheckpoint([{ name: "x", content }, { name: "x", content }]), /duplicate/);
  assert.throws(() => createArchiveCheckpoint([{ name: "x", content: "not bytes" }]), /bytes/);
});

test("rejecting asynchronous artifact resolvers fail without an unhandled rejection", () => {
  const script = `
    import assert from 'node:assert/strict';
    import { archiveCheckpointHash, createArchiveCheckpoint, verifyArchiveChain } from './src/index.js';
    const content = Buffer.from('original bytes');
    const checkpoint = createArchiveCheckpoint([{ name: 'record', content }]);
    for (const resolveArtifact of [
      async () => content,
      async () => { throw new Error('download failed'); },
      () => ({ then(resolve, reject) { reject(new Error('thenable failed')); } }),
    ]) {
      const result = verifyArchiveChain([checkpoint], { expectedHead: archiveCheckpointHash(checkpoint), resolveArtifact });
      assert.equal(result.ok, false);
      assert.match(result.error, /Async artifact resolvers are unsupported/);
    }
    await new Promise(resolve => setImmediate(resolve));
  `;
  const child = spawnSync(process.execPath, ['--unhandled-rejections=strict', '--input-type=module', '-e', script], { encoding: 'utf8' });
  assert.equal(child.status, 0, child.stderr);
});

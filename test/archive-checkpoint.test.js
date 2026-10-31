import test from "node:test";
import assert from "node:assert/strict";
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

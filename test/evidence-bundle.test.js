import assert from "node:assert/strict";
import test from "node:test";

import {
  createEvidenceBundle,
  digestManifest,
  verifyEvidenceBundle
} from "../src/index.js";

const manifest = {
  schemaVersion: "0.1.0",
  workId: "hour:work:test-001",
  workType: "visual-art",
  title: "Test Work",
  createdAt: "2026-09-06T00:00:00.000Z",
  contributors: [{ id: "did:example:artist", role: "artist", shareBps: 10000 }],
  assets: [{ name: "art.png", cid: "bafy-test", mediaType: "image/png" }]
};

test("digest is independent of object key order", () => {
  const reordered = {
    title: manifest.title,
    assets: manifest.assets,
    workType: manifest.workType,
    contributors: manifest.contributors,
    workId: manifest.workId,
    createdAt: manifest.createdAt,
    schemaVersion: manifest.schemaVersion
  };

  assert.equal(digestManifest(manifest), digestManifest(reordered));
});

test("valid evidence bundle verifies", () => {
  const bundle = createEvidenceBundle(manifest);
  assert.deepEqual(verifyEvidenceBundle(bundle), { ok: true, digest: bundle.digest });
});

test("changed evidence fails verification", () => {
  const bundle = createEvidenceBundle(manifest);
  bundle.manifest.title = "Changed Work";
  assert.equal(verifyEvidenceBundle(bundle).ok, false);
});

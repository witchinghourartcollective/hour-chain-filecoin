import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { createEvidenceBundle } from "../src/index.js";

test("offline CLI reports integrity without revealing manifest values", async () => {
  const dir = await mkdtemp(join(tmpdir(), "hour-verify-"));
  try {
    const path = join(dir, "bundle.json");
    const bundle = createEvidenceBundle({ schemaVersion: "0.1.0", workId: "test",
      workType: "test", title: "PRIVATE_SENTINEL", createdAt: "2026-11-10",
      contributors: [{}], assets: [] });
    const run = () => spawnSync(process.execPath, ["src/verify-cli.js", path], { encoding: "utf8" });
    await writeFile(path, JSON.stringify(bundle));
    let result = run();
    assert.equal(result.status, 0);
    assert.equal(JSON.parse(result.stdout).ok, true);
    assert.ok(!result.stdout.includes("PRIVATE_SENTINEL"));
    bundle.manifest.title = "changed";
    await writeFile(path, JSON.stringify(bundle));
    result = run();
    assert.equal(result.status, 1);
    assert.equal(JSON.parse(result.stdout).ok, false);
    await writeFile(path, "PRIVATE_SENTINEL invalid JSON");
    result = run();
    assert.equal(result.status, 2);
    assert.ok(!result.stderr.includes("PRIVATE_SENTINEL"));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

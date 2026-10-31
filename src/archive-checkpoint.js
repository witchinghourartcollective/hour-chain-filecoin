import { createHash } from "node:crypto";

const DOMAIN = "HBC-ARCHIVE-CHECKPOINT-v1";
const HASH = /^sha512:[a-f0-9]{128}$/;

function hash(bytes) {
  return `sha512:${createHash("sha512").update(bytes).digest("hex")}`;
}

function validate(checkpoint) {
  if (checkpoint?.domain !== DOMAIN ||
      (checkpoint.previous !== null && !HASH.test(checkpoint.previous)) ||
      !Array.isArray(checkpoint.artifacts) || !checkpoint.artifacts.length) {
    throw new TypeError("Invalid archive checkpoint");
  }
  const names = new Set();
  for (const item of checkpoint.artifacts) {
    if (typeof item.name !== "string" || !item.name.trim() || names.has(item.name) ||
        !HASH.test(item.digest) || !Number.isSafeInteger(item.bytes) || item.bytes < 0) {
      throw new TypeError("Invalid or duplicate archive artifact");
    }
    names.add(item.name);
  }
}

/** Fixed field order is part of this format; raw artifact bytes are never normalized. */
export function archiveCheckpointHash(checkpoint) {
  validate(checkpoint);
  return hash(Buffer.from(JSON.stringify({ domain: DOMAIN, previous: checkpoint.previous,
    artifacts: checkpoint.artifacts.map(({ name, digest, bytes }) => ({ name, digest, bytes })),
  }), "utf8"));
}

/** A checkpoint is integrity metadata, not a signature, timestamp or Filecoin receipt. */
export function createArchiveCheckpoint(artifacts, { previous = null } = {}) {
  if (!Array.isArray(artifacts)) throw new TypeError("Artifacts must be an array");
  const checkpoint = { domain: DOMAIN, previous, artifacts: artifacts.map(({ name, content }) => {
    if (!(content instanceof Uint8Array)) throw new TypeError("Artifact content must be bytes");
    return { name, digest: hash(content), bytes: content.byteLength };
  }) };
  validate(checkpoint);
  return checkpoint;
}

/** Pin expectedHead independently to detect truncation. resolveArtifact returns original bytes. */
export function verifyArchiveChain(checkpoints, { expectedHead, resolveArtifact } = {}) {
  try {
    if (!HASH.test(expectedHead ?? "") || typeof resolveArtifact !== "function" ||
        !Array.isArray(checkpoints) || !checkpoints.length) throw new Error("Archive verification policy is required");
    let previous = null;
    for (const checkpoint of checkpoints) {
      validate(checkpoint);
      if (checkpoint.previous !== previous) throw new Error("Broken archive chain");
      for (const item of checkpoint.artifacts) {
        const content = resolveArtifact(item);
        if (!(content instanceof Uint8Array) || content.byteLength !== item.bytes || hash(content) !== item.digest) {
          throw new Error(`Missing or modified artifact: ${item.name}`);
        }
      }
      previous = archiveCheckpointHash(checkpoint);
    }
    if (previous !== expectedHead) throw new Error("Archive head does not match pinned checkpoint");
    return { ok: true, head: previous, authenticityVerified: false, timeAnchored: false };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

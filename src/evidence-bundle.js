import { createHash } from "node:crypto";

/**
 * Return a deterministic JSON-compatible value with lexicographically sorted
 * object keys. Arrays retain their original order.
 */
export function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])])
    );
  }

  return value;
}

/** Create a SHA-256 digest for an evidence-bundle manifest. */
export function digestManifest(manifest) {
  const bytes = JSON.stringify(canonicalize(manifest));
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

/** Create an evidence bundle without modifying the caller's manifest. */
export function createEvidenceBundle(manifest) {
  validateManifestShape(manifest);
  const canonicalManifest = canonicalize(manifest);

  return {
    manifest: canonicalManifest,
    digest: digestManifest(canonicalManifest)
  };
}

/** Verify required fields and confirm that the stored digest still matches. */
export function verifyEvidenceBundle(bundle) {
  try {
    validateManifestShape(bundle?.manifest);
  } catch (error) {
    return { ok: false, error: error.message };
  }

  const actualDigest = digestManifest(bundle.manifest);
  if (actualDigest !== bundle.digest) {
    return {
      ok: false,
      error: "Evidence bundle digest does not match its manifest.",
      expectedDigest: bundle.digest,
      actualDigest
    };
  }

  return { ok: true, digest: actualDigest };
}

function validateManifestShape(manifest) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new TypeError("Manifest must be an object.");
  }

  const requiredStrings = ["schemaVersion", "workId", "workType", "title", "createdAt"];
  for (const field of requiredStrings) {
    if (typeof manifest[field] !== "string" || manifest[field].trim() === "") {
      throw new TypeError(`Manifest field ${field} must be a non-empty string.`);
    }
  }

  if (!Array.isArray(manifest.contributors) || manifest.contributors.length === 0) {
    throw new TypeError("Manifest must include at least one contributor.");
  }

  if (!Array.isArray(manifest.assets)) {
    throw new TypeError("Manifest assets must be an array.");
  }
}

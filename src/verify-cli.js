import { readFile } from "node:fs/promises";
import { verifyEvidenceBundle } from "./evidence-bundle.js";

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error("Usage: npm run verify -- <bundle.json>");
  process.exitCode = 2;
} else {
  try {
    const bundle = JSON.parse(await readFile(args[0], "utf8"));
    const result = verifyEvidenceBundle(bundle);
    console.log(JSON.stringify({
      ok: result.ok,
      check: "manifest-integrity",
      message: result.ok ? "Manifest digest matches." : result.error,
      limitations: [
        "Does not verify asset bytes, CID retrieval, signatures, or ownership.",
        "An attacker who replaces both manifest and digest can pass this check.",
        "Does not establish regulatory compliance or authorization to handle CUI."
      ]
    }, null, 2));
    process.exitCode = result.ok ? 0 : 1;
  } catch {
    console.error("Unable to read or parse the bundle JSON. Check the path and JSON syntax.");
    process.exitCode = 2;
  }
}

# Local evidence prototype: data boundary

Status: local prototype using synthetic or explicitly public data. No CUI handling authorization is claimed. Cloud trial credits do not change this boundary.

## Flow and implementation status

| Step | Data | Destination | Status |
| --- | --- | --- | --- |
| Construct bundle | Work metadata, contributor references, asset references | Local memory / user-selected JSON file | Implemented library |
| Check bundle | JSON manifest and recorded SHA-256 digest | Local CLI; summary to stdout | Implemented |
| Store and retrieve media | Private or public asset bytes | Filecoin provider | Planned; no upload in verifier |
| Record approvals | Contributor consent evidence | Solana integration | Outside this repo; not checked by verifier |
| Settle payments | Payment instructions and receipts | Base integration | Planned |
| Explain report | Verification summary | ADK / model endpoint | Not connected |

## Handling rules for this prototype

- Use synthetic names, contributor identifiers, and asset references in fixtures.
- Keep private drafts, agreements, personal data, credentials, and wallet material out of fixtures, public repositories, and blockchain records.
- Treat CIDs, hashes, timestamps, and contributor references as potentially revealing metadata; review them before publication.
- CLI output excludes manifest values and file contents. Shell redirection, terminal capture, backups, and CI logs can still create copies; operators must choose where those copies reside.
- The verifier performs no network calls and creates no cloud resources. It does not encrypt files or enforce access permissions.
- Do not send actual controlled information to this prototype, public storage, or model prompts. Resolve any proposed controlled-data workflow with its information owner and applicable requirements first.

## Evidence and gaps

A passing digest check establishes consistency with the supplied digest, not authorship or truth. Asset byte verification, authenticated trusted digests, signatures, consent validation, storage access controls, retention/deletion, audit controls, and independent assessment remain unimplemented.

Next implementation milestone: define an asset-checksum schema and test local asset tampering before adding remote storage. Keep model assistance optional; deterministic verification must remain usable offline.

Background reading: https://precisionfederal.com/insights/cui-arrived-in-your-product
This document is an engineering boundary description, not a compliance assessment.

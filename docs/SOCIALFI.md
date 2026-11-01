# SocialFi evidence handoff

SocialFi is a first-class creator-facing surface in hOUR Chain. Public profiles,
updates, collaboration, real creative-time records and support intents generate
unsigned application event drafts. Social engagement never grants rights or
creates token rewards by itself.

`createSocialFiEvidenceBundle(draft)` validates the complete canonical v1 draft
and its payload hash, then creates a manifest suitable for the existing evidence
and storage utilities. It retains `status: draft`, `consentVerified: false` and
`paymentVerified: false`. No CID, storage proof, signature or payment is fabricated.
The source contract mirror is pinned in `src/socialfi-contract-source.json`.

Archive only public metadata through this helper. Private media, agreements and
identity evidence must be encrypted before upload and linked by verified references.
Use `createFilecoinStorage` with the managed signer service for actual network
storage/retrieval, retaining receipts independently. An app outbox is not Filecoin
persistence; live uploads, retention and the creator pilot remain gates.

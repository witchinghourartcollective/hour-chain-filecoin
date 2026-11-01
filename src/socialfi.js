import { assertSocialFiDraft } from './socialfi-contract.mjs';
import { createEvidenceBundle } from './evidence-bundle.js';

/** A public-metadata archive handoff, not proof of consent, payment or storage. */
export function createSocialFiEvidenceBundle(draft) {
  draft = assertSocialFiDraft(draft);
  const { envelope, payload } = draft;
  return createEvidenceBundle({
    schemaVersion: '0.1.0', workId: typeof payload.workId === 'string' ? payload.workId : envelope.subject,
    workType: 'socialfi-event', title: envelope.eventType, createdAt: envelope.issuedAt,
    contributors: [{ id: envelope.actor, role: 'event-author' }], assets: [],
    socialfi: { status: 'draft', eventId: envelope.eventId, payloadHash: envelope.payloadHash,
      proposal: JSON.parse(JSON.stringify(draft)), consentVerified: false, paymentVerified: false },
  });
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { createSocialFiDraft } from '../src/socialfi-contract.mjs';
import { createSocialFiEvidenceBundle, verifyEvidenceBundle } from '../src/index.js';

test('SocialFi proposals become archive manifests without claiming signatures or payments', () => {
  const draft = createSocialFiDraft('socialfi.contribution.recorded.v1', 'creator:one', 'hour:work:one',
    { workId: 'hour:work:one', role: 'producer', minutes: 90 });
  const bundle = createSocialFiEvidenceBundle(draft);
  assert.equal(verifyEvidenceBundle(bundle).ok, true);
  assert.equal(bundle.manifest.socialfi.consentVerified, false);
  assert.equal(bundle.manifest.socialfi.paymentVerified, false);
  assert.deepEqual(bundle.manifest.socialfi.proposal, draft);
  assert.throws(() => createSocialFiEvidenceBundle({ ...draft, payload: { ...draft.payload, minutes: 900 } }));
  assert.throws(() => createSocialFiEvidenceBundle({ ...draft, status: 'settled' }));
  Object.defineProperty(draft,'toJSON',{value:()=>({status:'settled'})});
  assert.throws(() => createSocialFiEvidenceBundle(draft));
});

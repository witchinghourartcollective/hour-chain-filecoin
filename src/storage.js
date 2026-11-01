import { createHash } from 'node:crypto';

const DIGEST = /^sha512:[a-f0-9]{128}$/;
const digest = (bytes) => `sha512:${createHash('sha512').update(bytes).digest('hex')}`;

function receiptShape(receipt, network) {
  if (receipt?.version !== 1 || receipt.network !== network ||
      typeof receipt.pieceCid !== 'string' || !receipt.pieceCid.trim() ||
      !DIGEST.test(receipt.digest) || !Number.isSafeInteger(receipt.bytes) || receipt.bytes < 0) {
    throw new TypeError('Invalid storage receipt or wrong Filecoin network');
  }
}

/**
 * Inject an initialized Synapse SDK v2 instance with a managed signer.
 * This boundary never accepts private keys or configures payment allowances.
 * SDK completion is not an independent PDP proof or a retention guarantee.
 */
export function createFilecoinStorage({ synapse, network, copies = 2 } = {}) {
  if (!['calibration', 'mainnet'].includes(network) ||
      !Number.isSafeInteger(copies) || copies < 1 ||
      typeof synapse?.storage?.upload !== 'function' ||
      typeof synapse?.storage?.download !== 'function') {
    throw new TypeError('Explicit network, positive copy count and Synapse storage are required');
  }
  const chainId = network === 'calibration' ? 314159 : 314;
  if (synapse.chain?.id !== chainId) throw new TypeError('Synapse chain does not match the explicit network');

  async function retrieve(receipt) {
    receiptShape(receipt, network);
    const bytes = await synapse.storage.download({ pieceCid: receipt.pieceCid });
    if (!(bytes instanceof Uint8Array) || bytes.byteLength !== receipt.bytes || digest(bytes) !== receipt.digest) {
      throw new Error('Retrieved bytes do not match the independently stored receipt');
    }
    return new Uint8Array(bytes);
  }

  async function upload(content) {
    if (!(content instanceof Uint8Array) || content.byteLength === 0) {
      throw new TypeError('Upload requires non-empty bytes; encrypt private evidence before calling');
    }
    // Snapshot before the first await so caller mutations cannot change the commitment.
    const bytes = new Uint8Array(content);
    const expectedDigest = digest(bytes);
    const expectedSize = bytes.byteLength;
    const result = await synapse.storage.upload(bytes, { copies });
    const pieceCid = result?.pieceCid?.toString();
    const providers = result?.copies;
    if (result?.complete !== true || result.size !== expectedSize ||
        typeof pieceCid !== 'string' || !pieceCid.trim() ||
        !Array.isArray(providers) || providers.length < copies ||
        providers.some((copy) => copy.providerId == null || copy.dataSetId == null || copy.pieceId == null) ||
        new Set(providers.map((copy) => String(copy.providerId))).size < copies) {
      // Retain the SDK result for reconciliation: a partial upload may have incurred costs.
      const error = new Error('Filecoin upload did not satisfy the requested storage policy');
      error.uploadResult = result;
      throw error;
    }
    const receipt = {
      version: 1, network, pieceCid, bytes: expectedSize, digest: expectedDigest,
      copies: providers.map(({ providerId, dataSetId, pieceId }) => ({
        providerId: String(providerId), dataSetId: String(dataSetId), pieceId: String(pieceId),
      })),
      sdkComplete: true,
    };
    try {
      await retrieve(receipt);
    } catch (cause) {
      const error = new Error('Upload committed but retrieval verification failed', { cause });
      error.receipt = receipt;
      throw error;
    }
    return { ...receipt, retrievalVerified: true };
  }

  return { upload, retrieve };
}

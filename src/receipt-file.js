/** Persist all JSON bytes, including when the filesystem returns short writes. */
export async function writeReceipt(file, value) {
  const data = Buffer.from(JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2) + '\n');
  await file.truncate(0);
  let offset = 0;
  while (offset < data.length) {
    const { bytesWritten } = await file.write(data, offset, data.length - offset, offset);
    if (bytesWritten <= 0) throw new Error('Receipt write made no progress');
    offset += bytesWritten;
  }
  await file.sync();
}

export function canaryFailureRecord(error, committedReceipt) {
  return { status: 'failed-reconcile-before-retry', receipt: error.receipt ?? committedReceipt,
    uploadResult: error.uploadResult && {
      pieceCid: error.uploadResult.pieceCid?.toString(), complete: error.uploadResult.complete,
      size: error.uploadResult.size, requestedCopies: error.uploadResult.requestedCopies,
      copies: error.uploadResult.copies?.map(({ providerId, dataSetId, pieceId }) => ({ providerId, dataSetId, pieceId })),
      failedAttempts: error.uploadResult.failedAttempts?.map(attempt => ({
        providerId: attempt.providerId, error: String(attempt.error?.message ?? attempt.error ?? ''),
      })),
    }, checkedAt: new Date().toISOString() };
}

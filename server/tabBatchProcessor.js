// tabBatchProcessor.js — apply operations to a batch of tabs

const SUPPORTED_OPERATIONS = ['pin', 'favorite', 'bookmark', 'highlight', 'tag', 'label'];

function isValidOperation(op) {
  return SUPPORTED_OPERATIONS.includes(op);
}

function applyOperation(tab, operation, params = {}) {
  if (!isValidOperation(operation)) {
    return { tab, success: false, error: `Unsupported operation: ${operation}` };
  }
  if (!tab || typeof tab.url !== 'string') {
    return { tab, success: false, error: 'Invalid tab object' };
  }
  // Return a decorated result representing the operation applied
  return {
    tab,
    operation,
    params,
    success: true,
    appliedAt: new Date().toISOString()
  };
}

function processBatch(tabs, operation, params = {}) {
  if (!Array.isArray(tabs)) {
    throw new TypeError('tabs must be an array');
  }
  if (!isValidOperation(operation)) {
    throw new Error(`Unsupported operation: ${operation}`);
  }

  const results = tabs.map(tab => applyOperation(tab, operation, params));
  const succeeded = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  return {
    operation,
    total: tabs.length,
    succeeded: succeeded.length,
    failed: failed.length,
    results
  };
}

function batchSummary(batchResult) {
  const { operation, total, succeeded, failed } = batchResult;
  return `Batch '${operation}': ${succeeded}/${total} succeeded, ${failed} failed.`;
}

module.exports = {
  SUPPORTED_OPERATIONS,
  isValidOperation,
  applyOperation,
  processBatch,
  batchSummary
};

const {
  SUPPORTED_OPERATIONS,
  isValidOperation,
  applyOperation,
  processBatch,
  batchSummary
} = require('./tabBatchProcessor');

const sampleTab = { url: 'https://example.com', title: 'Example' };
const anotherTab = { url: 'https://github.com', title: 'GitHub' };

describe('isValidOperation', () => {
  test('returns true for supported operations', () => {
    SUPPORTED_OPERATIONS.forEach(op => {
      expect(isValidOperation(op)).toBe(true);
    });
  });

  test('returns false for unknown operation', () => {
    expect(isValidOperation('delete')).toBe(false);
    expect(isValidOperation('')).toBe(false);
  });
});

describe('applyOperation', () => {
  test('returns success result for valid tab and operation', () => {
    const result = applyOperation(sampleTab, 'pin');
    expect(result.success).toBe(true);
    expect(result.operation).toBe('pin');
    expect(result.tab).toBe(sampleTab);
    expect(result.appliedAt).toBeDefined();
  });

  test('returns failure for unsupported operation', () => {
    const result = applyOperation(sampleTab, 'nuke');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Unsupported/);
  });

  test('returns failure for invalid tab', () => {
    const result = applyOperation({ title: 'No URL' }, 'pin');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Invalid tab/);
  });

  test('passes params through to result', () => {
    const result = applyOperation(sampleTab, 'highlight', { color: 'red' });
    expect(result.params).toEqual({ color: 'red' });
  });
});

describe('processBatch', () => {
  test('processes all tabs and returns summary counts', () => {
    const result = processBatch([sampleTab, anotherTab], 'bookmark');
    expect(result.total).toBe(2);
    expect(result.succeeded).toBe(2);
    expect(result.failed).toBe(0);
    expect(result.results).toHaveLength(2);
  });

  test('throws for non-array input', () => {
    expect(() => processBatch('not-array', 'pin')).toThrow(TypeError);
  });

  test('throws for unsupported operation', () => {
    expect(() => processBatch([sampleTab], 'explode')).toThrow(/Unsupported/);
  });

  test('counts failed results when tab is invalid', () => {
    const badTab = { title: 'no url here' };
    const result = processBatch([sampleTab, badTab], 'tag');
    expect(result.succeeded).toBe(1);
    expect(result.failed).toBe(1);
  });
});

describe('batchSummary', () => {
  test('returns a readable summary string', () => {
    const result = processBatch([sampleTab, anotherTab], 'favorite');
    const summary = batchSummary(result);
    expect(summary).toContain('favorite');
    expect(summary).toContain('2/2');
  });
});

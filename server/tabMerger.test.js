const { mergeTabLists, mergeAndDeduplicate, mergeByWindow, mergeSummary } = require('./tabMerger');

const listA = [
  { title: 'Google', url: 'https://google.com' },
  { title: 'GitHub', url: 'https://github.com' }
];
const listB = [
  { title: 'GitHub', url: 'https://github.com' },
  { title: 'MDN', url: 'https://developer.mozilla.org' }
];

describe('mergeTabLists', () => {
  it('merges two lists', () => {
    const result = mergeTabLists(listA, listB);
    expect(result).toHaveLength(4);
  });

  it('skips non-array inputs', () => {
    const result = mergeTabLists(listA, null, listB);
    expect(result).toHaveLength(4);
  });

  it('returns empty array for no valid inputs', () => {
    expect(mergeTabLists(null, undefined)).toEqual([]);
  });
});

describe('mergeAndDeduplicate', () => {
  it('removes duplicate urls', () => {
    const result = mergeAndDeduplicate(listA, listB);
    expect(result).toHaveLength(3);
  });

  it('preserves first occurrence', () => {
    const result = mergeAndDeduplicate(listA, listB);
    expect(result[1].title).toBe('GitHub');
  });

  it('handles tabs without urls', () => {
    const result = mergeAndDeduplicate([{ title: 'No URL' }], listA);
    expect(result).toHaveLength(2);
  });
});

describe('mergeByWindow', () => {
  it('assigns window index to tabs without windowId', () => {
    const result = mergeByWindow([listA, listB]);
    expect(result[0].windowId).toBe(0);
    expect(result[2].windowId).toBe(1);
  });

  it('preserves existing windowId', () => {
    const withWindow = [{ title: 'X', url: 'https://x.com', windowId: 5 }];
    const result = mergeByWindow([withWindow]);
    expect(result[0].windowId).toBe(5);
  });
});

describe('mergeSummary', () => {
  it('returns correct counts', () => {
    const summary = mergeSummary(listA, listB);
    expect(summary.totalInput).toBe(4);
    expect(summary.mergedCount).toBe(4);
    expect(summary.dedupedCount).toBe(3);
    expect(summary.duplicatesRemoved).toBe(1);
    expect(summary.listCount).toBe(2);
  });
});

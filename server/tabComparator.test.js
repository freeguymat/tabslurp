const { normalizeUrl, findAdded, findRemoved, findCommon, findTitleChanged, compareTabs } = require('./tabComparator');

const tabsA = [
  { url: 'https://example.com/page', title: 'Example' },
  { url: 'https://github.com/', title: 'GitHub' },
  { url: 'https://news.ycombinator.com/', title: 'HN Old' }
];

const tabsB = [
  { url: 'https://example.com/page', title: 'Example' },
  { url: 'https://news.ycombinator.com/', title: 'HN New' },
  { url: 'https://openai.com/', title: 'OpenAI' }
];

test('normalizeUrl strips trailing slash and protocol', () => {
  expect(normalizeUrl('https://example.com/')).toBe('example.com');
  expect(normalizeUrl('https://example.com/page')).toBe('example.com/page');
});

test('findAdded returns tabs in B not in A', () => {
  const added = findAdded(tabsA, tabsB);
  expect(added).toHaveLength(1);
  expect(added[0].url).toBe('https://openai.com/');
});

test('findRemoved returns tabs in A not in B', () => {
  const removed = findRemoved(tabsA, tabsB);
  expect(removed).toHaveLength(1);
  expect(removed[0].url).toBe('https://github.com/');
});

test('findCommon returns tabs present in both', () => {
  const common = findCommon(tabsA, tabsB);
  expect(common).toHaveLength(2);
});

test('findTitleChanged returns tabs with different titles', () => {
  const changed = findTitleChanged(tabsA, tabsB);
  expect(changed).toHaveLength(1);
  expect(changed[0].oldTitle).toBe('HN Old');
  expect(changed[0].newTitle).toBe('HN New');
});

test('compareTabs returns full diff summary', () => {
  const result = compareTabs(tabsA, tabsB);
  expect(result.summary.addedCount).toBe(1);
  expect(result.summary.removedCount).toBe(1);
  expect(result.summary.commonCount).toBe(2);
  expect(result.summary.titleChangedCount).toBe(1);
});

test('compareTabs with identical lists returns no changes', () => {
  const result = compareTabs(tabsA, tabsA);
  expect(result.summary.addedCount).toBe(0);
  expect(result.summary.removedCount).toBe(0);
  expect(result.summary.titleChangedCount).toBe(0);
});

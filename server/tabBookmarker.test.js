const {
  bookmarkTab,
  unbookmarkTab,
  isBookmarked,
  bookmarkTabs,
  getBookmarkedTabs,
  clearBookmarks,
  getBookmarkCount,
} = require('./tabBookmarker');

beforeEach(() => {
  clearBookmarks();
});

const tab1 = { url: 'https://example.com', title: 'Example' };
const tab2 = { url: 'https://github.com', title: 'GitHub' };

test('bookmarkTab adds a tab', () => {
  const result = bookmarkTab(tab1);
  expect(result.url).toBe(tab1.url);
  expect(result.bookmarkedAt).toBeDefined();
});

test('bookmarkTab does not duplicate', () => {
  bookmarkTab(tab1);
  bookmarkTab(tab1);
  expect(getBookmarkCount()).toBe(1);
});

test('isBookmarked returns true after bookmarking', () => {
  bookmarkTab(tab1);
  expect(isBookmarked(tab1.url)).toBe(true);
});

test('isBookmarked returns false for unknown url', () => {
  expect(isBookmarked('https://unknown.com')).toBe(false);
});

test('unbookmarkTab removes a tab', () => {
  bookmarkTab(tab1);
  const removed = unbookmarkTab(tab1.url);
  expect(removed).toBe(true);
  expect(isBookmarked(tab1.url)).toBe(false);
});

test('unbookmarkTab returns false when tab not found', () => {
  expect(unbookmarkTab('https://nope.com')).toBe(false);
});

test('bookmarkTabs bookmarks multiple tabs', () => {
  const results = bookmarkTabs([tab1, tab2]);
  expect(results).toHaveLength(2);
  expect(getBookmarkCount()).toBe(2);
});

test('getBookmarkedTabs returns all bookmarks', () => {
  bookmarkTabs([tab1, tab2]);
  const all = getBookmarkedTabs();
  expect(all.map((t) => t.url)).toContain(tab1.url);
  expect(all.map((t) => t.url)).toContain(tab2.url);
});

test('clearBookmarks empties all bookmarks', () => {
  bookmarkTabs([tab1, tab2]);
  clearBookmarks();
  expect(getBookmarkCount()).toBe(0);
});

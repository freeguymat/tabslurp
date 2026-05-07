// tabBookmarker.js — bookmark/unbookmark tabs and retrieve bookmarked tabs

const bookmarks = new Map();

function getBookmarkKey(tab) {
  return tab.url;
}

function bookmarkTab(tab) {
  const key = getBookmarkKey(tab);
  if (!bookmarks.has(key)) {
    bookmarks.set(key, { ...tab, bookmarkedAt: new Date().toISOString() });
  }
  return bookmarks.get(key);
}

function unbookmarkTab(url) {
  const existed = bookmarks.has(url);
  bookmarks.delete(url);
  return existed;
}

function isBookmarked(url) {
  return bookmarks.has(url);
}

function bookmarkTabs(tabs) {
  return tabs.map((tab) => bookmarkTab(tab));
}

function getBookmarkedTabs() {
  return Array.from(bookmarks.values());
}

function clearBookmarks() {
  bookmarks.clear();
}

function getBookmarkCount() {
  return bookmarks.size;
}

module.exports = {
  getBookmarkKey,
  bookmarkTab,
  unbookmarkTab,
  isBookmarked,
  bookmarkTabs,
  getBookmarkedTabs,
  clearBookmarks,
  getBookmarkCount,
};

// tabPinner.js — utilities for pinning/unpinning tabs and managing pinned collections

const pinnedTabs = new Set();

function pinTab(tab) {
  if (!tab || !tab.url) return { success: false, error: 'Invalid tab' };
  pinnedTabs.add(tab.url);
  return { success: true, url: tab.url };
}

function unpinTab(tab) {
  if (!tab || !tab.url) return { success: false, error: 'Invalid tab' };
  const removed = pinnedTabs.delete(tab.url);
  return { success: removed, url: tab.url };
}

function isPinned(tab) {
  return tab && tab.url ? pinnedTabs.has(tab.url) : false;
}

function pinTabs(tabs) {
  if (!Array.isArray(tabs)) return { pinned: [], errors: [] };
  const pinned = [];
  const errors = [];
  for (const tab of tabs) {
    const result = pinTab(tab);
    if (result.success) pinned.push(tab);
    else errors.push({ tab, error: result.error });
  }
  return { pinned, errors };
}

function getPinnedTabs(tabs) {
  if (!Array.isArray(tabs)) return [];
  return tabs.filter(tab => isPinned(tab));
}

function getUnpinnedTabs(tabs) {
  if (!Array.isArray(tabs)) return [];
  return tabs.filter(tab => !isPinned(tab));
}

function clearPinned() {
  pinnedTabs.clear();
}

function getPinnedUrls() {
  return Array.from(pinnedTabs);
}

module.exports = {
  pinTab,
  unpinTab,
  isPinned,
  pinTabs,
  getPinnedTabs,
  getUnpinnedTabs,
  clearPinned,
  getPinnedUrls
};

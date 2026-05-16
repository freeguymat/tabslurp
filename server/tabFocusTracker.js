// Tracks which tabs have been 'focused' (marked for attention)

const focusStore = new Map();

function getFocusKey(tab) {
  return tab.url || tab.id;
}

function focusTab(tab) {
  const key = getFocusKey(tab);
  if (!key) return { success: false, error: 'Tab missing url or id' };
  focusStore.set(key, { tab, focusedAt: new Date().toISOString() });
  return { success: true, key };
}

function unfocusTab(tab) {
  const key = getFocusKey(tab);
  if (!key) return { success: false, error: 'Tab missing url or id' };
  const existed = focusStore.delete(key);
  return { success: existed };
}

function isFocused(tab) {
  const key = getFocusKey(tab);
  return focusStore.has(key);
}

function getFocusedTabs() {
  return Array.from(focusStore.values()).map(entry => ({
    ...entry.tab,
    focusedAt: entry.focusedAt
  }));
}

function focusTabs(tabs) {
  return tabs.map(tab => ({ ...focusTab(tab), url: tab.url }));
}

function clearFocus() {
  const count = focusStore.size;
  focusStore.clear();
  return { cleared: count };
}

function focusSummary() {
  const focused = getFocusedTabs();
  return {
    total: focused.length,
    urls: focused.map(t => t.url)
  };
}

module.exports = {
  getFocusKey,
  focusTab,
  unfocusTab,
  isFocused,
  getFocusedTabs,
  focusTabs,
  clearFocus,
  focusSummary
};

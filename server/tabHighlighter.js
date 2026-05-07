// tabHighlighter.js — highlight tabs matching criteria for quick visual grouping

const HIGHLIGHT_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'gray'];

function isValidColor(color) {
  return HIGHLIGHT_COLORS.includes(color);
}

function getHighlightKey(tabId) {
  return `highlight:${tabId}`;
}

function highlightTab(store, tab, color) {
  if (!tab || !tab.id) throw new Error('Invalid tab');
  if (!isValidColor(color)) throw new Error(`Invalid color: ${color}. Must be one of: ${HIGHLIGHT_COLORS.join(', ')}`);
  const key = getHighlightKey(tab.id);
  store[key] = { tabId: tab.id, color, highlightedAt: new Date().toISOString() };
  return store[key];
}

function unhighlightTab(store, tabId) {
  const key = getHighlightKey(tabId);
  const existed = !!store[key];
  delete store[key];
  return existed;
}

function isHighlighted(store, tabId) {
  return !!store[getHighlightKey(tabId)];
}

function getHighlightColor(store, tabId) {
  const entry = store[getHighlightKey(tabId)];
  return entry ? entry.color : null;
}

function highlightTabs(store, tabs, color) {
  return tabs.map(tab => highlightTab(store, tab, color));
}

function getHighlightedTabs(store, tabs) {
  return tabs.filter(tab => isHighlighted(store, tab.id)).map(tab => ({
    ...tab,
    highlight: store[getHighlightKey(tab.id)]
  }));
}

function getHighlightsByColor(store, tabs, color) {
  return getHighlightedTabs(store, tabs).filter(tab => tab.highlight.color === color);
}

function clearHighlights(store) {
  Object.keys(store).forEach(key => {
    if (key.startsWith('highlight:')) delete store[key];
  });
}

module.exports = {
  HIGHLIGHT_COLORS,
  isValidColor,
  getHighlightKey,
  highlightTab,
  unhighlightTab,
  isHighlighted,
  getHighlightColor,
  highlightTabs,
  getHighlightedTabs,
  getHighlightsByColor,
  clearHighlights
};

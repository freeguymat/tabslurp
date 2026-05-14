// tabRenamer.js — rename tabs with custom titles, persisted in memory

const renames = new Map();

function getRenameKey(tab) {
  return tab.url;
}

function renameTab(tab, newTitle) {
  if (!tab || typeof tab.url !== 'string') {
    throw new Error('Invalid tab: must have a url');
  }
  if (typeof newTitle !== 'string' || newTitle.trim() === '') {
    throw new Error('Invalid title: must be a non-empty string');
  }
  const key = getRenameKey(tab);
  renames.set(key, newTitle.trim());
  return { ...tab, title: newTitle.trim(), renamed: true };
}

function unrename(tab) {
  if (!tab || typeof tab.url !== 'string') {
    throw new Error('Invalid tab: must have a url');
  }
  const key = getRenameKey(tab);
  const existed = renames.has(key);
  renames.delete(key);
  return existed;
}

function isRenamed(tab) {
  if (!tab || typeof tab.url !== 'string') return false;
  return renames.has(getRenameKey(tab));
}

function getCustomTitle(tab) {
  if (!tab || typeof tab.url !== 'string') return null;
  return renames.get(getRenameKey(tab)) || null;
}

function applyRenames(tabs) {
  if (!Array.isArray(tabs)) throw new Error('tabs must be an array');
  return tabs.map(tab => {
    const custom = getCustomTitle(tab);
    if (custom) {
      return { ...tab, title: custom, renamed: true };
    }
    return tab;
  });
}

function getRenameMap() {
  return Object.fromEntries(renames);
}

function clearRenames() {
  renames.clear();
}

/**
 * Bulk-import a rename map, merging it into the existing renames.
 * Entries with empty or non-string titles are skipped.
 * @param {Object} map - Plain object mapping URLs to custom titles
 */
function importRenames(map) {
  if (!map || typeof map !== 'object' || Array.isArray(map)) {
    throw new Error('importRenames: map must be a plain object');
  }
  for (const [url, title] of Object.entries(map)) {
    if (typeof title === 'string' && title.trim() !== '') {
      renames.set(url, title.trim());
    }
  }
}

module.exports = {
  getRenameKey,
  renameTab,
  unrename,
  isRenamed,
  getCustomTitle,
  applyRenames,
  getRenameMap,
  clearRenames,
  importRenames,
};

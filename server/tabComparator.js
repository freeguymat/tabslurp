// Compare two sets of tabs and produce a diff-like summary

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname}`.replace(/\/+$/, '');
  } catch {
    return url;
  }
}

function getTabMap(tabs) {
  const map = new Map();
  for (const tab of tabs) {
    map.set(normalizeUrl(tab.url), tab);
  }
  return map;
}

function findAdded(tabsA, tabsB) {
  const mapA = getTabMap(tabsA);
  return tabsB.filter(tab => !mapA.has(normalizeUrl(tab.url)));
}

function findRemoved(tabsA, tabsB) {
  const mapB = getTabMap(tabsB);
  return tabsA.filter(tab => !mapB.has(normalizeUrl(tab.url)));
}

function findCommon(tabsA, tabsB) {
  const mapB = getTabMap(tabsB);
  return tabsA.filter(tab => mapB.has(normalizeUrl(tab.url)));
}

function findTitleChanged(tabsA, tabsB) {
  const mapA = getTabMap(tabsA);
  const mapB = getTabMap(tabsB);
  const changed = [];
  for (const [key, tabA] of mapA) {
    const tabB = mapB.get(key);
    if (tabB && tabB.title !== tabA.title) {
      changed.push({ url: tabA.url, oldTitle: tabA.title, newTitle: tabB.title });
    }
  }
  return changed;
}

function compareTabs(tabsA, tabsB) {
  const added = findAdded(tabsA, tabsB);
  const removed = findRemoved(tabsA, tabsB);
  const common = findCommon(tabsA, tabsB);
  const titleChanged = findTitleChanged(tabsA, tabsB);
  return {
    added,
    removed,
    common,
    titleChanged,
    summary: {
      addedCount: added.length,
      removedCount: removed.length,
      commonCount: common.length,
      titleChangedCount: titleChanged.length
    }
  };
}

module.exports = { normalizeUrl, findAdded, findRemoved, findCommon, findTitleChanged, compareTabs };

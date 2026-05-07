// tabMerger.js - merge multiple tab collections into one

function mergeTabLists(...tabLists) {
  const merged = [];
  for (const list of tabLists) {
    if (!Array.isArray(list)) continue;
    for (const tab of list) {
      merged.push(tab);
    }
  }
  return merged;
}

function mergeAndDeduplicate(...tabLists) {
  const merged = mergeTabLists(...tabLists);
  const seen = new Set();
  return merged.filter(tab => {
    const key = tab.url ? tab.url.trim().toLowerCase() : null;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mergeByWindow(tabLists) {
  if (!Array.isArray(tabLists)) return [];
  return tabLists.flatMap((list, index) =>
    (Array.isArray(list) ? list : []).map(tab => ({
      ...tab,
      windowId: tab.windowId !== undefined ? tab.windowId : index
    }))
  );
}

function mergeSummary(...tabLists) {
  const merged = mergeTabLists(...tabLists);
  const deduped = mergeAndDeduplicate(...tabLists);
  return {
    totalInput: tabLists.reduce((sum, l) => sum + (Array.isArray(l) ? l.length : 0), 0),
    listCount: tabLists.length,
    mergedCount: merged.length,
    dedupedCount: deduped.length,
    duplicatesRemoved: merged.length - deduped.length
  };
}

module.exports = { mergeTabLists, mergeAndDeduplicate, mergeByWindow, mergeSummary };

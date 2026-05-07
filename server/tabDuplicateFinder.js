// Finds duplicate tabs by URL or title similarity

function normalizeUrlForCompare(url) {
  try {
    const u = new URL(url);
    u.hash = '';
    return u.toString().replace(/\/$/, '');
  } catch {
    return url.trim().toLowerCase();
  }
}

function findExactDuplicates(tabs) {
  const seen = new Map();
  const duplicates = [];

  for (const tab of tabs) {
    const key = normalizeUrlForCompare(tab.url);
    if (seen.has(key)) {
      duplicates.push({ original: seen.get(key), duplicate: tab });
    } else {
      seen.set(key, tab);
    }
  }

  return duplicates;
}

function findTitleDuplicates(tabs) {
  const seen = new Map();
  const duplicates = [];

  for (const tab of tabs) {
    const key = (tab.title || '').trim().toLowerCase();
    if (!key) continue;
    if (seen.has(key)) {
      duplicates.push({ original: seen.get(key), duplicate: tab });
    } else {
      seen.set(key, tab);
    }
  }

  return duplicates;
}

function groupDuplicates(tabs) {
  const groups = new Map();

  for (const tab of tabs) {
    const key = normalizeUrlForCompare(tab.url);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(tab);
  }

  return Array.from(groups.values()).filter(g => g.length > 1);
}

function getDuplicateSummary(tabs) {
  const exactDups = findExactDuplicates(tabs);
  const titleDups = findTitleDuplicates(tabs);
  const groups = groupDuplicates(tabs);

  return {
    totalTabs: tabs.length,
    exactDuplicateCount: exactDups.length,
    titleDuplicateCount: titleDups.length,
    duplicateGroups: groups,
    exactDuplicates: exactDups,
    titleDuplicates: titleDups,
  };
}

module.exports = {
  normalizeUrlForCompare,
  findExactDuplicates,
  findTitleDuplicates,
  groupDuplicates,
  getDuplicateSummary,
};

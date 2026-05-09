// Assigns priority scores to tabs based on recency, frequency, and domain

const PRIORITY_LEVELS = { high: 3, medium: 2, low: 1 };

function scoreDomain(url, boostDomains = []) {
  try {
    const domain = new URL(url).hostname;
    return boostDomains.includes(domain) ? 2 : 0;
  } catch {
    return 0;
  }
}

function scoreByTitle(title) {
  if (!title || title.trim() === '' || title === 'New Tab') return 0;
  return title.length > 10 ? 1 : 0;
}

function scoreByProtocol(url) {
  if (url.startsWith('https://')) return 1;
  if (url.startsWith('http://')) return 0;
  return -1;
}

function computePriorityScore(tab, options = {}) {
  const { boostDomains = [], boostPinned = true } = options;
  let score = 0;
  score += scoreDomain(tab.url, boostDomains);
  score += scoreByTitle(tab.title);
  score += scoreByProtocol(tab.url);
  if (boostPinned && tab.pinned) score += 2;
  return score;
}

function assignPriorityLevel(score) {
  if (score >= 4) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
}

function prioritizeTab(tab, options = {}) {
  const score = computePriorityScore(tab, options);
  const level = assignPriorityLevel(score);
  return { ...tab, priorityScore: score, priorityLevel: level };
}

function prioritizeTabs(tabs, options = {}) {
  return tabs
    .map(tab => prioritizeTab(tab, options))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

function prioritySummary(tabs) {
  const counts = { high: 0, medium: 0, low: 0 };
  for (const tab of tabs) {
    const level = tab.priorityLevel || 'low';
    if (counts[level] !== undefined) counts[level]++;
  }
  return counts;
}

module.exports = {
  computePriorityScore,
  assignPriorityLevel,
  prioritizeTab,
  prioritizeTabs,
  prioritySummary,
  PRIORITY_LEVELS
};

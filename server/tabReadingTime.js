// Estimates reading time and content metadata for tabs

const AVERAGE_WPM = 200;
const WORDS_PER_DOMAIN_SEGMENT = 3; // rough estimate for domain-only tabs

function estimateReadingTime(title = '', url = '') {
  const text = `${title} ${url}`;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / AVERAGE_WPM));
  return minutes;
}

function categorizeDomain(url) {
  try {
    const { hostname } = new URL(url);
    if (/docs\.|documentation|wiki|man\.|guide/i.test(hostname)) return 'documentation';
    if (/github\.com|gitlab\.com|bitbucket/i.test(hostname)) return 'code';
    if (/youtube\.com|vimeo\.com|twitch\.tv/i.test(hostname)) return 'video';
    if (/reddit\.com|news\.ycombinator|lobste\.rs/i.test(hostname)) return 'discussion';
    if (/medium\.com|dev\.to|substack\.com|blog/i.test(hostname)) return 'article';
    return 'general';
  } catch {
    return 'unknown';
  }
}

function annotateTab(tab) {
  const readingTime = estimateReadingTime(tab.title, tab.url);
  const category = categorizeDomain(tab.url);
  return { ...tab, readingTime, category };
}

function annotateTabs(tabs) {
  if (!Array.isArray(tabs)) return [];
  return tabs.map(annotateTab);
}

function readingTimeSummary(tabs) {
  const annotated = annotateTabs(tabs);
  const totalMinutes = annotated.reduce((sum, t) => sum + t.readingTime, 0);
  const byCategory = {};
  for (const tab of annotated) {
    byCategory[tab.category] = (byCategory[tab.category] || 0) + 1;
  }
  return {
    totalTabs: tabs.length,
    totalReadingTimeMinutes: totalMinutes,
    byCategory,
  };
}

module.exports = { estimateReadingTime, categorizeDomain, annotateTab, annotateTabs, readingTimeSummary };

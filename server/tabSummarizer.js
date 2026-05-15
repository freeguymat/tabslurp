// tabSummarizer.js — generate brief text summaries describing a set of tabs

const { extractDomain } = require('./tabSorter');

/**
 * Count unique domains in a tab list.
 */
function countUniqueDomains(tabs) {
  const domains = new Set(tabs.map(t => extractDomain(t.url)).filter(Boolean));
  return domains.size;
}

/**
 * Find the most common domain in a tab list.
 */
function topDomain(tabs) {
  const counts = {};
  for (const tab of tabs) {
    const d = extractDomain(tab.url);
    if (d) counts[d] = (counts[d] || 0) + 1;
  }
  let best = null, bestCount = 0;
  for (const [domain, count] of Object.entries(counts)) {
    if (count > bestCount) { best = domain; bestCount = count; }
  }
  return best;
}

/**
 * Build a one-line summary sentence for a collection of tabs.
 */
function buildSummaryLine(tabs) {
  if (!tabs || tabs.length === 0) return 'No tabs to summarize.';
  const count = tabs.length;
  const domains = countUniqueDomains(tabs);
  const top = topDomain(tabs);
  const domainPart = top ? `, mostly from ${top}` : '';
  return `${count} tab${count !== 1 ? 's' : ''} across ${domains} domain${domains !== 1 ? 's' : ''}${domainPart}.`;
}

/**
 * Build a multi-line markdown summary block.
 */
function buildMarkdownSummary(tabs, label = 'Tab Summary') {
  if (!tabs || tabs.length === 0) return `## ${label}\n\n_No tabs._\n`;
  const line = buildSummaryLine(tabs);
  const titles = tabs
    .slice(0, 5)
    .map(t => `- ${t.title || t.url}`)
    .join('\n');
  const more = tabs.length > 5 ? `\n_...and ${tabs.length - 5} more._` : '';
  return `## ${label}\n\n${line}\n\n### Sample Tabs\n${titles}${more}\n`;
}

/**
 * Summarize tabs grouped by a key (e.g. domain).
 */
function summarizeGroups(groups) {
  return Object.entries(groups).map(([key, tabs]) => ({
    group: key,
    count: tabs.length,
    summary: buildSummaryLine(tabs),
  }));
}

module.exports = {
  countUniqueDomains,
  topDomain,
  buildSummaryLine,
  buildMarkdownSummary,
  summarizeGroups,
};

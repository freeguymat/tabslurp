/**
 * Converts an array of tab objects into a markdown string.
 * Each tab: { title, url, favIconUrl? }
 */

function formatTabsAsMarkdown(tabs, options = {}) {
  const { groupByDomain = false, title = 'Exported Tabs', timestamp = true } = options;

  const lines = [];

  lines.push(`# ${title}`);
  if (timestamp) {
    lines.push(`_Exported on ${new Date().toLocaleString()}_`);
  }
  lines.push('');

  if (groupByDomain) {
    const groups = groupTabsByDomain(tabs);
    for (const [domain, domainTabs] of Object.entries(groups)) {
      lines.push(`## ${domain}`);
      lines.push('');
      for (const tab of domainTabs) {
        lines.push(formatTabLine(tab));
      }
      lines.push('');
    }
  } else {
    for (const tab of tabs) {
      lines.push(formatTabLine(tab));
    }
    lines.push('');
  }

  return lines.join('\n');
}

function formatTabLine(tab) {
  const label = tab.title ? tab.title.trim() : tab.url;
  return `- [${label}](${tab.url})`;
}

function groupTabsByDomain(tabs) {
  const groups = {};
  for (const tab of tabs) {
    let domain = 'unknown';
    try {
      domain = new URL(tab.url).hostname;
    } catch (_) {}
    if (!groups[domain]) groups[domain] = [];
    groups[domain].push(tab);
  }
  return groups;
}

module.exports = { formatTabsAsMarkdown, formatTabLine, groupTabsByDomain };

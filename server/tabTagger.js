// Assigns tags to tabs based on URL patterns and title keywords

const DEFAULT_RULES = [
  { tag: 'social', domains: ['twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'linkedin.com', 'reddit.com'] },
  { tag: 'video', domains: ['youtube.com', 'vimeo.com', 'twitch.tv', 'netflix.com'] },
  { tag: 'dev', domains: ['github.com', 'gitlab.com', 'stackoverflow.com', 'npmjs.com', 'developer.mozilla.org'] },
  { tag: 'docs', keywords: ['documentation', 'docs', 'reference', 'api guide', 'manual'] },
  { tag: 'news', domains: ['news.ycombinator.com', 'techcrunch.com', 'theverge.com', 'wired.com'] },
  { tag: 'shopping', domains: ['amazon.com', 'ebay.com', 'etsy.com'] },
];

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function tagTab(tab, rules = DEFAULT_RULES) {
  const tags = new Set();
  const domain = extractDomain(tab.url || '');
  const titleLower = (tab.title || '').toLowerCase();

  for (const rule of rules) {
    if (rule.domains && rule.domains.includes(domain)) {
      tags.add(rule.tag);
    }
    if (rule.keywords) {
      for (const kw of rule.keywords) {
        if (titleLower.includes(kw)) {
          tags.add(rule.tag);
          break;
        }
      }
    }
  }

  return { ...tab, tags: Array.from(tags) };
}

function tagTabs(tabs, rules = DEFAULT_RULES) {
  if (!Array.isArray(tabs)) return [];
  return tabs.map(tab => tagTab(tab, rules));
}

function filterByTag(tabs, tag) {
  if (!tag) return tabs;
  return tabs.filter(tab => Array.isArray(tab.tags) && tab.tags.includes(tag));
}

module.exports = { tagTab, tagTabs, filterByTag, extractDomain, DEFAULT_RULES };

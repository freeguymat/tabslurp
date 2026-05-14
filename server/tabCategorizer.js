// Categorizes tabs into predefined content categories based on URL and title

const CATEGORY_RULES = [
  { category: 'social', domains: ['twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'linkedin.com', 'reddit.com', 'mastodon.social'] },
  { category: 'dev', domains: ['github.com', 'gitlab.com', 'stackoverflow.com', 'npmjs.com', 'developer.mozilla.org', 'codepen.io'] },
  { category: 'news', domains: ['news.ycombinator.com', 'bbc.com', 'cnn.com', 'theguardian.com', 'reuters.com', 'nytimes.com'] },
  { category: 'video', domains: ['youtube.com', 'vimeo.com', 'twitch.tv', 'dailymotion.com'] },
  { category: 'docs', domains: ['docs.google.com', 'notion.so', 'confluence.atlassian.com', 'readthedocs.io'] },
  { category: 'shopping', domains: ['amazon.com', 'ebay.com', 'etsy.com', 'shopify.com'] },
];

const TITLE_KEYWORDS = {
  dev: ['api', 'documentation', 'tutorial', 'github', 'npm', 'package', 'library'],
  news: ['breaking', 'latest news', 'report', 'analysis'],
  docs: ['guide', 'reference', 'manual', 'docs', 'documentation'],
};

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function categorizeByDomain(url) {
  const domain = extractDomain(url);
  for (const rule of CATEGORY_RULES) {
    if (rule.domains.some(d => domain === d || domain.endsWith('.' + d))) {
      return rule.category;
    }
  }
  return null;
}

function categorizeByTitle(title = '') {
  const lower = title.toLowerCase();
  for (const [category, keywords] of Object.entries(TITLE_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return category;
    }
  }
  return null;
}

function categorizeTab(tab) {
  const category = categorizeByDomain(tab.url) || categorizeByTitle(tab.title) || 'other';
  return { ...tab, category };
}

function categorizeTabs(tabs) {
  return tabs.map(categorizeTab);
}

function groupByCategory(tabs) {
  const categorized = categorizeTabs(tabs);
  return categorized.reduce((acc, tab) => {
    const { category } = tab;
    if (!acc[category]) acc[category] = [];
    acc[category].push(tab);
    return acc;
  }, {});
}

function categorizeSummary(tabs) {
  const groups = groupByCategory(tabs);
  return Object.entries(groups).map(([category, items]) => ({
    category,
    count: items.length,
  })).sort((a, b) => b.count - a.count);
}

module.exports = { categorizeTab, categorizeTabs, groupByCategory, categorizeSummary, categorizeByDomain, categorizeByTitle };

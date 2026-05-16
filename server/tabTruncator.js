// Truncates tab titles and URLs to configurable max lengths

const DEFAULT_TITLE_MAX = 80;
const DEFAULT_URL_MAX = 120;

function truncateString(str, maxLength, ellipsis = '...') {
  if (typeof str !== 'string') return str;
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}

function truncateTitle(title, maxLength = DEFAULT_TITLE_MAX) {
  return truncateString(title, maxLength);
}

function truncateUrl(url, maxLength = DEFAULT_URL_MAX) {
  return truncateString(url, maxLength);
}

function truncateTab(tab, options = {}) {
  const {
    titleMax = DEFAULT_TITLE_MAX,
    urlMax = DEFAULT_URL_MAX,
  } = options;

  return {
    ...tab,
    title: truncateTitle(tab.title, titleMax),
    url: truncateUrl(tab.url, urlMax),
    originalTitle: tab.title,
    originalUrl: tab.url,
    truncated: tab.title.length > titleMax || tab.url.length > urlMax,
  };
}

function truncateTabs(tabs, options = {}) {
  if (!Array.isArray(tabs)) return [];
  return tabs.map(tab => truncateTab(tab, options));
}

function truncationSummary(tabs) {
  const truncated = tabs.filter(t => t.truncated);
  return {
    total: tabs.length,
    truncatedCount: truncated.length,
    truncatedTabs: truncated.map(t => ({ title: t.title, url: t.url })),
  };
}

module.exports = {
  truncateString,
  truncateTitle,
  truncateUrl,
  truncateTab,
  truncateTabs,
  truncationSummary,
};

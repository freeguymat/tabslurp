/**
 * Sorts tabs by various criteria
 */

/**
 * Sort tabs alphabetically by title
 * @param {Array} tabs
 * @returns {Array}
 */
function sortByTitle(tabs) {
  return [...tabs].sort((a, b) =>
    (a.title || '').localeCompare(b.title || '')
  );
}

/**
 * Sort tabs alphabetically by URL
 * @param {Array} tabs
 * @returns {Array}
 */
function sortByUrl(tabs) {
  return [...tabs].sort((a, b) =>
    (a.url || '').localeCompare(b.url || '')
  );
}

/**
 * Sort tabs by domain, then by title within each domain
 * @param {Array} tabs
 * @returns {Array}
 */
function sortByDomain(tabs) {
  return [...tabs].sort((a, b) => {
    const domainA = extractDomain(a.url);
    const domainB = extractDomain(b.url);
    const domainCmp = domainA.localeCompare(domainB);
    if (domainCmp !== 0) return domainCmp;
    return (a.title || '').localeCompare(b.title || '');
  });
}

/**
 * Extract domain from a URL string
 * @param {string} url
 * @returns {string}
 */
function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/**
 * Sort tabs using a named strategy
 * @param {Array} tabs
 * @param {'title'|'url'|'domain'} strategy
 * @returns {Array}
 */
function sortTabs(tabs, strategy = 'title') {
  switch (strategy) {
    case 'url':    return sortByUrl(tabs);
    case 'domain': return sortByDomain(tabs);
    case 'title':
    default:       return sortByTitle(tabs);
  }
}

module.exports = { sortTabs, sortByTitle, sortByUrl, sortByDomain, extractDomain };

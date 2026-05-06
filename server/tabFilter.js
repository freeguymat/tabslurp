/**
 * Filter tabs by various criteria
 */

const { extractDomain } = require('./tabSorter');

/**
 * Filter tabs by domain
 * @param {Array} tabs
 * @param {string} domain
 * @returns {Array}
 */
function filterByDomain(tabs, domain) {
  const normalized = domain.toLowerCase().replace(/^www\./, '');
  return tabs.filter(tab => {
    const tabDomain = extractDomain(tab.url).toLowerCase().replace(/^www\./, '');
    return tabDomain === normalized;
  });
}

/**
 * Filter tabs by keyword in title or URL
 * @param {Array} tabs
 * @param {string} keyword
 * @returns {Array}
 */
function filterByKeyword(tabs, keyword) {
  const lower = keyword.toLowerCase();
  return tabs.filter(tab =>
    (tab.title && tab.title.toLowerCase().includes(lower)) ||
    (tab.url && tab.url.toLowerCase().includes(lower))
  );
}

/**
 * Filter tabs by URL protocol
 * @param {Array} tabs
 * @param {string[]} protocols - e.g. ['http', 'https']
 * @returns {Array}
 */
function filterByProtocol(tabs, protocols) {
  const normalized = protocols.map(p => p.replace(/:$/, '').toLowerCase());
  return tabs.filter(tab => {
    try {
      const proto = new URL(tab.url).protocol.replace(/:$/, '').toLowerCase();
      return normalized.includes(proto);
    } catch {
      return false;
    }
  });
}

/**
 * Apply multiple filters based on a filter config object
 * @param {Array} tabs
 * @param {Object} filters - { domain, keyword, protocols }
 * @returns {Array}
 */
function applyFilters(tabs, filters = {}) {
  let result = [...tabs];
  if (filters.domain) result = filterByDomain(result, filters.domain);
  if (filters.keyword) result = filterByKeyword(result, filters.keyword);
  if (filters.protocols && filters.protocols.length > 0) {
    result = filterByProtocol(result, filters.protocols);
  }
  return result;
}

module.exports = { filterByDomain, filterByKeyword, filterByProtocol, applyFilters };

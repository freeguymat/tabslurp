/**
 * Compute statistics about a collection of tabs.
 */

const { extractDomain } = require('./tabSorter');

function countByDomain(tabs) {
  return tabs.reduce((acc, tab) => {
    const domain = extractDomain(tab.url);
    acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {});
}

function countByProtocol(tabs) {
  return tabs.reduce((acc, tab) => {
    try {
      const protocol = new URL(tab.url).protocol.replace(':', '');
      acc[protocol] = (acc[protocol] || 0) + 1;
    } catch {
      acc['unknown'] = (acc['unknown'] || 0) + 1;
    }
    return acc;
  }, {});
}

function topDomains(tabs, limit = 5) {
  const counts = countByDomain(tabs);
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([domain, count]) => ({ domain, count }));
}

function computeStats(tabs) {
  if (!Array.isArray(tabs) || tabs.length === 0) {
    return {
      total: 0,
      uniqueDomains: 0,
      byProtocol: {},
      topDomains: [],
    };
  }

  const domainCounts = countByDomain(tabs);

  return {
    total: tabs.length,
    uniqueDomains: Object.keys(domainCounts).length,
    byProtocol: countByProtocol(tabs),
    topDomains: topDomains(tabs),
  };
}

module.exports = { countByDomain, countByProtocol, topDomains, computeStats };

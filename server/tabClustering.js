/**
 * tabClustering.js
 * Groups tabs into clusters based on semantic similarity of titles and domains.
 */

const { extractDomain } = require('./tabSorter');

const KEYWORD_STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'in', 'to', 'for', 'is', 'on', 'at']);

function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !KEYWORD_STOP_WORDS.has(w));
}

function tabSignature(tab) {
  const domain = extractDomain(tab.url || '');
  const titleWords = extractKeywords(tab.title || '');
  return { domain, keywords: new Set(titleWords) };
}

function keywordOverlap(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  let shared = 0;
  for (const word of setA) {
    if (setB.has(word)) shared++;
  }
  return shared / Math.max(setA.size, setB.size);
}

function clusterTabs(tabs, options = {}) {
  const { keywordThreshold = 0.3, groupByDomainFirst = true } = options;

  if (!Array.isArray(tabs) || tabs.length === 0) return [];

  const signatures = tabs.map(tab => tabSignature(tab));
  const assigned = new Array(tabs.length).fill(false);
  const clusters = [];

  for (let i = 0; i < tabs.length; i++) {
    if (assigned[i]) continue;

    const cluster = { seed: tabs[i], tabs: [tabs[i]] };
    assigned[i] = true;

    for (let j = i + 1; j < tabs.length; j++) {
      if (assigned[j]) continue;

      const sameDomain = groupByDomainFirst && signatures[i].domain === signatures[j].domain;
      const overlap = keywordOverlap(signatures[i].keywords, signatures[j].keywords);

      if (sameDomain || overlap >= keywordThreshold) {
        cluster.tabs.push(tabs[j]);
        assigned[j] = true;
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}

function clusterSummary(clusters) {
  return {
    totalClusters: clusters.length,
    totalTabs: clusters.reduce((sum, c) => sum + c.tabs.length, 0),
    largestCluster: Math.max(...clusters.map(c => c.tabs.length), 0),
    singletonClusters: clusters.filter(c => c.tabs.length === 1).length,
  };
}

module.exports = { extractKeywords, tabSignature, keywordOverlap, clusterTabs, clusterSummary };

/**
 * Groups tabs by various criteria for organized export
 */

const { extractDomain } = require('./tabSorter');

function groupByDomain(tabs) {
  return tabs.reduce((groups, tab) => {
    const domain = extractDomain(tab.url);
    if (!groups[domain]) {
      groups[domain] = [];
    }
    groups[domain].push(tab);
    return groups;
  }, {});
}

function groupByWindow(tabs) {
  return tabs.reduce((groups, tab) => {
    const windowId = tab.windowId !== undefined ? String(tab.windowId) : 'unknown';
    if (!groups[windowId]) {
      groups[windowId] = [];
    }
    groups[windowId].push(tab);
    return groups;
  }, {});
}

function groupByProtocol(tabs) {
  return tabs.reduce((groups, tab) => {
    let protocol = 'other';
    try {
      protocol = new URL(tab.url).protocol.replace(':', '');
    } catch (_) {}
    if (!groups[protocol]) {
      groups[protocol] = [];
    }
    groups[protocol].push(tab);
    return groups;
  }, {});
}

const VALID_STRATEGIES = ['domain', 'window', 'protocol'];

function groupTabs(tabs, strategy = 'domain') {
  if (!Array.isArray(tabs)) {
    throw new Error('tabs must be an array');
  }
  if (!VALID_STRATEGIES.includes(strategy)) {
    throw new Error(`Invalid strategy "${strategy}". Must be one of: ${VALID_STRATEGIES.join(', ')}`);
  }
  switch (strategy) {
    case 'domain':   return groupByDomain(tabs);
    case 'window':   return groupByWindow(tabs);
    case 'protocol': return groupByProtocol(tabs);
  }
}

module.exports = { groupByDomain, groupByWindow, groupByProtocol, groupTabs, VALID_STRATEGIES };

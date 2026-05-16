// tabLinkChecker.js — check if tab URLs are reachable (basic heuristics, no real HTTP)

function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function classifyUrl(url) {
  if (!isValidUrl(url)) return 'invalid';
  const parsed = new URL(url);
  const host = parsed.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) {
    return 'local';
  }
  if (host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.')) {
    return 'private';
  }
  return 'external';
}

function checkTab(tab) {
  const url = tab.url || '';
  const classification = classifyUrl(url);
  return {
    url,
    title: tab.title || '',
    classification,
    valid: classification !== 'invalid',
    reachable: classification === 'external' ? null : classification !== 'invalid',
  };
}

function checkTabs(tabs) {
  if (!Array.isArray(tabs)) return [];
  return tabs.map(checkTab);
}

function getLinkCheckSummary(results) {
  const total = results.length;
  const invalid = results.filter(r => r.classification === 'invalid').length;
  const local = results.filter(r => r.classification === 'local').length;
  const privateNet = results.filter(r => r.classification === 'private').length;
  const external = results.filter(r => r.classification === 'external').length;
  return { total, invalid, local, private: privateNet, external };
}

module.exports = { isValidUrl, classifyUrl, checkTab, checkTabs, getLinkCheckSummary };

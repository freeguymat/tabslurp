// Assign color codes to tabs based on domain, protocol, or custom rules

const DEFAULT_COLORS = [
  'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'gray'
];

const PROTOCOL_COLORS = {
  'https:': 'green',
  'http:': 'orange',
  'file:': 'yellow',
  'chrome:': 'blue',
  'chrome-extension:': 'purple',
};

function getColorForProtocol(url) {
  try {
    const { protocol } = new URL(url);
    return PROTOCOL_COLORS[protocol] || 'gray';
  } catch {
    return 'gray';
  }
}

function getColorForDomain(domain, palette = DEFAULT_COLORS) {
  if (!domain) return 'gray';
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = (hash * 31 + domain.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}

function colorCodeTab(tab, strategy = 'domain', palette = DEFAULT_COLORS) {
  if (!tab || !tab.url) return { ...tab, color: 'gray' };

  let color;
  if (strategy === 'protocol') {
    color = getColorForProtocol(tab.url);
  } else {
    try {
      const { hostname } = new URL(tab.url);
      color = getColorForDomain(hostname, palette);
    } catch {
      color = 'gray';
    }
  }

  return { ...tab, color };
}

function colorCodeTabs(tabs, strategy = 'domain', palette = DEFAULT_COLORS) {
  if (!Array.isArray(tabs)) return [];
  return tabs.map(tab => colorCodeTab(tab, strategy, palette));
}

function groupByColor(tabs) {
  const coded = colorCodeTabs(tabs);
  return coded.reduce((acc, tab) => {
    const c = tab.color || 'gray';
    if (!acc[c]) acc[c] = [];
    acc[c].push(tab);
    return acc;
  }, {});
}

function colorSummary(tabs) {
  const groups = groupByColor(tabs);
  return Object.entries(groups).map(([color, items]) => ({
    color,
    count: items.length,
  }));
}

module.exports = {
  getColorForProtocol,
  getColorForDomain,
  colorCodeTab,
  colorCodeTabs,
  groupByColor,
  colorSummary,
};

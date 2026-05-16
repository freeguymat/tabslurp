// tabSharer.js — generate shareable representations of tabs

function getShareKey(tab) {
  return `share:${tab.url}`;
}

function buildShareText(tab) {
  const title = tab.title || 'Untitled';
  const url = tab.url || '';
  return `${title}\n${url}`;
}

function buildShareMarkdown(tab) {
  const title = tab.title || 'Untitled';
  const url = tab.url || '';
  return `[${title}](${url})`;
}

function buildShareJson(tab) {
  return JSON.stringify({ title: tab.title || 'Untitled', url: tab.url || '' }, null, 2);
}

function shareTab(tab, format = 'markdown') {
  if (!tab || !tab.url) throw new Error('Invalid tab: missing url');
  switch (format) {
    case 'text':
      return { format: 'text', content: buildShareText(tab) };
    case 'json':
      return { format: 'json', content: buildShareJson(tab) };
    case 'markdown':
    default:
      return { format: 'markdown', content: buildShareMarkdown(tab) };
  }
}

function shareTabs(tabs, format = 'markdown') {
  if (!Array.isArray(tabs)) throw new Error('tabs must be an array');
  return tabs.map(tab => shareTab(tab, format));
}

function buildShareBundle(tabs, format = 'markdown') {
  const shared = shareTabs(tabs, format);
  const contents = shared.map(s => s.content);
  const separator = format === 'text' ? '\n---\n' : '\n';
  return {
    format,
    count: tabs.length,
    bundle: contents.join(separator)
  };
}

module.exports = {
  getShareKey,
  buildShareText,
  buildShareMarkdown,
  buildShareJson,
  shareTab,
  shareTabs,
  buildShareBundle
};

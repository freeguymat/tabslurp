// tabExporter.js — export tabs in multiple formats (markdown, json, csv)

function exportAsMarkdown(tabs) {
  if (!Array.isArray(tabs)) return '';
  return tabs
    .map(tab => `- [${tab.title || 'Untitled'}](${tab.url})`)
    .join('\n');
}

function exportAsJson(tabs) {
  if (!Array.isArray(tabs)) return '[]';
  return JSON.stringify(
    tabs.map(tab => ({ title: tab.title || 'Untitled', url: tab.url })),
    null,
    2
  );
}

function exportAsCsv(tabs) {
  if (!Array.isArray(tabs)) return '';
  const header = 'title,url';
  const rows = tabs.map(tab => {
    const title = (tab.title || 'Untitled').replace(/"/g, '""');
    const url = (tab.url || '').replace(/"/g, '""');
    return `"${title}","${url}"`;
  });
  return [header, ...rows].join('\n');
}

const SUPPORTED_FORMATS = ['markdown', 'json', 'csv'];

function exportTabs(tabs, format = 'markdown') {
  if (!Array.isArray(tabs)) {
    throw new Error('tabs must be an array');
  }
  switch (format) {
    case 'markdown':
      return { format, content: exportAsMarkdown(tabs) };
    case 'json':
      return { format, content: exportAsJson(tabs) };
    case 'csv':
      return { format, content: exportAsCsv(tabs) };
    default:
      throw new Error(`Unsupported format: ${format}. Use one of: ${SUPPORTED_FORMATS.join(', ')}`);
  }
}

module.exports = {
  exportAsMarkdown,
  exportAsJson,
  exportAsCsv,
  exportTabs,
  SUPPORTED_FORMATS
};

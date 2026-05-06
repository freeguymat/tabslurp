// Search tabs by various criteria

function searchByTitle(tabs, query) {
  const q = query.toLowerCase();
  return tabs.filter(tab => tab.title && tab.title.toLowerCase().includes(q));
}

function searchByUrl(tabs, query) {
  const q = query.toLowerCase();
  return tabs.filter(tab => tab.url && tab.url.toLowerCase().includes(q));
}

function searchByTitleAndUrl(tabs, query) {
  const q = query.toLowerCase();
  return tabs.filter(tab => {
    const inTitle = tab.title && tab.title.toLowerCase().includes(q);
    const inUrl = tab.url && tab.url.toLowerCase().includes(q);
    return inTitle || inUrl;
  });
}

function searchTabs(tabs, options = {}) {
  if (!Array.isArray(tabs)) return [];

  const { query = '', field = 'all', caseSensitive = false } = options;

  if (!query || query.trim() === '') return tabs;

  const effectiveQuery = caseSensitive ? query : query.toLowerCase();

  const normalize = str =>
    caseSensitive ? (str || '') : (str || '').toLowerCase();

  return tabs.filter(tab => {
    const title = normalize(tab.title);
    const url = normalize(tab.url);

    if (field === 'title') return title.includes(effectiveQuery);
    if (field === 'url') return url.includes(effectiveQuery);
    return title.includes(effectiveQuery) || url.includes(effectiveQuery);
  });
}

module.exports = {
  searchByTitle,
  searchByUrl,
  searchByTitleAndUrl,
  searchTabs
};

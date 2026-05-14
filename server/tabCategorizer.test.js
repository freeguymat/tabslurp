const { categorizeTab, categorizeTabs, groupByCategory, categorizeSummary, categorizeByDomain, categorizeByTitle } = require('./tabCategorizer');

const sampleTabs = [
  { id: 1, url: 'https://github.com/user/repo', title: 'user/repo' },
  { id: 2, url: 'https://twitter.com/someone', title: 'Someone on Twitter' },
  { id: 3, url: 'https://youtube.com/watch?v=abc', title: 'Cool Video' },
  { id: 4, url: 'https://example.com/page', title: 'Some API documentation guide' },
  { id: 5, url: 'https://amazon.com/product', title: 'Buy stuff' },
  { id: 6, url: 'https://randomsite.xyz', title: 'just a page' },
];

describe('categorizeByDomain', () => {
  test('identifies github as dev', () => {
    expect(categorizeByDomain('https://github.com/repo')).toBe('dev');
  });

  test('identifies youtube as video', () => {
    expect(categorizeByDomain('https://youtube.com/watch')).toBe('video');
  });

  test('returns null for unknown domain', () => {
    expect(categorizeByDomain('https://unknown-site.xyz')).toBeNull();
  });

  test('handles www prefix', () => {
    expect(categorizeByDomain('https://www.reddit.com/r/all')).toBe('social');
  });
});

describe('categorizeByTitle', () => {
  test('detects dev from title keyword', () => {
    expect(categorizeByTitle('npm package guide')).toBe('dev');
  });

  test('detects docs from title keyword', () => {
    expect(categorizeByTitle('Full Reference Manual')).toBe('docs');
  });

  test('returns null for unrecognized title', () => {
    expect(categorizeByTitle('random stuff here')).toBeNull();
  });
});

describe('categorizeTab', () => {
  test('assigns category to tab', () => {
    const result = categorizeTab({ id: 1, url: 'https://github.com', title: 'GitHub' });
    expect(result.category).toBe('dev');
  });

  test('falls back to other for unknown tab', () => {
    const result = categorizeTab({ id: 9, url: 'https://obscure.io', title: 'nothing special' });
    expect(result.category).toBe('other');
  });

  test('preserves original tab fields', () => {
    const tab = { id: 2, url: 'https://twitter.com', title: 'Twitter' };
    const result = categorizeTab(tab);
    expect(result.id).toBe(2);
    expect(result.url).toBe(tab.url);
  });
});

describe('groupByCategory', () => {
  test('groups tabs into categories', () => {
    const groups = groupByCategory(sampleTabs);
    expect(groups.dev).toHaveLength(1);
    expect(groups.social).toHaveLength(1);
    expect(groups.video).toHaveLength(1);
    expect(groups.shopping).toHaveLength(1);
  });

  test('puts unknowns in other', () => {
    const groups = groupByCategory(sampleTabs);
    expect(groups.other).toBeDefined();
  });
});

describe('categorizeSummary', () => {
  test('returns sorted summary array', () => {
    const summary = categorizeSummary(sampleTabs);
    expect(Array.isArray(summary)).toBe(true);
    expect(summary[0]).toHaveProperty('category');
    expect(summary[0]).toHaveProperty('count');
  });

  test('sorted descending by count', () => {
    const tabs = [
      { id: 1, url: 'https://github.com', title: 'g' },
      { id: 2, url: 'https://gitlab.com', title: 'gl' },
      { id: 3, url: 'https://twitter.com', title: 't' },
    ];
    const summary = categorizeSummary(tabs);
    expect(summary[0].count).toBeGreaterThanOrEqual(summary[1].count);
  });
});

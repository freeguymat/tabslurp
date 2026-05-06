const { searchByTitle, searchByUrl, searchByTitleAndUrl, searchTabs } = require('./tabSearcher');

const sampleTabs = [
  { title: 'GitHub - Home', url: 'https://github.com' },
  { title: 'Google Search', url: 'https://google.com/search?q=test' },
  { title: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com/questions' },
  { title: null, url: 'https://example.com' }
];

describe('searchByTitle', () => {
  it('returns tabs matching title query', () => {
    const result = searchByTitle(sampleTabs, 'github');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('GitHub - Home');
  });

  it('is case-insensitive', () => {
    const result = searchByTitle(sampleTabs, 'GOOGLE');
    expect(result).toHaveLength(1);
  });

  it('handles tabs with null title gracefully', () => {
    expect(() => searchByTitle(sampleTabs, 'example')).not.toThrow();
  });
});

describe('searchByUrl', () => {
  it('returns tabs matching url query', () => {
    const result = searchByUrl(sampleTabs, 'stackoverflow');
    expect(result).toHaveLength(1);
    expect(result[0].url).toContain('stackoverflow');
  });

  it('matches partial url', () => {
    const result = searchByUrl(sampleTabs, 'mozilla');
    expect(result).toHaveLength(1);
  });
});

describe('searchByTitleAndUrl', () => {
  it('matches tabs by title or url', () => {
    const result = searchByTitleAndUrl(sampleTabs, 'search');
    // matches Google Search (title) and google.com/search (url) — same tab
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});

describe('searchTabs', () => {
  it('returns all tabs when query is empty', () => {
    const result = searchTabs(sampleTabs, { query: '' });
    expect(result).toHaveLength(sampleTabs.length);
  });

  it('searches title field only when field=title', () => {
    const result = searchTabs(sampleTabs, { query: 'github', field: 'title' });
    expect(result).toHaveLength(1);
  });

  it('searches url field only when field=url', () => {
    const result = searchTabs(sampleTabs, { query: 'github', field: 'url' });
    expect(result).toHaveLength(1);
  });

  it('respects caseSensitive option', () => {
    const result = searchTabs(sampleTabs, { query: 'github', caseSensitive: true });
    expect(result).toHaveLength(0);
  });

  it('returns empty array for non-array input', () => {
    expect(searchTabs(null, { query: 'test' })).toEqual([]);
  });
});
